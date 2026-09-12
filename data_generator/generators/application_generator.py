import uuid
import random
from datetime import datetime, timedelta
import config

def generate_applications_and_ground_truth(challenges, startups):
    applications = []
    ground_truth = []
    
    # We need to generate 5000 applications. We'll sample challenge-startup pairs
    for i in range(config.NUM_APPLICATIONS):
        challenge = random.choice(challenges)
        startup = random.choice(startups)
        
        application_id = str(uuid.uuid4())
        
        # Calculate ground truth scores based on real logical overlaps
        tech_overlap = len(set(challenge["required_technologies"]).intersection(set(startup["primary_technologies"] + startup["secondary_technologies"])))
        tech_fit = min(100, (tech_overlap / max(1, len(challenge["required_technologies"]))) * 100)
        if tech_fit == 0 and len(set(challenge["preferred_technologies"]).intersection(set(startup["primary_technologies"]))) > 0:
            tech_fit = 30
            
        sector_fit = 100 if challenge["sector"] == startup["sector"] else (50 if challenge["sector"] in startup["sub_sectors"] else random.randint(0, 20))
        problem_fit = min(100, (tech_fit * 0.6 + sector_fit * 0.4) + random.randint(-10, 10))
        
        exp_fit = 100 if startup["years_of_relevant_experience"] >= challenge["minimum_experience_years"] else max(0, 100 - (challenge["minimum_experience_years"] - startup["years_of_relevant_experience"]) * 20)
        
        team_fit = 90 if startup["team_capabilities"] == "Strong" else (70 if startup["team_capabilities"] == "Specialized" else 50)
        
        scale_fit = 100 if startup["scalability_level"] == "High" else (60 if startup["scalability_level"] == "Medium" else 30)
        revenue_fit = min(100, (startup["annual_revenue"] / 10000000) * 100)
        
        location_fit = 100 if challenge["location"] in startup["preferred_deployment_locations"] or startup["preferred_deployment_locations"] == "Pan India" or challenge["location"] == "Pan India" else 40
        
        # Prototype Score Formula
        overall_score = (
            config.WEIGHTS["technology"] * tech_fit +
            config.WEIGHTS["problem"] * problem_fit +
            config.WEIGHTS["experience"] * exp_fit +
            config.WEIGHTS["sector"] * sector_fit +
            config.WEIGHTS["team"] * team_fit +
            config.WEIGHTS["scalability"] * scale_fit +
            config.WEIGHTS["revenue"] * revenue_fit +
            config.WEIGHTS["location"] * location_fit
        )
        
        # Force variation based on capability profile from startup
        profile = startup["capability_profile"]
        if profile == "excellent_tech_excellent_exp":
            overall_score = min(100, overall_score + 20)
        elif profile == "high_exp_weak_tech":
            tech_fit = max(0, tech_fit - 40)
            overall_score = max(0, overall_score - 20)
            
        overall_score = min(100, max(0, overall_score))
        
        # Hard Eligibility
        eligible = True
        if startup["years_of_relevant_experience"] < challenge["minimum_experience_years"]:
            eligible = False
        
        if len(set(challenge["required_technologies"]).intersection(set(startup["primary_technologies"] + startup["secondary_technologies"]))) == 0:
            eligible = False
            
        if profile == "incomplete_eligibility":
            eligible = False

        # Status Logic
        status_choices = ["Applied", "Under Review", "AI Analyzed", "Rejected"]
        
        if eligible:
            if overall_score >= 85:
                status_choices = ["AI Analyzed", "Shortlisted", "Pilot", "Selected"]
            elif overall_score >= 70:
                status_choices = ["AI Analyzed", "Shortlisted", "Rejected"]
        else:
            status_choices = ["Applied", "Under Review", "Rejected"]
            
        app_status = random.choice(status_choices)
        
        # Fees & Waivers
        fee_waiver = random.choices([True, False], weights=[0.1, 0.9])[0]
        registration_fee = 0 if fee_waiver else random.choice(config.FEE_LEVELS)
        fee_waiver_reason = random.choice(config.WAIVER_REASONS) if fee_waiver else None
        
        # Refund Logic for non-finalized startups
        processing_fee = int(registration_fee * 0.2) if registration_fee > 0 else 0
        refund_amount = 0
        refund_status = "Not Applicable"
        
        if app_status in ["Rejected", "Withdrawn"] and not fee_waiver:
            refund_amount = registration_fee - processing_fee
            refund_status = random.choice(["Pending", "Processed", "Completed"])
        elif app_status == "Selected":
            refund_amount = 0
            
        # Application Dates
        ch_deadline = datetime.fromisoformat(challenge["application_deadline"].replace("Z", ""))
        app_date = ch_deadline - timedelta(days=random.randint(1, 30))
        
        app = {
            "application_id": application_id,
            "challenge_id": challenge["challenge_id"],
            "startup_id": startup["startup_id"],
            "application_date": app_date.isoformat() + "Z",
            "registration_fee": registration_fee,
            "fee_waiver": fee_waiver,
            "fee_waiver_reason": fee_waiver_reason,
            "processing_fee": processing_fee,
            "refund_amount": refund_amount,
            "refund_status": refund_status,
            "application_status": app_status,
            "proposal_summary": f"Proposal for {challenge['challenge_title']} by {startup['startup_name']}",
            "proposed_solution": f"We propose leveraging {', '.join(startup['primary_technologies'])} to address the challenge requirements.",
            "estimated_project_cost": random.randint(challenge["budget_min"], challenge["budget_max"]) if challenge["budget_max"] >= challenge["budget_min"] else challenge["budget_min"],
            "estimated_completion_months": random.randint(3, 12),
            "team_size_for_project": random.randint(2, 10),
            "technology_stack": startup['primary_technologies'] + startup['secondary_technologies'],
            "prior_relevant_experience": startup["years_of_relevant_experience"],
            "expected_impact": "High efficiency and cost savings.",
            "submitted_documents": ["proposal.pdf", "pitch_deck.pdf"],
            "verification_status": "Verified" if app_status not in ["Applied", "Under Review"] else "Pending"
        }
        applications.append(app)
        
        gt = {
            "application_id": application_id,
            "challenge_id": challenge["challenge_id"],
            "startup_id": startup["startup_id"],
            "ground_truth_technology_fit": round(tech_fit, 2),
            "ground_truth_problem_fit": round(problem_fit, 2),
            "ground_truth_sector_fit": round(sector_fit, 2),
            "ground_truth_experience_fit": round(exp_fit, 2),
            "ground_truth_team_fit": round(team_fit, 2),
            "ground_truth_scalability_fit": round(scale_fit, 2),
            "ground_truth_revenue_fit": round(revenue_fit, 2),
            "ground_truth_location_fit": round(location_fit, 2),
            "ground_truth_eligibility": eligible,
            "ground_truth_overall_quality": round(overall_score, 2)
        }
        ground_truth.append(gt)
        
    return applications, ground_truth
