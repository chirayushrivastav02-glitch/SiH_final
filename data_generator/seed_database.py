import asyncio
import json
import os
from pathlib import Path

# Fix the import path to find backend's db.py
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from lib.db import client, db

async def seed_collection(collection_name, json_filename):
    file_path = os.path.join('output', f'{json_filename}.json')
    if not os.path.exists(file_path):
        print(f"File {file_path} not found. Skipping...")
        return
        
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    if not data:
        print(f"No data for {collection_name}. Skipping...")
        return
        
    # We use a synthetic_ prefix to avoid destroying production data
    coll = db[f'synthetic_{collection_name}']
    
    # Optional: Clear existing synthetic data
    await coll.delete_many({})
    
    result = await coll.insert_many(data)
    print(f"Inserted {len(result.inserted_ids)} records into synthetic_{collection_name}")

async def run_seed():
    print("Starting MongoDB Seeding for Synthetic Data...")
    
    collections_to_seed = [
        ("challenges", "challenges"),
        ("startups", "startups"),
        ("applications", "applications"),
        ("mentorship", "mentorship"),
        ("pilots", "pilots"),
        ("procurement", "procurement"),
        ("evaluations", "evaluation_ground_truth")
    ]
    
    for coll_name, filename in collections_to_seed:
        await seed_collection(coll_name, filename)
        
    print("Seeding Complete.")

if __name__ == "__main__":
    asyncio.run(run_seed())
