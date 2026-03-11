#ifndef AUTH_H
#define AUTH_H

#include <string>
#include <sqlite3.h>

bool validateLogin(sqlite3* db, const std::string& username, const std::string& password);
void loginUser(sqlite3* db);

#endif
