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

    cursor.execute(
        "UPDATE requests SET status = ? WHERE id = ?",
        (new_status, request_id)
    )

    conn.commit()
    conn.close()

    print("Status updated successfully")


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


if __name__ == "__main__":
    print("1. View requests")
    view_requests()

    print("\n2. Sort by priority")
    sort_by_priority()

    print("\n3. Filter by status = In Progress")
    filter_by_status("In Progress")