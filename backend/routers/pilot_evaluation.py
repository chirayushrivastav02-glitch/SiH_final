from fastapi import APIRouter, HTTPException
import os
from google import genai
from models.evaluation import EvaluationRequest, EvaluationResponse, StartupAnswerSubmission, EvaluationResult
from lib.rag_retriever import retriever

router = APIRouter(tags=["Evaluation"])

# Initialize Gemini client
client = genai.Client()

@router.post("/generate-questions", response_model=EvaluationResponse)
async def generate_questions(request: EvaluationRequest):
    if not os.environ.get("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured.")

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
        interaction = client.interactions.create(
            model='gemini-3.7-flash',
            input=prompt,
            response_format=EvaluationResponse.model_json_schema(),
        )
        return EvaluationResponse.model_validate_json(interaction.output_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/evaluate-answers", response_model=EvaluationResult)
async def evaluate_answers(submission: StartupAnswerSubmission):
    if not os.environ.get("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured.")

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
        interaction = client.interactions.create(
            model='gemini-3.7-flash',
            input=prompt,
            response_format=EvaluationResult.model_json_schema(),
        )
        result = EvaluationResult.model_validate_json(interaction.output_text)
        # Ensure verdict aligns with threshold 70
        if result.score >= 70:
            result.verdict = "PASS"
        else:
            result.verdict = "FAIL"
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
