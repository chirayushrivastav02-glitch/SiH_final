from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

def test_auth():
    response = client.post("/api/auth/login", json={"role": "government", "email": "test@test.com", "password": "123"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "token" in data
    print("Auth test passed!")

def test_challenges():
    response = client.get("/api/challenges")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    print("Challenges list passed! Count:", len(data))

def test_startups():
    response = client.get("/api/startups")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    print("Startups list passed! Count:", len(data))

if __name__ == "__main__":
    try:
        test_auth()
        test_challenges()
        test_startups()
        print("All API tests passed.")
    except Exception as e:
        print("Test failed:", e)
