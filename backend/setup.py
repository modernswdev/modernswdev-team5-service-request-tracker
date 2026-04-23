import csv
import os
import sqlite3
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DB_PATH = ROOT_DIR / "database" / "service_requests.db"
DB_PATH = Path(os.getenv("DATABASE_PATH", str(DEFAULT_DB_PATH)))
SCHEMA_PATH = ROOT_DIR / "database" / "database_tables.sql"
USERS_DATASET_PATH = ROOT_DIR / "datasets" / "users.csv"
REQUESTS_DATASET_PATH = ROOT_DIR / "datasets" / "service_requests.csv"


def get_connection():
    #ensure the database directory exists
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def status_int_to_str(status_int):
    if status_int == 0:
        return "Open"
    if status_int == 1:
        return "In Progress"
    if status_int == 2:
        return "Closed"
    return "Open"


def status_str_to_int(status_text):
    normalized = status_text.strip().lower()
    if normalized == "open":
        return 0
    if normalized == "in progress":
        return 1
    if normalized in ("closed", "resolved"):
        return 2


def role_int_to_str(role_int):
    if role_int == 0:
        return "No Login"
    if role_int == 1:
        return "User"
    if role_int == 2:
        return "Staff"
    if role_int == 3:
        return "Admin"


def role_str_to_int(role_text):
    normalized = role_text.strip().lower()
    if normalized == "user":
        return 1
    if normalized == "staff":
        return 2
    if normalized == "admin":
        return 3
    return 0


def priority_float_to_str(priority_value):
    if priority_value >= 7.0:
        return "High"
    if priority_value >= 4.0:
        return "Medium"
    return "Low"


def priority_str_to_float(priority_text):
    normalized = priority_text.strip().lower()
    if normalized == "low":
        return 2.5
    if normalized == "medium":
        return 5.0
    if normalized == "high":
        return 7.5
    raise ValueError(f"Unsupported priority: {priority_text}")


def apply_schema(connection):
    with open(SCHEMA_PATH, "r", encoding="utf-8") as schema:
        setup_script = schema.read()
    cursor = connection.cursor()
    cursor.executescript(setup_script)
    connection.commit()
    cursor.close()

# Prepare both datasets. - Matthew Ingram
def seed_users(connection):
    cursor = connection.cursor()
    # check if users already exist to avoid duplicate seeding
    existing_users = cursor.execute("SELECT COUNT(*) FROM Users").fetchone()[0]
    if existing_users > 1:
        cursor.close()
        return

    with open(USERS_DATASET_PATH, newline="\n", encoding="utf-8") as users_file:
        users = csv.DictReader(users_file)
        for row in users:
            cursor.execute(
                """
                INSERT OR IGNORE INTO Users
                (UserID, UserFirstName, UserLastName, UserEmail, UserPassword, UserRole, UserCreateDate)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    int(row["user_id"]),
                    row["first_name"],
                    row["last_name"],
                    row["email"],
                    f"password{row['user_id']}",
                    role_str_to_int(row["role"]),
                    row["created_date"],
                ),
            )
    connection.commit()
    cursor.close()

def seed_requests(connection):
    cursor = connection.cursor()
    # check if requests already exist to avoid duplicate seeding
    existing_requests = cursor.execute("SELECT COUNT(*) FROM Requests").fetchone()[0]
    if existing_requests > 0:
        cursor.close()
        return

    with open(REQUESTS_DATASET_PATH, newline="\n", encoding="utf-8") as requests_file:
        service_requests = csv.DictReader(requests_file)
        for row in service_requests:
            cursor.execute(
                """
                INSERT OR IGNORE INTO Requests (RequestID, RequestTitle, RequestBody, RequestStatus, RequestPriority, RequestCreatorID, RequestCreateDate, RequestModifyDate)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (int(row["request_id"]), row["title"], row["description"], status_str_to_int(row["status"]),
                    priority_str_to_float(row["priority"]),
                    int(row["created_by_user_id"]),
                    row["created_date"],
                    row["updated_date"],
                ),
            )

            if row["assigned_to_user_id"]:
                cursor.execute(
                    """
                    INSERT OR IGNORE INTO Assignees (AssigneeRequestID, AssigneeHandlerID)
                    VALUES (?, ?)
                    """,
                    (int(row["request_id"]), int(row["assigned_to_user_id"])),
                )

    connection.commit()
    cursor.close()


def initialize_database(force_reset=False):
    if force_reset and DB_PATH.exists():
        DB_PATH.unlink()

    connection = get_connection()
    apply_schema(connection)
    seed_users(connection)
    seed_requests(connection)
    connection.close()
# End of my addition. - Matthew Ingram