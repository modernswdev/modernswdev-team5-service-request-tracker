from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

#hardcoded list for now.
requests = [
    {
        "id": "1",
        "title": "Reset MFA on account",
        "user": "Eliza Morgan",
        "description": " ",
        "created_at": "12/03/2025",
        "priority": "High",
        "status": "Open",
    },
    {
        "id": "2",
        "title": "Software Access Request",
        "user": "Mike Chang",
        "description": " ",
        "created_at": "01/21/2026",
        "priority": "Low",
        "status": "In Progress",
    },
    {
        "id": "3",
        "title": "Account lockout",
        "user": "John Smith",
        "description": " ",
        "created_at": "03/12/2026",
        "priority": "Medium",
        "status": "Open",
    }
]

#endpoint to get all requests
@app.get("/requests")
def get_requests():
    return requests

#endpoint for specific request
@app.get("/requests/{request_id}")
def get_request(request_id: str):
    for request in requests:
        if request["id"] == request_id:
            return request
    raise HTTPException(status_code=404, detail="Request not found")
