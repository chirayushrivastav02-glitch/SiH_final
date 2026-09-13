from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class OrderCreateRequest(BaseModel):
    challenge_id: str
    application_id: str

class OrderCreateResponse(BaseModel):
    payment_id: str
    gateway_order_id: str
    amount: int
    currency: str
    key_id: str
    startup_name: str
    challenge_title: str

class PaymentVerifyRequest(BaseModel):
    payment_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class PaymentRecord(BaseModel):
    id: str = Field(default_factory=lambda: f"PAY-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}")
    startup_id: str
    challenge_id: str
    application_id: str
    gateway: str = "razorpay"
    gateway_order_id: str
    gateway_payment_id: Optional[str] = None
    amount: int
    amount_in_rupees: int
    currency: str = "INR"
    registration_fee_percentage: float = 0.05
    status: str = "CREATED"  # CREATED, SUCCESS, FAILED
    payment_method: Optional[str] = None
    failure_reason: Optional[str] = None
    webhook_event_id: Optional[str] = None
    refund_status: str = "NOT_APPLICABLE"
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    verified_at: Optional[str] = None
