import uuid
import random

def generate_mentorships(applications):
    mentorships = []
    
    # Only shortlisted or pilot stage startups get mentorship
    eligible_apps = [app for app in applications if app["application_status"] in ["Shortlisted", "Pilot", "Selected"]]
    
    for app in eligible_apps:
        # Not every eligible app necessarily gets mentorship
        if random.random() < 0.8:
            mentorship = {
                "mentorship_id": str(uuid.uuid4()),
                "application_id": app["application_id"],
                "mentor_domain": random.choice(["Technology Strategy", "Business Scaling", "Government Procurement", "Financial Modeling"]),
                "mentor_experience_years": random.randint(10, 30),
                "mentorship_focus": "Product Refinement and Scalability",
                "mentorship_status": random.choice(["Ongoing", "Completed"]),
                "sessions_completed": random.randint(2, 10),
                "mentor_feedback": "Strong technical team, needs help with GTM strategy.",
                "pilot_readiness_score": random.randint(60, 100)
            }
            mentorships.append(mentorship)
            
    return mentorships
