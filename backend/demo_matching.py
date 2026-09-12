import asyncio
import json
import logging
from lib.matching_engine import analyze_challenge
from lib.db import db

# Silence sbert logs for cleaner output
logging.getLogger('sentence_transformers').setLevel(logging.WARNING)

async def main():
    try:
        # Check DB connection
        await db.command("ping")
        cursor = db.synthetic_challenges.find({"challenge_title": {"$regex": "Traffic|Smart City", "$options": "i"}})
        challenges = await cursor.to_list(length=10)
        challenge = challenges[0] if challenges else await db.synthetic_challenges.find_one({})
        challenge_id = challenge["challenge_id"] if challenge else None
    except Exception:
        # Fallback to JSON files if MongoDB is not running locally
        print("MongoDB connection failed. Falling back to JSON dataset...")
        with open("../data_generator/output/challenges.json", "r", encoding="utf-8") as f:
            challenges = json.load(f)
        challenge = next((c for c in challenges if "Traffic" in c["challenge_title"] or "Smart City" in c["challenge_title"]), challenges[0])
        challenge_id = challenge["challenge_id"]
        
        # Patch the engine's DB functions
        import lib.matching_engine as me
        async def mock_retrieve_challenge(cid):
            return challenge
            
        async def mock_retrieve_startups(cid):
            with open("../data_generator/output/applications.json", "r", encoding="utf-8") as f:
                apps = [a for a in json.load(f) if a["challenge_id"] == cid]
            app_startup_ids = {a["startup_id"] for a in apps}
            with open("../data_generator/output/startups.json", "r", encoding="utf-8") as f:
                return [s for s in json.load(f) if s["startup_id"] in app_startup_ids]
                
        me.retrieve_challenge = mock_retrieve_challenge
        me.retrieve_startups_for_challenge = mock_retrieve_startups

    if not challenge_id:
        print("No challenges found.")
        return
        
    print("\n==================================================")
    print("AI MATCHING ENGINE DEMO")
    print("==================================================")
    print(f"Target Challenge: {challenge['challenge_title']}")
    print(f"Sector: {challenge['sector']}")
    print(f"Location: {challenge['location']}")
    print(f"Required Tech: {', '.join(challenge.get('required_technologies', []))}")
    print("==================================================\n")
    
    print("Running matching engine...")
    from lib.matching_engine import analyze_challenge
    response = await analyze_challenge(challenge_id)
    
    print(f"Applications Analyzed: {response['applications_analyzed']}")
    print(f"Eligible Count: {response['eligible_count']}")
    
    results = response['results']
    
    if not results:
        print("No eligible startups found for this challenge.")
        return
        
    print("\n--- TOP RANKED STARTUPS ---")
    for r in results[:3]:
        print(f"\n#{r['rank']} {r['startup_name']} - Score: {r['overall_score']}")
        print(f"  Tech Fit: {r['technology_fit']} | Semantics: {r['problem_similarity']} | Sector: {r['sector_fit']}")
        print(f"  Reasons: {', '.join(r['reasons'])}")
        
    print("\n--- WEAK MATCH (Eligible but low score) ---")
    weak_matches = [r for r in results if r['overall_score'] < 50]
    if weak_matches:
        r = weak_matches[0]
        print(f"\n#{r['rank']} {r['startup_name']} - Score: {r['overall_score']}")
        print(f"  Tech Fit: {r['technology_fit']} | Semantics: {r['problem_similarity']}")
        print(f"  Concerns: {', '.join(r['concerns'])}")
    else:
        print("No weak matches found (all eligible startups scored > 50).")

if __name__ == "__main__":
    asyncio.run(main())
