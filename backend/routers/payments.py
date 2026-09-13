import os
import hmac
import hashlib
from fastapi import APIRouter, HTTPException, Request
from typing import List, Optional
from datetime import datetime
import razorpay
from models.payment import (
    OrderCreateRequest, OrderCreateResponse, PaymentVerifyRequest, PaymentRecord
)
from lib.db import db

router = APIRouter(prefix="/payments", tags=["payments"])

# Configuration
RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "test_key_id")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "test_key_secret")
RAZORPAY_WEBHOOK_SECRET = os.environ.get("RAZORPAY_WEBHOOK_SECRET", "test_webhook_secret")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

@router.post("/create-order", response_model=OrderCreateResponse)
async def create_order(req: OrderCreateRequest):
    # Retrieve challenge
    challenge = await db.synthetic_challenges.find_one({"challenge_id": req.challenge_id})
    if not challenge:
        challenge = await db.synthetic_challenges.find_one({"id": req.challenge_id})
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
        
    # Retrieve application
    application = await db.synthetic_applications.find_one({"application_id": req.application_id})
    if not application:
        application = await db.synthetic_applications.find_one({"id": req.application_id})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    startup_id = application.get("startup_id", application.get("startupId", "ST-003"))
    startup_name = application.get("startup_name", application.get("startupName", "Unknown Startup"))
    challenge_title = challenge.get("challenge_title", challenge.get("title", "Unknown Challenge"))

    amount_in_rupees = 50000
    amount_in_paise = amount_in_rupees * 100
    
    try:
        order_data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": req.application_id,
            "notes": {
                "challenge_id": req.challenge_id,
                "startup_id": startup_id
            }
        }
        order = client.order.create(data=order_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gateway error: {str(e)}")

    payment_record = PaymentRecord(
        startup_id=startup_id,
        challenge_id=req.challenge_id,
        application_id=req.application_id,
        gateway_order_id=order['id'],
        amount=amount_in_paise,
        amount_in_rupees=amount_in_rupees
    )
    
    await db.synthetic_payments.insert_one(payment_record.model_dump(by_alias=True))
    
    return OrderCreateResponse(
        payment_id=payment_record.id,
        gateway_order_id=order['id'],
        amount=amount_in_paise,
        currency="INR",
        key_id=RAZORPAY_KEY_ID,
        startup_name=startup_name,
        challenge_title=challenge_title
    )

@router.post("/verify")
async def verify_payment(req: PaymentVerifyRequest):
    payment = await db.synthetic_payments.find_one({"id": req.payment_id})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")
        
    if payment.get("status") == "SUCCESS":
        return {"success": True, "message": "Already verified"}

    if payment.get("gateway_order_id") != req.razorpay_order_id:
        raise HTTPException(status_code=400, detail="Order ID mismatch")

    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': req.razorpay_order_id,
            'razorpay_payment_id': req.razorpay_payment_id,
            'razorpay_signature': req.razorpay_signature
        })
    except Exception:
        await db.synthetic_payments.update_one(
            {"id": req.payment_id},
            {"$set": {"status": "FAILED", "updated_at": datetime.utcnow().isoformat(), "failure_reason": "Invalid signature"}}
        )
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    await db.synthetic_payments.update_one(
        {"id": req.payment_id},
        {"$set": {
            "status": "SUCCESS", 
            "gateway_payment_id": req.razorpay_payment_id,
            "updated_at": datetime.utcnow().isoformat(),
            "verified_at": datetime.utcnow().isoformat()
        }}
    )
    
    await db.synthetic_applications.update_one(
        {"application_id": payment["application_id"]},
        {"$set": {"status": "Submitted", "payment_status": "PAID"}}
    )
    
    return {"success": True, "message": "Payment verified successfully"}


@router.post("/webhook")
async def razorpay_webhook(request: Request):
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
    
    if event_type == "payment.captured":
        payment_entity = data['payload']['payment']['entity']
        order_id = payment_entity.get("order_id")
        if order_id:
            await db.synthetic_payments.update_many(
                {"gateway_order_id": order_id, "status": "CREATED"},
                {"$set": {"status": "SUCCESS", "gateway_payment_id": payment_entity.get("id"), "updated_at": datetime.utcnow().isoformat()}}
            )
            
    return {"status": "ok"}


@router.get("/my-payments", response_model=List[PaymentRecord])
async def get_my_payments(startup_id: Optional[str] = "ST-003"):
    cursor = db.synthetic_payments.find({"startup_id": startup_id}).sort("created_at", -1)
    payments = await cursor.to_list(length=100)
    return [PaymentRecord(**p) for p in payments]
    
@router.get("/admin/payments", response_model=List[PaymentRecord])
async def get_admin_payments():
    cursor = db.synthetic_payments.find({}).sort("created_at", -1)
    payments = await cursor.to_list(length=1000)
    return [PaymentRecord(**p) for p in payments]

@router.get("/{payment_id}", response_model=PaymentRecord)
async def get_payment_details(payment_id: str):
    payment = await db.synthetic_payments.find_one({"id": payment_id})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return PaymentRecord(**payment)
