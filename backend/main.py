from fastapi import FastAPI, HTTPException, Query
from datetime import date
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.setup import (get_connection,
    initialize_database,
    priority_float_to_str,
    priority_str_to_float,
    role_int_to_str,
    status_int_to_str,
    status_str_to_int,
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

#The main.py file defines the FastAPI application, including endpoints for user authentication and request management. 

#created models for request bodies because FastAPI can automatically validate incoming data against these models
class LoginRequest(BaseModel):
    email: str
    password: str

class CreateRequestBody(BaseModel):
    title: str
    description: str
    priority: str
    creator_id: int

class UpdateStatusBody(BaseModel):
    new_status: str

    
#function to convert database row to API response format
def row_to_request_response(row):
    full_name = " ".join(
        part for part in [row["UserFirstName"], row["UserLastName"]] if part
    ).strip()
    return {
        "id": row["RequestID"],
        "title": row["RequestTitle"],
        "description": row["RequestBody"],
        "priority": priority_float_to_str(float(row["RequestPriority"])),
        "status": status_int_to_str(int(row["RequestStatus"])),
        "created_at": row["RequestCreateDate"],
        "user": full_name or "Unknown",
    }


def get_request_by_id(cursor, request_id):
    result = cursor.execute(
        """
        SELECT r.RequestID, r.RequestTitle, r.RequestBody, r.RequestPriority, r.RequestStatus, r.RequestCreateDate,
               u.UserFirstName, u.UserLastName
        FROM Requests r
        LEFT JOIN Users u ON u.UserID = r.RequestCreatorID
        WHERE r.RequestID = ?
        """,
        (request_id,),
    )
    return result.fetchone()


@app.on_event("startup")
def startup_event():
    initialize_database()

@app.post("/auth/login")
def login(body: LoginRequest):
    connection = get_connection()
    cursor = connection.cursor()
    result = cursor.execute(
        """
        SELECT UserID, UserFirstName, UserLastName, UserEmail, UserRole
        FROM Users
        WHERE UserEmail = ? AND UserPassword = ?
        """,
        (body.email, body.password),
    )
    row = result.fetchone()
    connection.close()

    if row is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    full_name = " ".join(part for part in [row["UserFirstName"], row["UserLastName"]] if part)
    return {
        "id": row["UserID"],
        "name": full_name.strip() or row["UserEmail"],
        "email": row["UserEmail"],
        "role": role_int_to_str(int(row["UserRole"])),
    }

#endpoint to get all requests
@app.get("/requests")
def get_requests():
    connection = get_connection()
    cursor = connection.cursor()
    rows = cursor.execute(
        """
        SELECT r.RequestID, r.RequestTitle, r.RequestBody, r.RequestPriority, r.RequestStatus, r.RequestCreateDate,
               u.UserFirstName, u.UserLastName
        FROM Requests r
        LEFT JOIN Users u ON u.UserID = r.RequestCreatorID
        ORDER BY r.RequestID DESC
        """
    ).fetchall()
    connection.close()

    return [row_to_request_response(row) for row in rows]

#endpoint for specific request
@app.get("/requests/{request_id}")
def get_request(request_id: int):
    connection = get_connection()
    cursor = connection.cursor()
    row = get_request_by_id(cursor, request_id)
    connection.close()

    if row is None:
        raise HTTPException(status_code=404, detail="Request not found")
    return row_to_request_response(row)

#endpoint to create a new request
@app.post("/requests")
def create_request(body: CreateRequestBody):
    priority_value = priority_str_to_float(body.priority)
    connection = get_connection()
    cursor = connection.cursor()
    next_request_id = cursor.execute("SELECT COALESCE(MAX(RequestID), 1000) + 1 FROM Requests").fetchone()[0]

    today = date.today().isoformat()
    cursor.execute(
        """
        INSERT INTO Requests (RequestID, RequestTitle, RequestBody, RequestStatus, RequestPriority, RequestCreatorID, RequestCreateDate, RequestModifyDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            next_request_id,
            body.title.strip(),
            body.description.strip(),
            status_str_to_int("Open"),
            priority_value,
            body.creator_id,
            today,
            today,
        ),
    )
    connection.commit()

    row = get_request_by_id(cursor, next_request_id)
    connection.close()
    return row_to_request_response(row)


@app.put("/requests/{request_id}/status")
def update_request_status(request_id: int,body: UpdateStatusBody | None = None,new_status: str | None = Query(default=None),
):
    requested_status = body.new_status if body is not None else new_status
    status_value = status_str_to_int(requested_status)

    connection = get_connection()
    cursor = connection.cursor()
    updated = cursor.execute(
        """
        UPDATE Requests
        SET RequestStatus = ?, RequestModifyDate = ?
        WHERE RequestID = ?
        """,
        (status_value, date.today().isoformat(), request_id),
    )
    connection.commit()

    row = get_request_by_id(cursor, request_id)
    connection.close()
    return {"message": "Status updated successfully", "request": row_to_request_response(row)}
