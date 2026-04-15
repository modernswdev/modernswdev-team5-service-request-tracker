import sqlite3
import csv

DB_PATH = "database/service_requests.db"


def get_connection():
    return sqlite3.connect(DB_PATH)

def validate_credentials(email, password):
    connection = get_connection()
    cursor = connection.cursor()

    result = cursor.execute(
        """
        SELECT UserRole
        FROM Users
        WHERE Users.UserEmail = ? AND Users.UserPassword = ?
        """,
        (email, password),
    )

    fetched = result.fetchone()
    connection.close()

    if fetched is None:
        return 0
    return int(fetched["UserRole"])


def get_user_id(email, password):
    connection = get_connection()
    cursor = connection.cursor()

    result = cursor.execute(
        """
        SELECT UserID
        FROM Users
        WHERE Users.UserEmail = ? AND Users.UserPassword = ?
        """,
        (email, password),
    )

    fetched = result.fetchone()
    connection.close()

    if fetched is None:
        return 0
    return int(fetched["UserID"])


def status_int_to_str(status_int):
    if status_int == 0:
        return "Open"
    elif status_int == 1:
        return "In Progress"
    elif status_int == 2:
        return "Closed"
    return "Open"


def role_int_to_str(role_int):
    if role_int == 0:
        return "No Login"
    elif role_int == 1:
        return "User"
    elif role_int == 2:
        return "Staff"
    elif role_int == 3:
        return "Admin"
    return "No Login"


def status_str_to_int(status_value):
    if isinstance(status_value, int):
        return status_value

    normalized = str(status_value).strip().lower()

    if normalized == "open":
        return 0
    elif normalized == "in progress":
        return 1
    elif normalized == "resolved" or normalized == "closed":
        return 2

    return None


def priority_num_to_str(priority_value):
    try:
        priority_value = float(priority_value)
    except (TypeError, ValueError):
        return "Medium"

    if priority_value >= 7.5:
        return "High"
    elif priority_value >= 5.0:
        return "Medium"
    return "Low"


def priority_str_to_num(priority_value):
    if isinstance(priority_value, (int, float)):
        return float(priority_value)

    normalized = str(priority_value).strip().lower()

    if normalized == "low":
        return 2.5
    elif normalized == "medium":
        return 5.0
    elif normalized == "high":
        return 7.5

    return None


def has_required_role(min_role, requester_email=None, requester_password=None):
    if requester_email is None or requester_password is None:
        return True

    return validate_credentials(requester_email, requester_password) >= min_role


def build_user_name(first_name, last_name):
    first_name = first_name or ""
    last_name = last_name or ""
    full_name = f"{first_name} {last_name}".strip()

    if full_name == "":
        return "No Account"

    return full_name


def row_to_request_dict(row):
    return {
        "id": str(row["RequestID"]),
        "title": row["RequestTitle"],
        "user": build_user_name(row["UserFirstName"], row["UserLastName"]),
        "description": row["RequestBody"],
        "created_at": row["RequestCreateDate"],
        "updated_at": row["RequestModifyDate"],
        "priority": priority_num_to_str(row["RequestPriority"]),
        "status": status_int_to_str(int(row["RequestStatus"])),
    }


def view_requests(requester_email=None, requester_password=None):
    if not has_required_role(1, requester_email, requester_password):
        return []

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            Requests.RequestID,
            Requests.RequestTitle,
            Requests.RequestBody,
            Requests.RequestPriority,
            Requests.RequestStatus,
            Requests.RequestCreateDate,
            Requests.RequestModifyDate,
            Users.UserFirstName,
            Users.UserLastName
        FROM Requests
        LEFT JOIN Users
            ON Requests.RequestCreatorID = Users.UserID
        ORDER BY Requests.RequestID
        """
    )

    rows = cursor.fetchall()
    conn.close()

    return [
        {
        "id": str(row["RequestID"]),
        "title": row["RequestTitle"],
        "user": build_user_name(row["UserFirstName"], row["UserLastName"]),
        "description": row["RequestBody"],
        "created_at": row["RequestCreateDate"],
        "updated_at": row["RequestModifyDate"],
        "priority": priority_num_to_str(row["RequestPriority"]),
        "status": status_int_to_str(int(row["RequestStatus"])),
        }
        for row in rows
    ]


def view_request_details(request_id, requester_email=None, requester_password=None):
    if not has_required_role(1, requester_email, requester_password):
        return None

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            Requests.RequestID,
            Requests.RequestTitle,
            Requests.RequestBody,
            Requests.RequestPriority,
            Requests.RequestStatus,
            Requests.RequestCreateDate,
            Requests.RequestModifyDate,
            Users.UserFirstName,
            Users.UserLastName
        FROM Requests
        LEFT JOIN Users
            ON Requests.RequestCreatorID = Users.UserID
        WHERE Requests.RequestID = ?
        """,
        (request_id,),
    )

    row = cursor.fetchone()
    conn.close()

    if row is None:
        return None

    return row_to_request_dict(row)


def create_request(title, body, priority, requester_email=None, requester_password=None):
    if not has_required_role(1, requester_email, requester_password):
        return None

    priority_value = priority_str_to_num(priority)
    if priority_value is None:
        return None

    creator_id = 0
    if requester_email is not None and requester_password is not None:
        creator_id = get_user_id(requester_email, requester_password)

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO Requests (RequestTitle, RequestBody, RequestPriority, RequestCreatorID)
        VALUES (?, ?, ?, ?)
        """,
        (title, body, priority_value, creator_id),
    )

    conn.commit()
    new_request_id = cursor.lastrowid
    conn.close()

    return view_request_details(new_request_id)


def update_status(request_id, new_status, requester_email=None, requester_password=None):
    if not has_required_role(2, requester_email, requester_password):
        return None

    status_value = status_str_to_int(new_status)
    if status_value is None:
        return None

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE Requests
        SET RequestStatus = ?, RequestModifyDate = CURRENT_TIMESTAMP
        WHERE RequestID = ?
        """,
        (status_value, request_id),
    )

    conn.commit()
    updated_rows = cursor.rowcount
    conn.close()

    if updated_rows == 0:
        return None

    return view_request_details(request_id)


def sort_by_priority(requester_email=None, requester_password=None):
    if not has_required_role(1, requester_email, requester_password):
        return []

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            Requests.RequestID,
            Requests.RequestTitle,
            Requests.RequestBody,
            Requests.RequestPriority,
            Requests.RequestStatus,
            Requests.RequestCreateDate,
            Requests.RequestModifyDate,
            Users.UserFirstName,
            Users.UserLastName
        FROM Requests
        LEFT JOIN Users
            ON Requests.RequestCreatorID = Users.UserID
        ORDER BY Requests.RequestPriority DESC, Requests.RequestID
        """
    )

    rows = cursor.fetchall()
    conn.close()

    return [row_to_request_dict(row) for row in rows]


def filter_by_status(status_value, requester_email=None, requester_password=None):
    if not has_required_role(1, requester_email, requester_password):
        return []

    status_value_int = status_str_to_int(status_value)
    if status_value_int is None:
        return []

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            Requests.RequestID,
            Requests.RequestTitle,
            Requests.RequestBody,
            Requests.RequestPriority,
            Requests.RequestStatus,
            Requests.RequestCreateDate,
            Requests.RequestModifyDate,
            Users.UserFirstName,
            Users.UserLastName
        FROM Requests
        LEFT JOIN Users
            ON Requests.RequestCreatorID = Users.UserID
        WHERE Requests.RequestStatus = ?
        ORDER BY Requests.RequestID
        """,
        (status_value_int,),
    )

    rows = cursor.fetchall()
    conn.close()
    return len(rows)  # Added for unit testing. - Matthew Ingram


def status_int_to_str(status_int):
    if status_int == 0:
        return "Open"
    elif status_int == 1:
        return "In Progress"
    elif status_int == 2:
        return "Resolved"

def role_int_to_str(role_int):
    if role_int == 0:
        return "No Login"
    elif role_int == 1:
        return "User"
    elif role_int == 2:
        return "Staff"
    elif role_int == 3:
        return "Admin"

# Prepare database. - Matthew Ingram
def prepare_database():
    connection = get_connection()
    with open("database/database_tables.sql", "r") as schema:
        setup_string = schema.read()
    cursor = connection.cursor()
    cursor.executescript(setup_string)
    connection.commit()
    cursor.close()
    connection.close()

# Prepare both datasets. - Matthew Ingram
def read_datasets():
    connection = get_connection()
    cursor = connection.cursor()
    with open("datasets/service_requests.csv", newline = "\n") as service_requests_file:
        service_requests = csv.reader(service_requests_file, delimiter = ",", quotechar = "|")
        next(service_requests)

        for row in service_requests:
            status_converted = 0
            if row[3] == "Open":
                status_converted = 0
            elif row[3] == "In Progress":
                status_converted = 1
            elif row[3] == "Resolved" or row[3] == "Closed":
                status_converted = 2

            priority_converted = 0.0
            if row[4] == "Low":
                priority_converted = 2.5
            elif row[4] == "Medium":
                priority_converted = 5.0
            elif row[4] == "High":
                priority_converted = 7.5
            cursor.execute(
                """
                INSERT OR IGNORE INTO Requests (RequestID, RequestTitle, RequestBody, RequestStatus, RequestPriority, RequestCreatorID, RequestCreateDate, RequestModifyDate)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (int(row[0]), row[1], row[2], status_converted, priority_converted, int(row[7]), row[5], row[6])
            )
            connection.commit()

            if (row[8] != ""):
                cursor.execute(
                    """
                    INSERT OR IGNORE INTO Assignees (AssigneeRequestID, AssigneeHandlerID)
                    VALUES (?, ?)
                    """,
                    (int(row[0]), int(row[8]))
                )
                connection.commit()

    with open("datasets/users.csv", newline = "\n") as users_file:
        users = csv.reader(users_file, delimiter = ",", quotechar = "|")
        next(users)

        for row in users:
            role_converted = 0
            if row[4] == "user":
                role_converted = 1
            elif row[4] == "staff":
                role_converted = 2
            elif row[4] == "admin":
                role_converted = 3
            cursor.execute(
                """
                INSERT INTO Users (UserID, UserFirstName, UserLastName, UserEmail, UserPassword, UserRole, UserCreateDate)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (int(row[0]), row[1], row[2], row[3], "password" + str(row[0]), role_converted, row[5])
            )
            connection.commit()
    cursor.close()
    connection.close()


if __name__ == "__main__":
    prepare_database()
    read_datasets()
    print("Database prepared and datasets loaded.")
