from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from models.waiver import FeeWaiver, FeeWaiverCreateRequest, FeeWaiverReviewRequest
from lib.db import db

router = APIRouter(tags=["fee-waivers"])

@router.post("/fee-waivers", response_model=FeeWaiver)
async def create_waiver(req: FeeWaiverCreateRequest):
    application = await db.synthetic_applications.find_one({"application_id": req.application_id})
    if not application:
        application = await db.synthetic_applications.find_one({"id": req.application_id})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    startup_id = application.get("startup_id", application.get("startupId", "ST-003"))
    
    existing = await db.synthetic_fee_waivers.find_one({
        "application_id": req.application_id, 
        "status": {"$in": ["PENDING", "APPROVED"]}
    })
    if existing:
        raise HTTPException(status_code=400, detail="Active waiver request already exists for this application")
        
    waiver = FeeWaiver(
        startup_id=startup_id,
        challenge_id=req.challenge_id,
        application_id=req.application_id,
        reason=req.reason,
        documents=req.documents
    )
    
    await db.synthetic_fee_waivers.insert_one(waiver.model_dump(by_alias=True))
    
    await db.synthetic_applications.update_one(
        {"application_id": req.application_id},
        {"$set": {"fee_waiver_status": "PENDING"}}
    )
    
    return waiver

@router.get("/fee-waivers/my-requests", response_model=List[FeeWaiver])
async def my_requests(startup_id: Optional[str] = "ST-003"):
    cursor = db.synthetic_fee_waivers.find({"startup_id": startup_id}).sort("created_at", -1)
    waivers = await cursor.to_list(length=100)
    return [FeeWaiver(**w) for w in waivers]

@router.get("/admin/fee-waivers", response_model=List[FeeWaiver])
async def get_all_waivers():
    cursor = db.synthetic_fee_waivers.find({}).sort("created_at", -1)
    waivers = await cursor.to_list(length=1000)
    return [FeeWaiver(**w) for w in waivers]

@router.get("/fee-waivers/{waiver_id}", response_model=FeeWaiver)
async def get_waiver(waiver_id: str):
    waiver = await db.synthetic_fee_waivers.find_one({"id": waiver_id})
    if not waiver:
        raise HTTPException(status_code=404, detail="Waiver not found")
    return FeeWaiver(**waiver)

@router.patch("/fee-waivers/{waiver_id}", response_model=FeeWaiver)
async def review_waiver(waiver_id: str, req: FeeWaiverReviewRequest):
    waiver = await db.synthetic_fee_waivers.find_one({"id": waiver_id})
    if not waiver:
        raise HTTPException(status_code=404, detail="Waiver not found")
        
    if req.status not in ["APPROVED", "REJECTED"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    update_data = {
        "status": req.status,
        "reviewer_remarks": req.reviewer_remarks,
        "reviewer_id": "ADMIN-01",
        "reviewed_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    await db.synthetic_fee_waivers.update_one({"id": waiver_id}, {"$set": update_data})
    
    app_update = {"fee_waiver_status": req.status}
    if req.status == "APPROVED":
        app_update["payment_status"] = "WAIVED"
        app_update["status"] = "Submitted"
        
    await db.synthetic_applications.update_one(
        {"application_id": waiver["application_id"]},
        {"$set": app_update}
    )
    
    waiver.update(update_data)
    return FeeWaiver(**waiver)
