import uuid
import random

def generate_procurements(applications, challenges):
    procurements = []
    
    # Only selected startups get procurement records
    selected_apps = [app for app in applications if app["application_status"] == "Selected"]
    ch_map = {ch["challenge_id"]: ch for ch in challenges}
    
    for app in selected_apps:
        ch = ch_map[app["challenge_id"]]
        
        procurement = {
            "procurement_id": str(uuid.uuid4()),
            "startup_id": app["startup_id"],
            "challenge_id": app["challenge_id"],
            "application_id": app["application_id"],
            "procurement_status": random.choice(["Under Process", "Contracted", "Deployed", "Completed"]),
            "contract_value": app["estimated_project_cost"],
            "contract_duration_months": app["estimated_completion_months"],
            "procurement_channel": random.choice(["Authorized Government Procurement", "GeM", "CPPP", "Department-specific procurement mechanism"]),
            "deployment_status": random.choice(["Pending", "In Progress", "Completed"]),
            "payment_status": random.choice(["Pending", "Partial", "Completed"])
        }
        procurements.append(procurement)
            
    return procurements
