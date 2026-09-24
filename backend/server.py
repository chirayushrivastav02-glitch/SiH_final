from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")


# =========================================================
# MONGODB CONNECTION
# =========================================================

from lib.db import client, db


# =========================================================
# STARTUP / SHUTDOWN
# =========================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting IPPS Setu backend...")

    yield

    print("Shutting down IPPS Setu backend...")
    client.close()


# =========================================================
# CREATE FASTAPI APP
# =========================================================

app = FastAPI(lifespan=lifespan)


# =========================================================
# API ROUTER
# =========================================================

api_router = APIRouter(prefix="/api")


# =========================================================
# ROOT ROUTE
# =========================================================

@app.get("/")
async def home():
    return {
        "message": "IPPS Setu Backend is running",
        "status": "healthy"
    }


# =========================================================
# MODELS
# =========================================================

class StatusCheck(BaseModel):
    id: str = Field(
        default_factory=lambda: str(uuid.uuid4())
    )
    client_name: str
    timestamp: datetime = Field(
        default_factory=datetime.utcnow
    )


class StatusCheckCreate(BaseModel):
    client_name: str


# =========================================================
# HEALTH CHECK
# =========================================================

@api_router.get("/health")
async def health_check():
    return {
        "message": "Hello World",
        "status": "healthy"
    }


# =========================================================
# DATABASE HEALTH CHECK
# =========================================================

@api_router.get("/health/database")
async def database_health():
    try:
        await db.command("ping")

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }


# =========================================================
# STATUS CHECK
# =========================================================

@api_router.post(
    "/status",
    response_model=StatusCheck
)
async def create_status_check(
    input: StatusCheckCreate
):

    status_dict = input.model_dump()

    status_obj = StatusCheck(
        **status_dict
    )

    await db.status_checks.insert_one(
        status_obj.model_dump()
    )

    return status_obj


@api_router.get(
    "/status",
    response_model=List[StatusCheck]
)
async def get_status_checks():

    status_checks = await db.status_checks.find().to_list(1000)

    return [
        StatusCheck(**status_check)
        for status_check in status_checks
    ]


# =========================================================
# IMPORT OTHER ROUTERS
# =========================================================

from routers import (
    auth,
    challenges,
    startups,
    applications,
    pilot_evaluation,
    payments,
    waivers,
    refunds,
)


# =========================================================
# INCLUDE ROUTERS
# =========================================================

api_router.include_router(auth.router)
api_router.include_router(challenges.router)
api_router.include_router(startups.router)
api_router.include_router(applications.router)
api_router.include_router(pilot_evaluation.router)
api_router.include_router(payments.router)
api_router.include_router(waivers.router)
api_router.include_router(refunds.router)


# =========================================================
# AI MATCHING DISABLED
# =========================================================
#
# The matching router is intentionally NOT imported here.
#
# Reason:
# The AI matching system loads heavy ML dependencies/models
# and causes Render's 512 MB memory limit to be exceeded.
#
# It can be enabled later when more memory is available.
#
# =========================================================

print("AI matching router disabled to reduce memory usage.")


# =========================================================
# ADD API ROUTES
# =========================================================

app.include_router(api_router)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get(
        "CORS_ORIGINS",
        "*"
    ).split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# LOGGING
# =========================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

logger.info("IPPS Setu backend initialized successfully.")