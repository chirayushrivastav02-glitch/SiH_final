from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from lib.matching_engine import analyze_challenge

router = APIRouter(prefix="/matching", tags=["matching"])

class MatchingRequest(BaseModel):
    challenge_id: str

class MatchingResultItem(BaseModel):
    rank: int
    startup_id: str
    startup_name: str
    overall_score: float
    eligible: bool
    technology_fit: float
    problem_similarity: float
    sector_fit: float
    experience_fit: float
    team_fit: float
    scalability_fit: float
    revenue_fit: float
    location_fit: float
    reasons: List[str]
    concerns: List[str]

class MatchingResponse(BaseModel):
    challenge_id: str
    applications_analyzed: int
    eligible_count: int
    results: List[MatchingResultItem]

@router.post("/analyze", response_model=MatchingResponse)
async def analyze_matching(request: MatchingRequest):
    try:
        response_data = await analyze_challenge(request.challenge_id)
        return response_data
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
