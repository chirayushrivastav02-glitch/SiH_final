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


# ============================================================
# ENVIRONMENT
# ============================================================

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")


# ============================================================
# MONGODB
# ============================================================

from lib.db import client, db


# ============================================================
# APPLICATION LIFESPAN
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting IPPS Setu backend...")
    yield
    print("Closing MongoDB connection...")
    client.close()


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="IPPS Setu API",
    lifespan=lifespan
)


# ============================================================
# API ROUTER
# ============================================================

api_router = APIRouter(prefix="/api")


# ============================================================
# MODELS
# ============================================================

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatusCheckCreate(BaseModel):
    client_name: str


# ============================================================
# HEALTH CHECK
# ============================================================

@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "IPPS Setu backend is running"
    }


# ============================================================
# MONGODB TEST
# ============================================================

@api_router.get("/health/database")
async def database_health():
    try:
        await db.command("ping")

        return {
            "status": "healthy",
            "mongodb": "connected"
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "mongodb": "disconnected",
            "error": str(e)
        }


# ============================================================
# STATUS CHECK
# ============================================================

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):

    status_dict = input.model_dump()

    status_obj = StatusCheck(**status_dict)

    await db.status_checks.insert_one(
        status_obj.model_dump()
    )

    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():

    status_checks = await db.status_checks.find().to_list(1000)

    return [
        StatusCheck(**status_check)
        for status_check in status_checks
    ]


# ============================================================
# OTHER ROUTERS
# ============================================================

from routers import (
    auth,
    challenges,
    startups,
    applications,
    pilot_evaluation,
    payments,
    waivers,
    refunds
)


api_router.include_router(auth.router)
api_router.include_router(challenges.router)
api_router.include_router(startups.router)
api_router.include_router(applications.router)
api_router.include_router(pilot_evaluation.router)
api_router.include_router(payments.router)
api_router.include_router(waivers.router)
api_router.include_router(refunds.router)


# ============================================================
# MATCHING ROUTER
# ============================================================
#
# IMPORTANT:
# The matching router uses heavy ML libraries such as
# sentence-transformers / torch.
#
# We are NOT loading it during this deployment because
# Render's 512 MB memory limit is being exceeded.
#
# Later we can optimize the AI matching feature and enable it.
#

ENABLE_MATCHING = os.getenv(
    "ENABLE_MATCHING",
    "false"
).lower() == "true"


if ENABLE_MATCHING:

    try:
        from routers import matching

        api_router.include_router(matching.router)

        print("AI matching router enabled.")

    except Exception as e:

        print(
            f"WARNING: AI matching router could not be loaded: {e}"
        )

else:

    print(
        "AI matching router disabled to reduce memory usage."
    )


# ============================================================
# INCLUDE API ROUTER
# ============================================================

app.include_router(api_router)


# ============================================================
# CORS
# ============================================================

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


# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,

    format=(
        "%(asctime)s - "
        "%(name)s - "
        "%(levelname)s - "
        "%(message)s"
    )
)

logger = logging.getLogger(__name__)