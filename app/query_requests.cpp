#include <iostream>
#include <sqlite3.h>

using namespace std;

void createRequest(sqlite3* db) {
    const char* sql =
        "INSERT INTO requests (title, description, priority, status) "
        "VALUES ('Printer Issue', 'Printer not working', 'High', 'Open');";

    char* errMsg = 0;

    int rc = sqlite3_exec(db, sql, 0, 0, &errMsg);

    if (rc != SQLITE_OK) {
        cout << "Insert error: " << errMsg << endl;
        sqlite3_free(errMsg);
    } else {
        cout << "Request inserted successfully\n";
    }
}

static int callback(void* data, int argc, char** argv, char** colName) {
    for (int i = 0; i < argc; i++) {
        cout << colName[i] << ": " << (argv[i] ? argv[i] : "NULL") << " | ";
    }
    cout << endl;
    return 0;
}

void listRequests(sqlite3* db) {
    const char* sql = "SELECT * FROM requests;";

    char* errMsg = 0;

    int rc = sqlite3_exec(db, sql, callback, 0, &errMsg);

    if (rc != SQLITE_OK) {
        cout << "Select error: " << errMsg << endl;
        sqlite3_free(errMsg);
    }
}

void updateStatus(sqlite3* db) {
    const char* sql =
        "UPDATE requests SET status='In Progress' WHERE id=1;";

    char* errMsg = 0;

    int rc = sqlite3_exec(db, sql, 0, 0, &errMsg);

    if (rc != SQLITE_OK) {
        cout << "Update error: " << errMsg << endl;
        sqlite3_free(errMsg);
    } else {
        cout << "Status updated\n";
    }
}

int main() {

    sqlite3* db;

    int rc = sqlite3_open("database/service_requests.db", &db);

    if (rc) {
        cout << "Can't open database\n";
        return 0;
    }

    cout << "Database opened successfully\n";

    createRequest(db);

    cout << "\nAll Requests:\n";
    listRequests(db);

    updateStatus(db);

    cout << "\nAfter Status Update:\n";
    listRequests(db);

    sqlite3_close(db);

    return 0;
}