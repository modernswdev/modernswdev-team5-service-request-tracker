-- Service Request Tracker Database

CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT CHECK(priority IN ('Low','Medium','High')),
    status TEXT CHECK(status IN ('Open','In Progress','Closed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Users
(
	UserID		INTEGER		NOT NULL,
	UserFirstName	TEXT		,
	UserLastName	TEXT		,
	UserEmail	TEXT		NOT NULL UNIQUE,
	UserPassword	TEXT		NOT NULL,
	UserRole	INTEGER		NOT NULL CHECK(UserRole >= 0 AND UserRole <= 3) DEFAULT 0, -- 0 = No Login, 1 = User, 2 = Staff, 3 = Admin --
	UserCreateDate	TEXT		DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT	Users_PK	PRIMARY KEY(UserID)
	-- Spiritual Foreign Key - The foreign keys don't work the way I wanted them to, so refer to this for triggers. --
	-- CONSTRAINT	Assignees_FK	FOREIGN KEY(UserID) REFERENCES Assignees(AssigneeHandlerID) ON DELETE CASCADE
);