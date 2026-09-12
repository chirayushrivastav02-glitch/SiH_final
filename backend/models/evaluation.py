from pydantic import BaseModel, Field
from typing import List

class EvaluationRequest(BaseModel):
    startup_name: str = Field(..., description="The name of the startup")
    domain: str = Field(..., description="The primary industry or domain of the startup")
    proposed_solution: str = Field(..., description="The product or solution proposed by the startup")
    historical_context: str = Field(..., description="Background information or historical context of the startup")

class EvaluationResponse(BaseModel):
    scenarios: List[str] = Field(..., description="Exactly 5 stress-test scenarios for the startup")
    technical_questions: List[str] = Field(..., description="Exactly 5 technical questions to ask the startup's team")

class QuestionAnswerPair(BaseModel):
    question: str
    answer: str

class StartupAnswerSubmission(BaseModel):
    startup_name: str
    domain: str
    q_and_a: List[QuestionAnswerPair] = Field(..., description="List of questions paired with the startup's answers")

from typing import Literal

class EvaluationResult(BaseModel):
    score: int = Field(..., description="Score out of 100")
    verdict: Literal["PASS", "FAIL"] = Field(..., description="Whether the startup passes the evaluation")
    reasoning: str = Field(..., description="Detailed reasoning for the score and verdict")
    critical_vulnerabilities: List[str] = Field(..., description="Critical vulnerabilities identified in the answers")
    recommended_sandbox_tests: List[str] = Field(..., description="Specific sandbox tests to run next")
