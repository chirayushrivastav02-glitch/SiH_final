import random

RANDOM_SEED = 42
random.seed(RANDOM_SEED)

NUM_CHALLENGES = 100
NUM_STARTUPS = 1000
NUM_APPLICATIONS = 5000

SECTORS = [
    "Smart City", "Healthcare", "Agriculture", "Education", 
    "Cybersecurity", "Defence", "Transportation", "Renewable Energy", 
    "Environment", "Water Management", "Waste Management", "FinTech", 
    "Public Safety", "Governance", "Rural Development", "Disaster Management", 
    "Logistics", "Infrastructure", "Tourism", "Skill Development"
]

TECHNOLOGIES = {
    "Smart City": ["Computer Vision", "IoT", "Edge Computing", "Data Analytics"],
    "Healthcare": ["Medical AI", "Computer Vision", "Data Analytics", "Wearables", "NLP"],
    "Agriculture": ["Computer Vision", "IoT", "Satellite Imaging", "ML", "Drones"],
    "Education": ["NLP", "VR/AR", "Machine Learning", "Recommendation Systems"],
    "Cybersecurity": ["Threat Detection", "Network Security", "AI", "Cryptography", "Blockchain"],
    "Defence": ["Computer Vision", "Drones", "Cybersecurity", "AI", "Robotics"],
    "Transportation": ["Route Optimization", "IoT", "Computer Vision", "Predictive Maintenance"],
    "Renewable Energy": ["Predictive Analytics", "IoT", "Smart Grids", "ML"],
    "Environment": ["Sensors", "Data Analytics", "IoT", "Satellite Imaging"],
    "Water Management": ["IoT", "Predictive Analytics", "Sensors", "Machine Learning"],
    "Waste Management": ["IoT", "Sensors", "Computer Vision", "Route Optimization"],
    "FinTech": ["Blockchain", "AI", "Data Analytics", "NLP", "Fraud Detection"],
    "Public Safety": ["Computer Vision", "IoT", "Predictive Analytics", "Biometrics"],
    "Governance": ["NLP", "OCR", "Machine Learning", "Blockchain", "Data Analytics"],
    "Rural Development": ["IoT", "Mobile Tech", "Data Analytics", "Renewable Tech"],
    "Disaster Management": ["Satellite Imaging", "Predictive Analytics", "Drones", "IoT"],
    "Logistics": ["Route Optimization", "IoT", "Blockchain", "Predictive Analytics"],
    "Infrastructure": ["Predictive Maintenance", "IoT", "Computer Vision", "Sensors"],
    "Tourism": ["VR/AR", "NLP", "Mobile Tech", "Recommendation Systems"],
    "Skill Development": ["VR/AR", "NLP", "Machine Learning", "Recommendation Systems"]
}

CITIES = [
    "Bengaluru", "Pune", "Mumbai", "Hyderabad", "Delhi", "New Delhi", 
    "Noida", "Gurugram", "Chennai", "Ahmedabad", "Jaipur", "Lucknow", 
    "Bhopal", "Indore", "Kochi", "Bhubaneswar", "Chandigarh", "Kolkata", 
    "Patna", "Guwahati", "Nagpur", "Surat", "Nashik", "Coimbatore", "Visakhapatnam"
]

# Prototype Weights for Scoring
WEIGHTS = {
    "technology": 0.30,
    "problem": 0.20,
    "experience": 0.15,
    "sector": 0.10,
    "team": 0.10,
    "scalability": 0.05,
    "revenue": 0.05,
    "location": 0.05
}

FEE_LEVELS = [500, 1000, 2500, 5000, 10000]
WAIVER_REASONS = [
    "Persons with Disabilities-led startup",
    "Orphan-founded startup",
    "Refugee-founded startup",
    "Economically disadvantaged founder group",
    "Other platform-defined welfare category"
]
