import sqlite3

DB_PATH = "database/service_requests.db"


def get_connection():
    return sqlite3.connect(DB_PATH)


def view_requests():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, title, status, created_at FROM requests")
    rows = cursor.fetchall()

    print("Request List")
    print("===================")

    for row in rows:
        print("-------------------")
        print("id:", row[0])
        print("title:", row[1])
        print("status:", row[2])
        print("created_at:", row[3])

    conn.close()


def create_request(title, description, priority):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO requests (title, description, priority, status)
        VALUES (?, ?, ?, ?)
        """,
        (title, description, priority, "Open")
    )

    conn.commit()
    conn.close()

    print("Request created successfully")


def update_status(request_id, new_status):
    conn = get_connection()
    cursor = conn.cursor()

    # I have changed this to have custom error handling, for some reason pytest cannot
    # understand this function very well. - Matthew Ingram
    try:
        cursor.execute(
            "UPDATE requests SET status = ? WHERE id = ?",
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
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, title, description, priority, status, created_at, updated_at
        FROM requests
        WHERE id = ?
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
        print(f"Status      : {row[4]}")
        print(f"Created At  : {row[5]}")
        print(f"Updated At  : {row[6]}")
        print("==========================\n")
    else:
        print(f"\nNo request found with ID {request_id}.\n")


def open_request_details():
    request_id = input("Enter request ID to view details: ")

    try:
        request_id = int(request_id)
        view_request_details(request_id)
    except ValueError:
        print("Invalid ID. Please enter a number.")


def sort_by_priority():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, title, priority, status FROM requests ORDER BY priority"
    )

    rows = cursor.fetchall()

    print("Sorted by priority")
    print("===================")

    for row in rows:
        print(row)

    conn.close()


def filter_by_status(status_value):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, title, priority, status FROM requests WHERE status = ?",
        (status_value,)
    )

    rows = cursor.fetchall()

    print(f"Filtered by status = {status_value}")
    print("===================")

    for row in rows:
        print(row)

    conn.close()
    return len(rows)  # Added for unit testing. - Matthew Ingram


# Prepare database. - Matthew Ingram
def prepare_database():
    connection = get_connection()
    with open("database/schema.sql", "r") as schema:
        setup_string = schema.read()
    cursor = connection.cursor()
    cursor.executescript(setup_string)
    connection.commit()
    cursor.close()
    connection.close()


prepare_database()
# End of my addition. - Matthew Ingram

if __name__ == "__main__":
    print("1. View requests")
    view_requests()

    print("\n2. Open request details")
    open_request_details()

    print("\n3. Sort by priority")
    sort_by_priority()

    print("\n4. Filter by status = In Progress")
    filter_by_status("In Progress")