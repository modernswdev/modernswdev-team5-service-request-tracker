import sqlite3
import csv
from backend.setup import(get_connection, status_int_to_str)

def validate_credentials(email, password):
    connection = get_connection()
    cursor = connection.cursor()

    result = cursor.execute(
        """
        SELECT UserRole
        FROM Users
        WHERE Users.UserEmail = ? AND Users.UserPassword = ?
        """,
        (email, password)
    )

    fetched = result.fetchone()

    connection.close()

    if fetched is None:
        return 0
    else:
        return fetched[0]

def get_user_id(email, password):
    connection = get_connection()
    cursor = connection.cursor()

    result = cursor.execute(
        """
        SELECT UserID
        FROM Users
        WHERE Users.UserEmail = ? AND Users.UserPassword = ?
        """,
        (email, password)
    )

    fetched = result.fetchone()

    connection.close()

    if fetched is None:
        return 0
    else:
        return fetched[0]


def view_requests(requester_email, requester_password):
    if validate_credentials(requester_email, requester_password) < 1:
        return

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT RequestID, RequestTitle, RequestStatus, RequestCreateDate FROM Requests")
    rows = cursor.fetchall()

    print("Request List")
    print("===================")

    for row in rows:
        print("-------------------")
        print("id:", row[0])
        print("title:", row[1])
        print("status:", status_int_to_str(int(row[2])))
        print("created_at:", row[3])

    conn.close()


def create_request(title, body, priority, requester_email, requester_password):
    if validate_credentials(requester_email, requester_password) < 1:
        return

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO Requests (RequestTitle, RequestBody, RequestPriority, RequestCreatorID)
        VALUES (?, ?, ?, ?)
        """,
        (title, body, priority, get_user_id(requester_email, requester_password))
    )

    conn.commit()
    conn.close()

    print("Request created successfully")


def update_status(request_id, new_status, requester_email, requester_password):
    if validate_credentials(requester_email, requester_password) < 2:
        return False

    conn = get_connection()
    cursor = conn.cursor()

    # I have changed this to have custom error handling, for some reason pytest cannot
    # understand this function very well. - Matthew Ingram

    try:
        cursor.execute(
            "UPDATE Requests SET RequestStatus = ? WHERE RequestID = ?",
            (new_status, request_id)
        )
    except:
        conn.close()
        return False
    else:
        conn.commit()
        conn.close()
        print("Status updated successfully")
        return True
    # End of my changes here. - Matthew Ingram

def view_request_details(request_id):
    # No need to validate credentials, this function is called from another. - Matthew Ingram

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT RequestID, RequestTitle, RequestBody, RequestPriority, RequestStatus, RequestCreateDate, RequestModifyDate
        FROM Requests
        WHERE Requests.RequestID = ?
        """,
        (request_id,)
    )

    row = cursor.fetchone()
    conn.close()

    if row:
        print("\nRequest Details")
        print("==========================")
        print(f"ID          : {row[0]}")
        print(f"Title       : {row[1]}")
        print(f"Description : {row[2]}")
        print(f"Priority    : {row[3]}")
        print(f"Status      : {status_int_to_str(int(row[4]))}")
        print(f"Created At  : {row[5]}")
        print(f"Updated At  : {row[6]}")
        print("==========================\n")
    else:
        print(f"\nNo request found with ID {request_id}.\n")


def open_request_details(requester_email, requester_password):
    if validate_credentials(requester_email, requester_password) < 2:
        return
        
    request_id = input("Enter request ID to view details: ")

    try:
        request_id = int(request_id)
        view_request_details(request_id)
    except ValueError:
        print("Invalid ID. Please enter a number.")


def sort_by_priority(requester_email, requester_password):
    if validate_credentials(requester_email, requester_password) < 1:
        return
        
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT RequestID, RequestTitle, RequestPriority, RequestStatus FROM Requests ORDER BY Requests.RequestPriority"
    )

    rows = cursor.fetchall()

    print("Sorted by priority")
    print("===================")

    for row in rows:
        print(row)

    conn.close()


def filter_by_status(status_value, requester_email, requester_password):
    if validate_credentials(requester_email, requester_password) < 1:
        return 0

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT RequestID, RequestTitle, RequestPriority, RequestStatus FROM Requests WHERE Requests.RequestStatus = ?",
        (status_value,)
    )

    rows = cursor.fetchall()

    print(f"Filtered by status = {status_int_to_str(int(status_value))}")
    print("===================")

    for row in rows:
        print(row)

    conn.close()
    return len(rows)  # Added for unit testing. - Matthew Ingram

if __name__ == "__main__":
    email, password = input("Please input your user email, followed by your user password: ").split()

    print("1. View requests")
    view_requests(email, password)

    print("\n2. Sort by priority")
    sort_by_priority(email, password)

    print("\n3. Filter by status = In Progress")
    filter_by_status(1, email, password)
    
    print("\n4. Open request details")
    open_request_details(email, password)