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

CREATE TRIGGER IF NOT EXISTS cascade_user_deletion
DELETE ON Users
BEGIN
  DELETE FROM Assignees
  WHERE EXISTS (
    SELECT *
    FROM Users
    WHERE old.UserID = Assignees.AssigneeHandlerID
  );
  UPDATE Requests
  SET RequestCreatorID = 0
  WHERE EXISTS (
    SELECT *
    FROM Users
    WHERE old.UserID = Requests.RequestCreatorID
  );
END;

INSERT INTO Users(UserID, UserFirstName, UserLastName, UserEmail, UserPassword)
VALUES(0, "No", "Account", "email", "password");

CREATE TABLE IF NOT EXISTS Requests
(
	RequestID		INTEGER		NOT NULL,
	RequestTitle		TEXT		NOT NULL,
	RequestBody		TEXT		NOT NULL,
	RequestStatus		INTEGER		NOT NULL CHECK(RequestStatus >= 0 AND RequestStatus <= 2) DEFAULT 0, -- 0 = Open, 1 = In Progress, 2 = Resolved --
	RequestPriority		REAL		NOT NULL CHECK(RequestPriority >= 0.0 AND RequestPriority <= 10.0),
	RequestCreatorID	INTEGER		NOT NULL,
	RequestCreateDate	TEXT		DEFAULT CURRENT_TIMESTAMP,
	RequestModifyDate	TEXT		DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT		Requests_PK	PRIMARY KEY(RequestID)
	-- Spiritual Foreign Keys - The foreign keys don't work the way I wanted them to, so refer to these for triggers. --
	-- CONSTRAINT		Users_FK	FOREIGN KEY(RequestCreatorID) REFERENCES Users(UserID) ON DELETE SET 0
	-- CONSTRAINT		Assignees_FK	FOREIGN KEY(RequestID) REFERENCES Assignees(AssigneeRequestID) ON DELETE CASCADE
);

CREATE TRIGGER IF NOT EXISTS cascade_request_deletion
DELETE ON Requests
BEGIN
  DELETE FROM Assignees
  WHERE EXISTS (
    SELECT *
    FROM Requests
    WHERE old.RequestID = Assignees.AssigneeRequestID
  );
END;

CREATE TABLE IF NOT EXISTS Assignees
(
	AssigneeID		INTEGER		NOT NULL,
	AssigneeRequestID	INTEGER		NOT NULL,
	AssigneeHandlerID	INTEGER		NOT NULL,
	AssigneeAddedDate	TEXT		DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT		Assignees_PK	PRIMARY KEY(AssigneeID)
);
