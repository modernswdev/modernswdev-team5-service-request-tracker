import sqlite3
import csv

DB_PATH = "database/service_requests.db"

def get_connection():
    return sqlite3.connect(DB_PATH)

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
    print("Database prepared")

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
                INSERT INTO Requests (RequestID, RequestTitle, RequestBody, RequestStatus, RequestPriority, RequestCreatorID, RequestCreateDate, RequestModifyDate)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (int(row[0]), row[1], row[2], status_converted, priority_converted, int(row[7]), row[5], row[6])
            )
            connection.commit()

            if (row[8] != ""):
                cursor.execute(
                    """
                    INSERT INTO Assignees (AssigneeRequestID, AssigneeHandlerID)
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
    print("Datasets read")

if __name__ == "__main__":
    prepare_database()
    read_datasets()
    print("Database prepared and datasets loaded.")