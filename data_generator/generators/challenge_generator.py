import uuid
import random
from datetime import datetime, timedelta
import config

def generate_challenges():
    challenges = []
    
    for i in range(config.NUM_CHALLENGES):
        sector = random.choice(config.SECTORS)
        tech_list = config.TECHNOLOGIES[sector]
        num_req_tech = random.randint(1, min(3, len(tech_list)))
        num_pref_tech = random.randint(0, min(2, len(tech_list) - num_req_tech))
        
        selected_tech = random.sample(tech_list, num_req_tech + num_pref_tech)
        req_tech = selected_tech[:num_req_tech]
        pref_tech = selected_tech[num_req_tech:]
        
        min_experience = random.choices([0, 1, 2, 3, 5], weights=[0.2, 0.3, 0.3, 0.1, 0.1])[0]
        budget_min = random.randint(10, 50) * 100000
        budget_max = budget_min + random.randint(10, 50) * 100000
        
        deadline = datetime.utcnow() + timedelta(days=random.randint(10, 60))
        
        challenge = {
            "challenge_id": str(uuid.uuid4()),
            "challenge_title": f"AI Innovation for {sector} using {', '.join(req_tech)}",
            "problem_statement": f"Develop a solution to improve {sector.lower()} operations.",
            "detailed_description": f"We are seeking startups with expertise in {', '.join(req_tech)} to build scalable solutions for {sector}.",
            "sector": sector,
            "sub_sector": f"{sector} Tech",
            "required_technologies": req_tech,
            "preferred_technologies": pref_tech,
            "minimum_experience_years": min_experience,
            "required_certifications": random.sample(["ISO 27001", "SOC 2", "None"], 1),
            "eligibility_requirements": f"Must have {min_experience} years of experience and core capability in {req_tech[0]}.",
            "preferred_startup_stage": random.choice(["Early Traction", "Scaling", "Growth", "Any"]),
            "budget_min": budget_min,
            "budget_max": budget_max,
            "budget_currency": "INR",
            "location": random.choice(["Pan India", random.choice(config.CITIES)]),
            "deployment_environment": random.choice(["Cloud", "On-Premise", "Hybrid", "Edge"]),
            "scalability_requirement": random.choice(["City Level", "State Level", "National Level"]),
            "expected_timeline_months": random.randint(3, 18),
            "expected_outcomes": "Demonstrable prototype, successful pilot, and scalable production deployment.",
            "key_performance_indicators": ["System Uptime", "User Adoption", "Processing Speed"],
            "procurement_category": random.choice(["Software", "Hardware & Software", "Service"]),
            "challenge_priority": random.choice(["High", "Medium", "Low"]),
            "application_deadline": deadline.isoformat() + "Z",
            "status": "Open"
        }
        challenges.append(challenge)
        
    return challenges
