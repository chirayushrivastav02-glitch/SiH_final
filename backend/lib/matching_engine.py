import logging
from typing import List, Dict, Any

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from .db import db
from .matching_config import WEIGHTS, SBERT_MODEL_NAME

logger = logging.getLogger(__name__)

# Load model globally to avoid reloading on every request
# This takes some RAM but is fast for inference
logger.info(f"Loading SBERT Model: {SBERT_MODEL_NAME}")
try:
    model = SentenceTransformer(SBERT_MODEL_NAME)
except Exception as e:
    logger.error(f"Failed to load model {SBERT_MODEL_NAME}: {e}")
    model = None


async def retrieve_challenge(challenge_id: str) -> Dict[str, Any]:
    """Retrieve challenge details."""
    challenge = await db.synthetic_challenges.find_one({"challenge_id": challenge_id})
    return challenge

async def retrieve_startups_for_challenge(challenge_id: str) -> List[Dict[str, Any]]:
    """Retrieve all startups that have applied to a specific challenge."""
    cursor = db.synthetic_applications.find({"challenge_id": challenge_id})
    applications = await cursor.to_list(length=None)
    
    if not applications:
        return []
        
    startup_ids = [app["startup_id"] for app in applications]
    
    cursor = db.synthetic_startups.find({"startup_id": {"$in": startup_ids}})
    startups = await cursor.to_list(length=None)
    
    return startups


def check_hard_eligibility(challenge: Dict[str, Any], startup: Dict[str, Any]) -> tuple[bool, List[str]]:
    """Check mandatory requirements before scoring."""
    eligible = True
    reasons = []
    
    if startup.get("years_of_relevant_experience", 0) < challenge.get("minimum_experience_years", 0):
        eligible = False
        reasons.append("Minimum experience requirement not met.")
        
    req_techs = set(challenge.get("required_technologies", []))
    startup_techs = set(startup.get("primary_technologies", []) + startup.get("secondary_technologies", []))
    
    if req_techs and len(req_techs.intersection(startup_techs)) == 0:
        eligible = False
        reasons.append("Mandatory technology absent.")
        
    req_certs = set(challenge.get("required_certifications", []))
    # Synthetic data often has "None" in required_certifications. Ignore "None" requirement.
    if req_certs and "None" not in req_certs:
        startup_certs = set(startup.get("certifications", []))
        if len(req_certs.intersection(startup_certs)) == 0:
            eligible = False
            reasons.append("Required certification missing.")
            
    return eligible, reasons


def calculate_semantic_similarity(challenge: Dict[str, Any], startup: Dict[str, Any]) -> float:
    """Calculate cosine similarity between challenge description and startup description using SBERT."""
    if model is None:
        return 0.0
        
    ch_text = f"{challenge.get('challenge_title', '')} {challenge.get('problem_statement', '')} {challenge.get('detailed_description', '')}"
    st_text = f"{startup.get('startup_name', '')} {startup.get('short_description', '')} {startup.get('detailed_description', '')}"
    
    ch_embedding = model.encode([ch_text])
    st_embedding = model.encode([st_text])
    
    sim = cosine_similarity(ch_embedding, st_embedding)[0][0]
    return max(0.0, min(100.0, float(sim * 100)))


def calculate_structured_scores(challenge: Dict[str, Any], startup: Dict[str, Any]) -> Dict[str, float]:
    """Calculate non-text criteria separately."""
    req_techs = set(challenge.get("required_technologies", []))
    startup_techs = set(startup.get("primary_technologies", []) + startup.get("secondary_technologies", []))
    
    # Technology Fit
    if not req_techs:
        tech_fit = 100.0
    else:
        tech_overlap = len(req_techs.intersection(startup_techs))
        tech_fit = min(100.0, (tech_overlap / max(1, len(req_techs))) * 100.0)
        
    # Sector Fit
    ch_sector = challenge.get("sector")
    st_sector = startup.get("sector")
    st_sub_sectors = startup.get("sub_sectors", [])
    
    if ch_sector == st_sector:
        sector_fit = 100.0
    elif ch_sector in st_sub_sectors:
        sector_fit = 50.0
    else:
        sector_fit = 0.0
        
    # Experience Fit
    req_exp = challenge.get("minimum_experience_years", 0)
    st_exp = startup.get("years_of_relevant_experience", 0)
    if st_exp >= req_exp:
        exp_fit = 100.0
    else:
        exp_fit = max(0.0, 100.0 - (req_exp - st_exp) * 20.0)
        
    # Team Fit
    team_cap = startup.get("team_capabilities", "Average")
    if team_cap == "Strong":
        team_fit = 90.0
    elif team_cap == "Specialized":
        team_fit = 70.0
    else:
        team_fit = 50.0
        
    # Scalability Fit
    scale_lvl = startup.get("scalability_level", "Medium")
    if scale_lvl == "High":
        scale_fit = 100.0
    elif scale_lvl == "Medium":
        scale_fit = 60.0
    else:
        scale_fit = 30.0
        
    # Revenue Fit
    revenue = startup.get("annual_revenue", 0)
    revenue_fit = min(100.0, (revenue / 10000000) * 100.0)
    
    # Location Fit
    ch_loc = challenge.get("location")
    st_loc = startup.get("preferred_deployment_locations")
    if ch_loc == "Pan India" or st_loc == "Pan India" or ch_loc == st_loc or ch_loc in startup.get("operating_states", []):
        location_fit = 100.0
    else:
        location_fit = 40.0
        
    return {
        "technology_fit": float(tech_fit),
        "sector_fit": float(sector_fit),
        "experience_fit": float(exp_fit),
        "team_fit": float(team_fit),
        "scalability_fit": float(scale_fit),
        "revenue_fit": float(revenue_fit),
        "location_fit": float(location_fit)
    }

def generate_explainability(scores: Dict[str, float], eligible: bool, rejection_reasons: List[str]) -> tuple[List[str], List[str]]:
    """Generate human-readable reasons and concerns based on deterministic rules."""
    reasons = []
    concerns = []
    
    if not eligible:
        concerns.extend(rejection_reasons)
        return reasons, concerns
        
    if scores.get("technology_fit", 0) >= 90:
        reasons.append("Strong technology alignment")
    elif scores.get("technology_fit", 0) < 50:
        concerns.append("Limited technology overlap")
        
    if scores.get("problem_similarity", 0) >= 80:
        reasons.append("High semantic problem similarity")
        
    if scores.get("sector_fit", 0) == 100:
        reasons.append("Relevant sector expertise")
        
    if scores.get("experience_fit", 0) == 100:
        reasons.append("Meets minimum experience requirement")
        
    if scores.get("team_fit", 0) >= 90:
        reasons.append("Strong team capability")
        
    if scores.get("scalability_fit", 0) >= 90:
        reasons.append("High scalability potential")
    elif scores.get("scalability_fit", 0) < 50:
        concerns.append("Limited scalability potential")
        
    if scores.get("location_fit", 0) >= 90:
        reasons.append("Favorable geographic presence")
    else:
        concerns.append("Possible geographic mismatch")
        
    return reasons, concerns


async def analyze_challenge(challenge_id: str) -> Dict[str, Any]:
    """Main pipeline orchestrator."""
    challenge = await retrieve_challenge(challenge_id)
    if not challenge:
        raise ValueError(f"Challenge with ID {challenge_id} not found.")
        
    startups = await retrieve_startups_for_challenge(challenge_id)
    if not startups:
        return {
            "challenge_id": challenge_id,
            "applications_analyzed": 0,
            "eligible_count": 0,
            "results": []
        }
        
    results = []
    eligible_count = 0
    
    for startup in startups:
        eligible, rejection_reasons = check_hard_eligibility(challenge, startup)
        
        if eligible:
            eligible_count += 1
            problem_sim = calculate_semantic_similarity(challenge, startup)
            struct_scores = calculate_structured_scores(challenge, startup)
            
            final_score = (
                WEIGHTS["technology_fit"] * struct_scores["technology_fit"] +
                WEIGHTS["problem_similarity"] * problem_sim +
                WEIGHTS["experience_fit"] * struct_scores["experience_fit"] +
                WEIGHTS["sector_fit"] * struct_scores["sector_fit"] +
                WEIGHTS["team_fit"] * struct_scores["team_fit"] +
                WEIGHTS["scalability_fit"] * struct_scores["scalability_fit"] +
                WEIGHTS["revenue_fit"] * struct_scores["revenue_fit"] +
                WEIGHTS["location_fit"] * struct_scores["location_fit"]
            )
            
            # Combine all scores for explainability mapping
            all_scores = {**struct_scores, "problem_similarity": problem_sim}
            reasons, concerns = generate_explainability(all_scores, eligible, rejection_reasons)
            
            results.append({
                "startup_id": startup["startup_id"],
                "startup_name": startup["startup_name"],
                "overall_score": round(final_score, 2),
                "eligible": True,
                "technology_fit": round(struct_scores["technology_fit"], 2),
                "problem_similarity": round(problem_sim, 2),
                "sector_fit": round(struct_scores["sector_fit"], 2),
                "experience_fit": round(struct_scores["experience_fit"], 2),
                "team_fit": round(struct_scores["team_fit"], 2),
                "scalability_fit": round(struct_scores["scalability_fit"], 2),
                "revenue_fit": round(struct_scores["revenue_fit"], 2),
                "location_fit": round(struct_scores["location_fit"], 2),
                "reasons": reasons,
                "concerns": concerns
            })
        else:
            # Exclude from recommended ranking per requirement, but keep track of it if needed
            # "Ineligible startups should be marked eligible=false and excluded from recommended ranking"
            # We don't include them in the ranked result list, but if we need to return them, we could.
            # The prompt implies: "For every ranked startup return ...", ineligible ones are excluded.
            pass
            
    # Sort descending by overall_score
    results.sort(key=lambda x: x["overall_score"], reverse=True)
    
    # Add rank
    for idx, res in enumerate(results):
        res["rank"] = idx + 1
        
    return {
        "challenge_id": challenge_id,
        "applications_analyzed": len(startups),
        "eligible_count": eligible_count,
        "results": results
    }
