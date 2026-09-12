# Weights for AI Matching Engine (Prototype)
WEIGHTS = {
    "technology_fit": 0.30,
    "problem_similarity": 0.20,
    "experience_fit": 0.15,
    "sector_fit": 0.10,
    "team_fit": 0.10,
    "scalability_fit": 0.05,
    "revenue_fit": 0.05,
    "location_fit": 0.05
}

# The Sentence-Transformers model used for calculating Cosine Similarity
SBERT_MODEL_NAME = 'all-MiniLM-L6-v2'
