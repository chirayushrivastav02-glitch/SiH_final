from fastapi import APIRouter, HTTPException
import os
from google import genai
from models.evaluation import EvaluationRequest, EvaluationResponse, StartupAnswerSubmission, EvaluationResult
from lib.rag_retriever import retriever

router = APIRouter(tags=["Evaluation"])

# Initialize Gemini client safely so backend doesn't crash if key is missing
api_key_env = os.environ.get("GEMINI_API_KEY", "dummy")
client = genai.Client(api_key=api_key_env)

@router.post("/generate-questions", response_model=EvaluationResponse)
async def generate_questions(request: EvaluationRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key in ["dummy", "dummy_key", "your_api_key_here"]:
        # Mock response for demo when API key is not configured
        return EvaluationResponse(
            scenarios=[
                f"Extreme weather degradation for {request.domain}",
                "Prolonged connectivity loss in remote deployments",
                "Targeted data tampering or spoofing attempts",
                "Complete power failure during critical operations",
                "Unanticipated 100x scaling spikes"
            ],
            technical_questions=[
                "How does your hardware withstand prolonged exposure to extreme environmental conditions?",
                "What is your precise fallback mechanism if the primary network goes down for 48 hours?",
                "How do you ensure zero-trust end-to-end encryption from the edge device to the cloud?",
                "Explain your lifecycle management and maintenance strategy at scale.",
                "How does your architecture handle sudden massive spikes in data ingestion without data loss?"
            ]
        )

    # Retrieve relevant historical context
    historical_rag_context = retriever.get_relevant_context(request.domain, request.proposed_solution)

    prompt = f"""
    You are an expert technical evaluator and VC analyst. 
    Analyze the following startup profile and generate exactly 5 stress-test scenarios 
    and exactly 5 deep technical questions for the founders.

    Startup Name: {request.startup_name}
    Domain: {request.domain}
    Proposed Solution: {request.proposed_solution}
    Startup Background: {request.historical_context}

    Relevant Past Challenges and Edge Cases from Similar Startups:
    {historical_rag_context}

    Output must be in JSON format matching the requested schema. Ground your questions in the past failures.
    """
    try:
        from google.genai import types
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=EvaluationResponse,
            )
        )
        return EvaluationResponse.model_validate_json(response.text)
    except Exception as e:
        error_msg = str(e)
        if "API key not valid" in error_msg or "API_KEY_INVALID" in error_msg:
            raise HTTPException(
                status_code=500, 
                detail="Invalid GEMINI_API_KEY. Please configure a valid Google AI Studio API key in backend/.env to use the Questioning Engine."
            )
        raise HTTPException(status_code=500, detail=error_msg)

@router.post("/evaluate-answers", response_model=EvaluationResult)
async def evaluate_answers(submission: StartupAnswerSubmission):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key in ["dummy", "dummy_key", "your_api_key_here"]:
        # Mock response for demo when API key is not configured
        return EvaluationResult(
            score=88,
            verdict="PASS",
            critical_vulnerabilities=[
                "Potential battery drain under continuous extreme heat",
                "Single point of failure in the local data aggregation node"
            ],
            recommended_sandbox_tests=[
                "Thermal chamber stress testing at 50°C for 72 hours",
                "Simulated network outage and offline data sync recovery test"
            ]
        )

    qa_text = "\n\n".join([f"Q: {qa.question}\nA: {qa.answer}" for qa in submission.q_and_a])
    
    prompt = f"""
You are a strict and expert technical gatekeeper for a sandbox program.
Evaluate the following answers provided by the startup '{submission.startup_name}' operating in '{submission.domain}'.

Q&A Pairs:
{qa_text}

Score them out of 100 based on technical depth, risk mitigation, and feasibility. 
If the score is 70 or above, the verdict should be PASS. Otherwise FAIL.
Identify any critical vulnerabilities and recommend specific sandbox tests.
Output strictly in JSON matching the provided schema.
"""
    try:
        from google.genai import types
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=EvaluationResult,
            )
        )
        result = EvaluationResult.model_validate_json(response.text)
        # Ensure verdict aligns with threshold 70
        if result.score >= 70:
            result.verdict = "PASS"
        else:
            result.verdict = "FAIL"
        return result
    except Exception as e:
        error_msg = str(e)
        if "API key not valid" in error_msg or "API_KEY_INVALID" in error_msg:
            raise HTTPException(
                status_code=500, 
                detail="Invalid GEMINI_API_KEY. Please configure a valid Google AI Studio API key in backend/.env to use the Questioning Engine."
            )
        raise HTTPException(status_code=500, detail=error_msg)
