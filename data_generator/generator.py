import os
import json
import csv
import config

from generators.challenge_generator import generate_challenges
from generators.startup_generator import generate_startups
from generators.application_generator import generate_applications_and_ground_truth
from generators.mentorship_generator import generate_mentorships
from generators.pilot_generator import generate_pilots
from generators.procurement_generator import generate_procurements

def save_data(data, filename):
    os.makedirs('output', exist_ok=True)
    
    # JSON
    with open(f"output/{filename}.json", "w", encoding='utf-8') as f:
        json.dump(data, f, indent=2)
        
    # CSV
    if data and len(data) > 0:
        keys = data[0].keys()
        with open(f"output/{filename}.csv", "w", newline='', encoding='utf-8') as f:
            dict_writer = csv.DictWriter(f, keys)
            dict_writer.writeheader()
            dict_writer.writerows(data)

def generate_all():
    print("Generating Challenges...")
    challenges = generate_challenges()
    
    print("Generating Startups...")
    startups = generate_startups()
    
    print("Generating Applications & Ground Truth...")
    applications, ground_truth = generate_applications_and_ground_truth(challenges, startups)
    
    print("Generating Mentorships...")
    mentorships = generate_mentorships(applications)
    
    print("Generating Pilots...")
    pilots = generate_pilots(applications, challenges)
    
    print("Generating Procurements...")
    procurements = generate_procurements(applications, challenges)
    
    # Save
    print("Saving Data...")
    save_data(challenges, "challenges")
    save_data(startups, "startups")
    save_data(applications, "applications")
    save_data(mentorships, "mentorship")
    save_data(pilots, "pilots")
    save_data(procurements, "procurement")
    save_data(ground_truth, "evaluation_ground_truth")
    
    print("Data Generation Complete.")

if __name__ == "__main__":
    generate_all()
