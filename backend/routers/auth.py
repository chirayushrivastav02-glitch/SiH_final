from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from models.domain import UserBase

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    role: str
    email: Optional[str] = None
    password: Optional[str] = None

class LoginResponse(BaseModel):
    success: bool
    user: UserBase
    token: str

MOCK_USERS = {
  "government": {
    "id": "gov-001",
    "name": "Ananya Singh",
    "role": "government",
    "department": "Ministry of Urban Affairs",
    "email": "ananya.singh@mua.gov.in",
    "avatar": "AS",
    "avatarColor": "#0d9488",
    "designation": "Deputy Secretary",
  },
  "startup": {
    "id": "su-001",
    "name": "Rahul Mehta",
    "role": "startup",
    "company": "NovaTech Solutions",
    "email": "rahul@novatech.in",
    "avatar": "RM",
    "avatarColor": "#6366f1",
    "designation": "CEO & Founder",
  },
  "admin": {
    "id": "adm-001",
    "name": "Priya Sharma",
    "role": "admin",
    "email": "priya@ipps.gov.in",
    "avatar": "PS",
    "avatarColor": "#f97316",
    "designation": "Platform Administrator",
  },
}

DEMO_PASSWORDS = {
    "government": "govt@demo",
    "startup": "startup@demo",
    "admin": "admin@demo"
}

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    user_data = MOCK_USERS.get(request.role)
    if not user_data:
        raise HTTPException(status_code=400, detail="Invalid role")
        
    if request.email != user_data.get("email"):
        raise HTTPException(status_code=401, detail="Invalid email")
        
    if request.password != DEMO_PASSWORDS.get(request.role):
        raise HTTPException(status_code=401, detail="Invalid password")
        
    import time
    return LoginResponse(
        success=True,
        user=UserBase(**user_data),
        token=f"mock-token-{request.role}-{int(time.time())}"
    )

@router.get("/me", response_model=UserBase)
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    token = authorization.split(" ")[1]
    # Simple extraction of role from token: mock-token-ROLE-TIMESTAMP
    parts = token.split("-")
    if len(parts) >= 3:
        role = parts[2]
        user_data = MOCK_USERS.get(role)
        if user_data:
            return UserBase(**user_data)
            
    raise HTTPException(status_code=401, detail="Invalid token")
