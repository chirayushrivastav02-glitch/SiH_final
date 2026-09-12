from fastapi import APIRouter, HTTPException
from typing import List
from models.domain import Challenge
from lib.db import db
import uuid
from datetime import datetime

router = APIRouter(prefix="/challenges", tags=["challenges"])

@router.get("", response_model=List[Challenge])
async def list_challenges():
    cursor = db.synthetic_challenges.find({})
    challenges = await cursor.to_list(length=100)
    
    # Map MongoDB _id to id if needed, but our synthetic data has challenge_id
    # We map challenge_id to id for the frontend
    mapped_challenges = []
    for c in challenges:
        c_dict = c.copy()
        if "challenge_id" in c_dict and "id" not in c_dict:
            c_dict["id"] = c_dict["challenge_id"]
        
        # Ensure status exists
        if "status" not in c_dict:
             c_dict["status"] = "Published"
             
        # Mock applications count if missing
        if "applications" not in c_dict:
             c_dict["applications"] = 0
             
        # Mock shortlisted count if missing
        if "shortlisted" not in c_dict:
             c_dict["shortlisted"] = 0
             
        # Mock tags if missing
        if "tags" not in c_dict:
             c_dict["tags"] = []
             
        # Map required_technologies to technicalRequirements string if missing
        if "technicalRequirements" not in c_dict:
             c_dict["technicalRequirements"] = ", ".join(c_dict.get("required_technologies", []))
             
        # Mock evaluation criteria if missing
        if "evaluationCriteria" not in c_dict:
             c_dict["evaluationCriteria"] = {
                 "technical": 30,
                 "innovation": 20,
                 "scalability": 20,
                 "team": 10,
                 "financial": 10,
                 "cost": 10
             }
             
        # Mock problem if missing
        if "problem" not in c_dict:
             c_dict["problem"] = c_dict.get("problem_statement", "No problem statement provided.")
             
        # Mock currentSituation if missing
        if "currentSituation" not in c_dict:
             c_dict["currentSituation"] = c_dict.get("detailed_description", "No detailed description.")
             
        # Mock deliverables if missing
        if "deliverables" not in c_dict:
             c_dict["deliverables"] = "Standard deliverables."
             
        # Mock successMetrics if missing
        if "successMetrics" not in c_dict:
             c_dict["successMetrics"] = "Standard success metrics."
             
        # Mock budget if missing
        if "budget" not in c_dict:
             c_dict["budget"] = f"₹{c_dict.get('budget_limit_lakhs', 50)} Lakhs"
             
        # Mock budgetRange if missing
        if "budgetRange" not in c_dict:
             c_dict["budgetRange"] = {"min": 10, "max": c_dict.get('budget_limit_lakhs', 50)}
             
        # Mock procurementPathway if missing
        if "procurementPathway" not in c_dict:
             c_dict["procurementPathway"] = "GeM Portal"
             
        # Map deadline if missing
        if "deadline" not in c_dict:
             c_dict["deadline"] = c_dict.get("submission_deadline", "2024-12-31")
             
        # Map title if missing
        if "title" not in c_dict:
             c_dict["title"] = c_dict.get("challenge_title", "Untitled Challenge")
             
        mapped_challenges.append(Challenge(**c_dict))
        
    return mapped_challenges

@router.get("/{challenge_id}", response_model=Challenge)
async def get_challenge(challenge_id: str):
    challenge = await db.synthetic_challenges.find_one({"challenge_id": challenge_id})
    if not challenge:
        # Fallback to ID for created challenges
        challenge = await db.synthetic_challenges.find_one({"id": challenge_id})
        if not challenge:
            raise HTTPException(status_code=404, detail="Challenge not found")
            
    c_dict = challenge.copy()
    if "challenge_id" in c_dict and "id" not in c_dict:
        c_dict["id"] = c_dict["challenge_id"]
        
    # Same mapping logic as above (in a real app, this would be a shared function)
    if "status" not in c_dict: c_dict["status"] = "Published"
    if "applications" not in c_dict: c_dict["applications"] = 0
    if "shortlisted" not in c_dict: c_dict["shortlisted"] = 0
    if "tags" not in c_dict: c_dict["tags"] = []
    if "technicalRequirements" not in c_dict: c_dict["technicalRequirements"] = ", ".join(c_dict.get("required_technologies", []))
    if "evaluationCriteria" not in c_dict: c_dict["evaluationCriteria"] = {"technical": 30, "innovation": 20, "scalability": 20, "team": 10, "financial": 10, "cost": 10}
    if "problem" not in c_dict: c_dict["problem"] = c_dict.get("problem_statement", "No problem statement provided.")
    if "currentSituation" not in c_dict: c_dict["currentSituation"] = c_dict.get("detailed_description", "No detailed description.")
    if "deliverables" not in c_dict: c_dict["deliverables"] = "Standard deliverables."
    if "successMetrics" not in c_dict: c_dict["successMetrics"] = "Standard success metrics."
    if "budget" not in c_dict: c_dict["budget"] = f"₹{c_dict.get('budget_limit_lakhs', 50)} Lakhs"
    if "budgetRange" not in c_dict: c_dict["budgetRange"] = {"min": 10, "max": c_dict.get('budget_limit_lakhs', 50)}
    if "procurementPathway" not in c_dict: c_dict["procurementPathway"] = "GeM Portal"
    if "deadline" not in c_dict: c_dict["deadline"] = c_dict.get("submission_deadline", "2024-12-31")
    if "title" not in c_dict: c_dict["title"] = c_dict.get("challenge_title", "Untitled Challenge")
    
    return Challenge(**c_dict)

@router.post("", response_model=Challenge)
async def create_challenge(challenge: dict):
    # In a real app we'd validate with Pydantic first
    new_challenge = challenge.copy()
    if "id" not in new_challenge:
        new_challenge["id"] = f"CH-{datetime.now().year}-{str(uuid.uuid4())[:6].upper()}"
        
    # We also store challenge_id for the synthetic matching engine
    new_challenge["challenge_id"] = new_challenge["id"]
    new_challenge["challenge_title"] = new_challenge.get("title", "")
    
    await db.synthetic_challenges.insert_one(new_challenge)
    
    # Return without the _id field
    new_challenge.pop("_id", None)
    return Challenge(**new_challenge)
