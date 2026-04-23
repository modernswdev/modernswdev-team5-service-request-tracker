from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from backend.requests import validate_credentials, role_int_to_str

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class RequestCreate(BaseModel):
    title: str
    description: str
    priority: str

class LoginRequest(BaseModel):
    email: str
    password: str

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

@app.post("/login")
def login(login_data: LoginRequest):
    role_num = validate_credentials(login_data.email, login_data.password)

    if role_num == 0:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "user": {
            "email": login_data.email,
            "role": role_int_to_str(role_num),
        },
    }


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

@app.post("/requests")
def create_request(new_request: RequestCreate):
    request_id = str(len(requests) + 1)

    request_data = {
        "id": request_id,
        "title": new_request.title,
        "user": "Current User",
        "description": new_request.description,
        "created_at": datetime.now().strftime("%m/%d/%Y"),
        "priority": new_request.priority,
        "status": "Open",
    }

    requests.append(request_data)
    return {"message": "Request created successfully", "request": request_data}

@app.put("/requests/{request_id}/status")
def update_request_status(request_id: str, new_status: str):
    for request in requests:
        if request["id"] == request_id:
            request["status"] = new_status
            return {"message": "Status updated successfully", "request": request}
    
    raise HTTPException(status_code=404, detail="Request not found")


