import json
import os
import sys

def load_json(filename):
    with open(f"output/{filename}.json", "r", encoding='utf-8') as f:
        return json.load(f)

def validate():
    print("Starting Validation...")
    
    challenges = load_json("challenges")
    startups = load_json("startups")
    applications = load_json("applications")
    mentorships = load_json("mentorship")
    pilots = load_json("pilots")
    procurements = load_json("procurement")
    ground_truth = load_json("evaluation_ground_truth")
    
    errors = 0
    
    # Validation Rules
    ch_ids = {c["challenge_id"] for c in challenges}
    st_ids = {s["startup_id"] for s in startups}
    app_ids = {a["application_id"] for a in applications}
    
    if len(ch_ids) != len(challenges):
        print("Error: Duplicate Challenge IDs")
        errors += 1
        
    for app in applications:
        if app["challenge_id"] not in ch_ids:
            print(f"Error: App {app['application_id']} references missing challenge")
            errors += 1
        if app["startup_id"] not in st_ids:
            print(f"Error: App {app['application_id']} references missing startup")
            errors += 1
            
        if app["refund_amount"] < 0:
            print(f"Error: Negative refund {app['refund_amount']}")
            errors += 1
            
        if app["fee_waiver"] and app["registration_fee"] != 0:
            print(f"Error: Fee waiver but fee is {app['registration_fee']}")
            errors += 1
            
    for m in mentorships:
        if m["application_id"] not in app_ids:
            print(f"Error: Mentorship {m['mentorship_id']} references missing app")
            errors += 1
            
    selected_apps = {a["application_id"] for a in applications if a["application_status"] == "Selected"}
    pilot_apps = {p["application_id"] for p in pilots}
    
    for proc in procurements:
        if proc["application_id"] not in selected_apps:
            print(f"Error: Procurement {proc['procurement_id']} references non-selected app")
            errors += 1
            
    for app_id in selected_apps:
        if app_id not in pilot_apps:
            print(f"Error: Selected app {app_id} does not have a pilot record")
            errors += 1
            
    gt_map = {gt["application_id"]: gt for gt in ground_truth}
    
    avg_score = sum(gt["ground_truth_overall_quality"] for gt in ground_truth) / len(ground_truth)
    excellent = sum(1 for gt in ground_truth if gt["ground_truth_overall_quality"] >= 85)
    good = sum(1 for gt in ground_truth if 70 <= gt["ground_truth_overall_quality"] < 85)
    moderate = sum(1 for gt in ground_truth if 50 <= gt["ground_truth_overall_quality"] < 70)
    weak = sum(1 for gt in ground_truth if gt["ground_truth_overall_quality"] < 50)
    
    eligibility_pass = sum(1 for gt in ground_truth if gt["ground_truth_eligibility"]) / len(ground_truth) * 100
    
    print("\n" + "="*50)
    print("VALIDATION REPORT")
    print("="*50)
    print(f"Challenges: {len(challenges)}")
    print(f"Startups: {len(startups)}")
    print(f"Applications: {len(applications)}")
    print(f"Mentorship records: {len(mentorships)}")
    print(f"Pilot records: {len(pilots)}")
    print(f"Procurement records: {len(procurements)}")
    print("")
    print(f"Eligibility pass rate: {eligibility_pass:.1f}%")
    
    shortlisted = sum(1 for a in applications if a["application_status"] in ["Shortlisted", "Pilot", "Selected"])
    pilot_stage = sum(1 for a in applications if a["application_status"] in ["Pilot", "Selected"])
    final_selected = len(selected_apps)
    
    print(f"Shortlisted: {shortlisted}")
    print(f"Pilot stage: {pilot_stage}")
    print(f"Final selected: {final_selected}")
    print("")
    print(f"Average match score: {avg_score:.2f}")
    print(f"Excellent matches: {excellent}")
    print(f"Good matches: {good}")
    print(f"Moderate matches: {moderate}")
    print(f"Weak matches: {weak}")
    print("")
    print(f"Validation errors: {errors}")
    print("="*50)
    
    if errors > 0:
        sys.exit(1)

if __name__ == "__main__":
    validate()
