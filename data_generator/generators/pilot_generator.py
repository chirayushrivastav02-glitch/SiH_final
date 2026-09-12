import uuid
import random
from datetime import datetime, timedelta
import config

def generate_pilots(applications, challenges):
    pilots = []
    
    # Only pilot or selected stage startups get pilot records
    eligible_apps = [app for app in applications if app["application_status"] in ["Pilot", "Selected"]]
    
    ch_map = {ch["challenge_id"]: ch for ch in challenges}
    
    for app in eligible_apps:
        ch = ch_map[app["challenge_id"]]
        start_date = datetime.utcnow() - timedelta(days=random.randint(30, 100))
        end_date = start_date + timedelta(days=random.randint(15, 60))
        
        # Selected startups must have successful pilots
        if app["application_status"] == "Selected":
            pilot_result = "Successful"
            target_achieved = random.randint(85, 100)
        else:
            pilot_result = random.choice(["Successful", "Partially Successful", "Unsuccessful"])
            if pilot_result == "Successful":
                target_achieved = random.randint(80, 100)
            elif pilot_result == "Partially Successful":
                target_achieved = random.randint(50, 79)
            else:
                target_achieved = random.randint(10, 49)
                
        pilot = {
            "pilot_id": str(uuid.uuid4()),
            "application_id": app["application_id"],
            "pilot_start_date": start_date.isoformat() + "Z",
            "pilot_end_date": end_date.isoformat() + "Z",
            "pilot_location": ch["location"],
            "pilot_status": "Completed",
            "pilot_kpis": ch["key_performance_indicators"],
            "kpi_target": 100,
            "kpi_achieved": target_achieved,
            "technical_success_score": target_achieved + random.randint(-5, 5),
            "operational_success_score": target_achieved + random.randint(-5, 5),
            "user_adoption_score": target_achieved + random.randint(-10, 10),
            "scalability_score": target_achieved + random.randint(-5, 5),
            "overall_pilot_score": target_achieved,
            "pilot_result": pilot_result
        }
        pilots.append(pilot)
            
    return pilots
