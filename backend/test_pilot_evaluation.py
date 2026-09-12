import os
# Check for key first
if not os.environ.get("GEMINI_API_KEY"):
    print("Warning: GEMINI_API_KEY is not set in the environment.")
    print("The API call will likely fail unless the SDK picks it up from somewhere else.")
else:
    print("GEMINI_API_KEY is configured.")

from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

startup_name = "EcoCharge"
domain = "Renewable Energy Tech"

mock_data = {
    "startup_name": startup_name,
    "domain": domain,
    "proposed_solution": "A smart battery management system that recycles old EV batteries for home energy storage, using AI to optimize charging cycles.",
    "historical_context": "Founded 2 years ago by former Tesla engineers. Secured $2M seed funding but struggled with battery degradation issues in their early prototypes."
}

print("\n--- Phase 1: Generating Questions ---")
print("Sending request to /api/generate-questions ...")
response1 = client.post("/api/generate-questions", json=mock_data)

if response1.status_code == 200:
    data1 = response1.json()
    import json
    print("Success! Generated Questions and Scenarios:")
    print(json.dumps(data1, indent=2))
    
    print("\n--- Phase 2: Evaluating Answers ---")
    
    # Mocking answers to the generated questions
    questions = data1.get("technical_questions", [])
    if questions:
        q_and_a = []
        for i, q in enumerate(questions):
            # Provide a somewhat generic but confident sounding answer
            answer = f"Our AI handles this by leveraging real-time telemetry and edge computing, ensuring redundancy across all modules. We specifically address '{q.split()[0]}' by calibrating against our proprietary dataset."
            if i == 1:
                answer = "We use active balancing specifically to mitigate high internal resistance, routing excess charge dynamically via smart switches."
            q_and_a.append({"question": q, "answer": answer})
            
        eval_payload = {
            "startup_name": startup_name,
            "domain": domain,
            "q_and_a": q_and_a
        }
        
        print("Sending request to /api/evaluate-answers ...")
        response2 = client.post("/api/evaluate-answers", json=eval_payload)
        
        if response2.status_code == 200:
            print("\nSuccess! Evaluation Result:")
            print(json.dumps(response2.json(), indent=2))
        else:
            print(f"\nError in Evaluation: {response2.status_code}")
            print(response2.text)
else:
    print(f"\nError in Generation: {response1.status_code}")
    print(response1.text)
