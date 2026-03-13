#include <iostream>
#include <sqlite3.h>

using namespace std;

static int callback(void* NotUsed, int argc, char** argv, char** azColName) {

    cout << "----------------------" << endl;

    for (int i = 0; i < argc; i++) {
        cout << azColName[i] << ": "
             << (argv[i] ? argv[i] : "NULL") << endl;
    }

    return 0;
}

int main() {

    sqlite3 *db;
    char *errMsg = 0;

    int rc = sqlite3_open("database/service_requests.db", &db);

    if(rc) {
        cout << "Can't open database" << endl;
        return 0;
    }

    cout << "Request List" << endl;
    cout << "=====================" << endl;

    const char* sql =
    "SELECT id, title, status, created_at FROM requests;";

    rc = sqlite3_exec(db, sql, callback, 0, &errMsg);

    if(rc != SQLITE_OK) {
        cout << "SQL error: " << errMsg << endl;
    }

    sqlite3_close(db);

    return 0;
}