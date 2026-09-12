import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import patch, AsyncMock
from server import app

# Pytest async fixture
@pytest.fixture(scope="module")
def anyio_backend():
    return "asyncio"

@pytest.fixture
def mock_db():
    with patch("lib.matching_engine.db") as mock:
        yield mock

@pytest.mark.asyncio
async def test_analyze_valid_challenge(mock_db):
    """Test analyzing a valid challenge returns proper ranked startups."""
    mock_db.synthetic_challenges.find_one = AsyncMock(return_value={
        "challenge_id": "CH1",
        "challenge_title": "AI Innovation",
        "sector": "Tech",
        "required_technologies": ["AI", "ML"],
        "minimum_experience_years": 2,
        "location": "Pan India"
    })
    
    mock_cursor_apps = AsyncMock()
    mock_cursor_apps.to_list = AsyncMock(return_value=[{"startup_id": "ST1"}])
    mock_db.synthetic_applications.find.return_value = mock_cursor_apps
    
    mock_cursor_startups = AsyncMock()
    mock_cursor_startups.to_list = AsyncMock(return_value=[{
        "startup_id": "ST1",
        "startup_name": "Tech Corp",
        "sector": "Tech",
        "primary_technologies": ["AI", "ML"],
        "years_of_relevant_experience": 5,
        "team_capabilities": "Strong",
        "scalability_level": "High",
        "annual_revenue": 5000000,
        "preferred_deployment_locations": "Pan India"
    }])
    mock_db.synthetic_startups.find.return_value = mock_cursor_startups

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/matching/analyze", json={"challenge_id": "CH1"})
        
    assert response.status_code == 200
    data = response.json()
    assert data["challenge_id"] == "CH1"
    assert data["applications_analyzed"] == 1
    assert data["eligible_count"] == 1
    assert len(data["results"]) == 1
    
    result = data["results"][0]
    assert result["eligible"] is True
    assert result["technology_fit"] == 100.0

@pytest.mark.asyncio
async def test_analyze_invalid_challenge(mock_db):
    """Test analyzing an invalid challenge ID raises 404."""
    mock_db.synthetic_challenges.find_one = AsyncMock(return_value=None)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/matching/analyze", json={"challenge_id": "INVALID_ID"})
        
    assert response.status_code == 404
    
@pytest.mark.asyncio
async def test_analyze_challenge_no_applications(mock_db):
    """Test a valid challenge ID that has no applications returns empty result list."""
    mock_db.synthetic_challenges.find_one = AsyncMock(return_value={"challenge_id": "CH_NO_APP"})
    
    mock_cursor_apps = AsyncMock()
    mock_cursor_apps.to_list = AsyncMock(return_value=[])
    mock_db.synthetic_applications.find.return_value = mock_cursor_apps
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/matching/analyze", json={"challenge_id": "CH_NO_APP"})
        
    assert response.status_code == 200
    data = response.json()
    assert data["applications_analyzed"] == 0
    assert data["results"] == []

def test_cosine_similarity():
    """Test the raw mathematical calculation of cosine similarity."""
    from lib.matching_engine import calculate_semantic_similarity, model
    if model is None:
        pytest.skip("SBERT model not loaded.")
        
    # Same descriptions should yield 100%
    ch = {"challenge_title": "Test", "problem_statement": "AI", "detailed_description": "Machine Learning"}
    st = {"startup_name": "Test", "short_description": "AI", "detailed_description": "Machine Learning"}
    
    score = calculate_semantic_similarity(ch, st)
    assert score >= 99.0
    
def test_hard_eligibility_filtering():
    """Test the rejection rules."""
    from lib.matching_engine import check_hard_eligibility
    
    ch = {"minimum_experience_years": 5, "required_technologies": ["AI"], "required_certifications": ["ISO"]}
    st = {"years_of_relevant_experience": 2, "primary_technologies": ["AI"], "certifications": ["ISO"]}
    
    eligible, reasons = check_hard_eligibility(ch, st)
    assert not eligible
    assert "Minimum experience requirement not met." in reasons
    
    st["years_of_relevant_experience"] = 5
    st["primary_technologies"] = ["Web"]
    eligible, reasons = check_hard_eligibility(ch, st)
    assert not eligible
    assert "Mandatory technology absent." in reasons
    
    st["primary_technologies"] = ["AI"]
    st["certifications"] = []
    eligible, reasons = check_hard_eligibility(ch, st)
    assert not eligible
    assert "Required certification missing." in reasons
    
    st["certifications"] = ["ISO"]
    eligible, reasons = check_hard_eligibility(ch, st)
    assert eligible
    assert len(reasons) == 0

def test_refund_data_is_ignored():
    """Ensure that the scoring mathematically ignores refund_amount or registration_fees."""
    from lib.matching_engine import calculate_structured_scores
    
    ch = {"sector": "Health", "minimum_experience_years": 2, "location": "Pan India"}
    st1 = {"sector": "Health", "years_of_relevant_experience": 2, "preferred_deployment_locations": "Pan India", "refund_amount": 1000}
    st2 = {"sector": "Health", "years_of_relevant_experience": 2, "preferred_deployment_locations": "Pan India", "refund_amount": 0}
    
    scores1 = calculate_structured_scores(ch, st1)
    scores2 = calculate_structured_scores(ch, st2)
    
    assert scores1 == scores2
