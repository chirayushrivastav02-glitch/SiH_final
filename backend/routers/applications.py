from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models.domain import Application
from lib.db import db
import uuid
from datetime import datetime

router = APIRouter(prefix="/applications", tags=["applications"])

@router.get("", response_model=List[Application])
async def list_applications(challenge_id: Optional[str] = None, startup_id: Optional[str] = None):
    query = {}
    if challenge_id:
        query["challenge_id"] = challenge_id
    if startup_id:
        query["startup_id"] = startup_id
        
    cursor = db.synthetic_applications.find(query)
    apps = await cursor.to_list(length=100)
    
    mapped = []
    for a in apps:
        a_dict = a.copy()
        if "application_id" in a_dict and "id" not in a_dict:
            a_dict["id"] = a_dict["application_id"]
        if "challengeId" not in a_dict: a_dict["challengeId"] = a_dict.get("challenge_id", "")
        if "startupId" not in a_dict: a_dict["startupId"] = a_dict.get("startup_id", "")
        if "startupName" not in a_dict: a_dict["startupName"] = a_dict.get("startup_name", "Unknown Startup")
        if "submittedDate" not in a_dict: a_dict["submittedDate"] = a_dict.get("submission_date", "2024-01-01")
        if "status" not in a_dict: a_dict["status"] = "Submitted"
        if "proposedSolution" not in a_dict: a_dict["proposedSolution"] = a_dict.get("proposal_summary", "")
        if "pilotBudget" not in a_dict: a_dict["pilotBudget"] = f"₹{a_dict.get('estimated_budget', 0)} Lakhs"
        if "pilotDuration" not in a_dict: a_dict["pilotDuration"] = "6 months"
        if "pilotScope" not in a_dict: a_dict["pilotScope"] = "Scope"
        if "teamLead" not in a_dict: a_dict["teamLead"] = "Lead"
        if "totalTeam" not in a_dict: a_dict["totalTeam"] = "5 members"
        if "previousGovtWork" not in a_dict: a_dict["previousGovtWork"] = "None"
        if "evaluationComments" not in a_dict: a_dict["evaluationComments"] = []
        
        mapped.append(Application(**a_dict))
    
    return mapped

@router.post("", response_model=Application)
async def submit_application(app_data: dict):
    new_app = app_data.copy()
    if "id" not in new_app:
        new_app["id"] = f"APP-{datetime.now().year}-{str(uuid.uuid4())[:6].upper()}"
        
    new_app["application_id"] = new_app["id"]
    new_app["challenge_id"] = new_app.get("challengeId", "")
    new_app["startup_id"] = new_app.get("startupId", "")
    new_app["startup_name"] = new_app.get("startupName", "Unknown")
    new_app["submission_date"] = datetime.now().strftime("%Y-%m-%d")
    new_app["status"] = app_data.get("status", "Submitted")
    
    await db.synthetic_applications.insert_one(new_app)
    new_app.pop("_id", None)
    
    return Application(**new_app)
