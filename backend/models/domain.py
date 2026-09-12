from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    id: str
    name: str
    role: str
    email: str
    avatar: str
    avatarColor: str
    designation: Optional[str] = None
    department: Optional[str] = None
    company: Optional[str] = None

class ChallengeEvaluationCriteria(BaseModel):
    technical: int
    innovation: int
    scalability: int
    team: int
    financial: int
    cost: int

class ChallengeEligibility(BaseModel):
    startupRequirements: str
    experience: str
    technical: str
    financial: str
    certifications: str

class ChallengeBudgetRange(BaseModel):
    min: int
    max: int

class Challenge(BaseModel):
    id: str
    title: str
    department: str
    sector: str
    location: str
    problem: str
    currentSituation: str
    expectedSolution: str
    functionalRequirements: str
    technicalRequirements: str
    deliverables: str
    successMetrics: str
    budget: str
    budgetRange: ChallengeBudgetRange
    timeline: str
    pilotDuration: str
    geographicScope: str
    procurementPathway: str
    applications: int
    shortlisted: int
    status: str
    publishedDate: Optional[str] = None
    deadline: str
    tags: List[str]
    evaluationCriteria: ChallengeEvaluationCriteria
    eligibility: Optional[ChallengeEligibility] = None

class StartupApplicationShort(BaseModel):
    challengeId: str
    status: str
    score: Optional[int] = None

class Startup(BaseModel):
    id: str
    name: str
    legalEntity: str
    registrationNo: str
    industry: str
    location: str
    website: str
    dpiit: str
    founded: int
    teamSize: int
    techTeamSize: int
    stage: str
    fundingRaised: str
    investors: str
    annualRevenue: str
    grossProfit: str
    netPL: str
    plRatio: str
    product: str
    problemSolved: str
    solution: str
    technology: str
    customers: str
    deploymentScale: str
    govtProjects: int
    enterpriseClients: int
    certifications: List[str]
    patents: int
    awards: List[str]
    matchScore: Optional[int] = 0
    profileCompletion: Optional[int] = 0
    applications: List[StartupApplicationShort] = Field(default_factory=list)

class ApplicationEvaluationComment(BaseModel):
    author: str
    comment: str
    date: str

class ApplicationScores(BaseModel):
    innovation: int
    technical: int
    scalability: int
    team: int
    financial: int
    cost: int
    security: int
    implementation: int

class Application(BaseModel):
    id: str
    challengeId: str
    startupId: str
    startupName: str
    submittedDate: str
    status: str
    scores: Optional[ApplicationScores] = None
    overallScore: Optional[float] = None
    proposedSolution: str
    pilotBudget: str
    pilotDuration: str
    pilotScope: str
    teamLead: str
    totalTeam: str
    previousGovtWork: str
    evaluationComments: List[ApplicationEvaluationComment] = Field(default_factory=list)
