import os
from fastapi import APIRouter, HTTPException, Request
from typing import List, Optional
from datetime import datetime
import razorpay
from models.refund import RefundRecord, RefundEligibilityResponse
from lib.db import db

router = APIRouter(tags=["refunds"])

RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "test_key_id")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "test_key_secret")
RAZORPAY_WEBHOOK_SECRET = os.environ.get("RAZORPAY_WEBHOOK_SECRET", "test_webhook_secret")
REFUND_PERCENTAGE = float(os.environ.get("REFUND_PROCESSING_FEE_PERCENTAGE", 10))

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

@router.get("/payments/{payment_id}/refund-eligibility", response_model=RefundEligibilityResponse)
async def check_refund_eligibility(payment_id: str):
    payment = await db.synthetic_payments.find_one({"id": payment_id})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
        
    app = await db.synthetic_applications.find_one({"application_id": payment["application_id"]})
    if not app:
        app = await db.synthetic_applications.find_one({"id": payment["application_id"]})
        
    if payment["status"] != "SUCCESS":
        return RefundEligibilityResponse(eligible=False, reason="Payment was not successful", original_amount=payment["amount_in_rupees"], processing_fee=0, refundable_amount=0)
        
    if app and app.get("payment_status") == "WAIVED":
        return RefundEligibilityResponse(eligible=False, reason="Application was fee-waived", original_amount=payment["amount_in_rupees"], processing_fee=0, refundable_amount=0)
        
    if app and app.get("status") in ["Selected", "Pilot"]:
        return RefundEligibilityResponse(eligible=False, reason="Application is selected, not eligible for refund", original_amount=payment["amount_in_rupees"], processing_fee=0, refundable_amount=0)
        
    existing_refund = await db.synthetic_refunds.find_one({"payment_id": payment_id, "status": {"$ne": "FAILED"}})
    if existing_refund:
        return RefundEligibilityResponse(eligible=False, reason="Refund already requested or completed", original_amount=payment["amount_in_rupees"], processing_fee=0, refundable_amount=0)
        
    original = payment["amount_in_rupees"]
    processing = int(original * (REFUND_PERCENTAGE / 100))
    refundable = original - processing
    
    return RefundEligibilityResponse(eligible=True, reason="Application not selected", original_amount=original, processing_fee=processing, refundable_amount=refundable)

@router.post("/payments/{payment_id}/refund-request", response_model=RefundRecord)
async def request_refund(payment_id: str):
    eligibility = await check_refund_eligibility(payment_id)
    if not eligibility.eligible:
        raise HTTPException(status_code=400, detail=f"Not eligible: {eligibility.reason}")
        
    payment = await db.synthetic_payments.find_one({"id": payment_id})
    
    processing_fee_paise = eligibility.processing_fee * 100
    refundable_amount_paise = eligibility.refundable_amount * 100
    
    refund = RefundRecord(
        payment_id=payment_id,
        startup_id=payment["startup_id"],
        challenge_id=payment["challenge_id"],
        application_id=payment["application_id"],
        original_amount=payment["amount"],
        processing_fee=processing_fee_paise,
        refundable_amount=refundable_amount_paise,
        eligibility_reason=eligibility.reason,
        gateway_payment_id=payment["gateway_payment_id"]
    )
    
    await db.synthetic_refunds.insert_one(refund.model_dump(by_alias=True))
    
    await db.synthetic_applications.update_one(
        {"application_id": payment["application_id"]},
        {"$set": {"refund_status": "REQUESTED"}}
    )
    
    return refund

@router.post("/admin/refunds/{refund_id}/initiate")
async def initiate_refund(refund_id: str):
    refund = await db.synthetic_refunds.find_one({"id": refund_id})
    if not refund:
        raise HTTPException(status_code=404, detail="Refund not found")
        
    if refund["status"] not in ["ELIGIBLE", "REQUESTED"]:
        raise HTTPException(status_code=400, detail="Invalid refund status")
        
    if refund.get("gateway_refund_id"):
        raise HTTPException(status_code=400, detail="Gateway refund already exists")
        
    try:
        data = {
            "amount": refund["refundable_amount"],
            "receipt": refund["id"]
        }
        rzp_refund = client.payment.refund(refund["gateway_payment_id"], data)
        
        await db.synthetic_refunds.update_one(
            {"id": refund_id},
            {"$set": {
                "status": "PROCESSING",
                "gateway_refund_id": rzp_refund["id"],
                "updated_at": datetime.utcnow().isoformat()
            }}
        )
        return {"success": True, "refund_id": rzp_refund["id"]}
    except Exception as e:
        await db.synthetic_refunds.update_one(
            {"id": refund_id},
            {"$set": {
                "status": "FAILED",
                "failure_reason": str(e),
                "updated_at": datetime.utcnow().isoformat()
            }}
        )
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/payments/refund-webhook")
async def razorpay_refund_webhook(request: Request):
    payload = await request.body()
    signature = request.headers.get("X-Razorpay-Signature")
    
    if not signature:
        raise HTTPException(status_code=400, detail="Missing signature")
        
    try:
        client.utility.verify_webhook_signature(payload.decode('utf-8'), signature, RAZORPAY_WEBHOOK_SECRET)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid webhook signature")
        
    data = await request.json()
    event_id = data.get("id")
    event_type = data.get("event")
    
    existing_event = await db.synthetic_payment_events.find_one({"event_id": event_id})
    if existing_event:
        return {"status": "ignored", "message": "Event already processed"}
        
    await db.synthetic_payment_events.insert_one({"event_id": event_id, "data": data})
    
    if event_type == "refund.processed":
        refund_entity = data['payload']['refund']['entity']
        gateway_refund_id = refund_entity.get("id")
        
        refund = await db.synthetic_refunds.find_one({"gateway_refund_id": gateway_refund_id})
        if refund:
            await db.synthetic_refunds.update_one(
                {"id": refund["id"]},
                {"$set": {
                    "status": "COMPLETED",
                    "completed_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                }}
            )
            
            await db.synthetic_applications.update_one(
                {"application_id": refund["application_id"]},
                {"$set": {"refund_status": "REFUNDED"}}
            )
            
            await db.synthetic_payments.update_one(
                {"id": refund["payment_id"]},
                {"$set": {"refund_status": "COMPLETED"}}
            )
            
    return {"status": "ok"}

@router.get("/refunds/my-refunds", response_model=List[RefundRecord])
async def my_refunds(startup_id: Optional[str] = "ST-003"):
    cursor = db.synthetic_refunds.find({"startup_id": startup_id}).sort("created_at", -1)
    refunds = await cursor.to_list(length=100)
    return [RefundRecord(**r) for r in refunds]

@router.get("/admin/refunds", response_model=List[RefundRecord])
async def admin_refunds():
    cursor = db.synthetic_refunds.find({}).sort("created_at", -1)
    refunds = await cursor.to_list(length=1000)
    return [RefundRecord(**r) for r in refunds]

@router.get("/refunds/{refund_id}", response_model=RefundRecord)
async def get_refund(refund_id: str):
    refund = await db.synthetic_refunds.find_one({"id": refund_id})
    if not refund:
        raise HTTPException(status_code=404, detail="Refund not found")
    return RefundRecord(**refund)
