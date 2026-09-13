from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class WaiverDocument(BaseModel):
    file_name: str
    file_url: str
    uploaded_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class FeeWaiverCreateRequest(BaseModel):
    challenge_id: str
    application_id: str
    reason: str
    documents: List[WaiverDocument] = Field(default_factory=list)

class FeeWaiverReviewRequest(BaseModel):
    status: str
    reviewer_remarks: Optional[str] = None

class FeeWaiver(BaseModel):
    id: str = Field(default_factory=lambda: f"WAIV-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}")
    startup_id: str
    challenge_id: str
    application_id: str
    reason: str
    requested_amount: int = 5000000  # In paise (50,000 INR)
    documents: List[WaiverDocument] = Field(default_factory=list)
    status: str = "PENDING"  # PENDING, APPROVED, REJECTED, CANCELLED
    reviewer_id: Optional[str] = None
    reviewer_remarks: Optional[str] = None
    requested_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    reviewed_at: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
