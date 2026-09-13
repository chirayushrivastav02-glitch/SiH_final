from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class RefundEligibilityResponse(BaseModel):
    eligible: bool
    reason: str
    original_amount: int
    processing_fee: int
    refundable_amount: int
    currency: str = "INR"

class RefundRecord(BaseModel):
    id: str = Field(default_factory=lambda: f"REF-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}")
    payment_id: str
    startup_id: str
    challenge_id: str
    application_id: str
    original_amount: int
    processing_fee: int
    refundable_amount: int
    currency: str = "INR"
    eligibility_reason: str
    status: str = "ELIGIBLE"  # ELIGIBLE, REQUESTED, PROCESSING, COMPLETED, FAILED, CANCELLED
    gateway: str = "razorpay"
    gateway_payment_id: str
    gateway_refund_id: Optional[str] = None
    requested_by: Optional[str] = None
    approved_by: Optional[str] = None
    failure_reason: Optional[str] = None
    webhook_event_id: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    requested_at: Optional[str] = None
    completed_at: Optional[str] = None
