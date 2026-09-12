import json
import os
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import config

def load_json(filename):
    with open(f"output/{filename}.json", "r", encoding='utf-8') as f:
        return json.load(f)

def test_ai_matching():
    print("Loading Data for AI Match Test...")
    challenges = load_json("challenges")
    startups = load_json("startups")
    
    # Select a specific challenge for the demo
    target_challenge = None
    for ch in challenges:
        if "Computer Vision" in ch["required_technologies"] or "AI" in ch["challenge_title"]:
            target_challenge = ch
            break
            
    if not target_challenge:
        target_challenge = challenges[0]
        
    print(f"\n--- TARGET CHALLENGE ---")
    print(f"Title: {target_challenge['challenge_title']}")
    print(f"Sector: {target_challenge['sector']}")
    print(f"Required Tech: {', '.join(target_challenge['required_technologies'])}")
    print(f"Min Experience: {target_challenge['minimum_experience_years']} years")
    print(f"Location: {target_challenge['location']}")
    
    print("\nLoading SBERT Model (all-MiniLM-L6-v2)...")
    # Using a fast, lightweight sentence transformer for demo
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # 1. Embed the challenge description
    ch_text = f"{target_challenge['challenge_title']} {target_challenge['problem_statement']} {target_challenge['detailed_description']}"
    ch_embedding = model.encode([ch_text])
    
    print("\nProcessing Startups and calculating Cosine Similarity...")
    results = []
    
    for startup in startups:
        # Hard Eligibility Filter
        eligible = True
        if startup["years_of_relevant_experience"] < target_challenge["minimum_experience_years"]:
            eligible = False
            
        if len(set(target_challenge["required_technologies"]).intersection(set(startup["primary_technologies"] + startup["secondary_technologies"]))) == 0:
            eligible = False
            
        # Startup text
        st_text = f"{startup['startup_name']} {startup['short_description']} {startup['detailed_description']}"
        st_embedding = model.encode([st_text])
        
        # SBERT Cosine Similarity
        semantic_sim = cosine_similarity(ch_embedding, st_embedding)[0][0]
        # Normalize to 0-100
        semantic_score = max(0, min(100, semantic_sim * 100))
        
        # Additional feature matching (simulated prototype weighting)
        tech_overlap = len(set(target_challenge["required_technologies"]).intersection(set(startup["primary_technologies"] + startup["secondary_technologies"])))
        tech_fit = min(100, (tech_overlap / max(1, len(target_challenge["required_technologies"]))) * 100)
        
        sector_fit = 100 if target_challenge["sector"] == startup["sector"] else (50 if target_challenge["sector"] in startup["sub_sectors"] else 0)
        exp_fit = 100 if startup["years_of_relevant_experience"] >= target_challenge["minimum_experience_years"] else 0
        team_fit = 90 if startup["team_capabilities"] == "Strong" else (70 if startup["team_capabilities"] == "Specialized" else 50)
        scale_fit = 100 if startup["scalability_level"] == "High" else (60 if startup["scalability_level"] == "Medium" else 30)
        revenue_fit = min(100, (startup["annual_revenue"] / 10000000) * 100)
        location_fit = 100 if target_challenge["location"] in startup["preferred_deployment_locations"] or startup["preferred_deployment_locations"] == "Pan India" or target_challenge["location"] == "Pan India" else 40

        # Blended final score replacing 'problem' with SBERT Semantic Similarity
        final_score = (
            config.WEIGHTS["technology"] * tech_fit +
            config.WEIGHTS["problem"] * semantic_score +
            config.WEIGHTS["experience"] * exp_fit +
            config.WEIGHTS["sector"] * sector_fit +
            config.WEIGHTS["team"] * team_fit +
            config.WEIGHTS["scalability"] * scale_fit +
            config.WEIGHTS["revenue"] * revenue_fit +
            config.WEIGHTS["location"] * location_fit
        )
        
        results.append({
            "startup_name": startup["startup_name"],
            "eligible": eligible,
            "semantic_score": round(semantic_score, 2),
            "final_score": round(final_score, 2),
            "profile": startup["capability_profile"]
        })
        
    # Sort results
    df = pd.DataFrame(results)
    df = df.sort_values(by="final_score", ascending=False)
    
    print("\n--- TOP 3 MATCHES ---")
    print(df[df['eligible'] == True].head(3).to_string(index=False))
    
    print("\n--- WEAK MATCH (Eligible but low score) ---")
    print(df[(df['eligible'] == True) & (df['final_score'] < 50)].head(1).to_string(index=False))
    
    print("\n--- INELIGIBLE STARTUP ---")
    print(df[df['eligible'] == False].head(1).to_string(index=False))
    
if __name__ == "__main__":
    import logging
    logging.getLogger('sentence_transformers').setLevel(logging.WARNING)
    test_ai_matching()
