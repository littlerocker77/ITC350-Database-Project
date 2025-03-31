CREATE TABLE VideoGame (
  GameID INT NOT NULL AUTO_INCREMENT,
  Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
  GameName VARCHAR(255) NOT NULL,
  Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
  Genre VARCHAR(255) NOT NULL,
  Quantity INT NOT NULL CHECK (Quantity >= 0),
  PlatformID INT NOT NULL CHECK (Rating BETWEEN 1 AND 3), -- Switch=1, Xbox=2, PS5=3
  PRIMARY KEY (GameID)
  FOREIGN KEY (PlatformID) REFERENCES VideoGame_Platform(PlatformID),
);

CREATE TABLE UserTable (  -- Renamed from User to UserTable
  UserID INT NOT NULL AUTO_INCREMENT,
  Password VARCHAR(255) NOT NULL,
  UserName VARCHAR(255) NOT NULL UNIQUE,
  UserType INT NOT NULL CHECK (UserType IN (0, 1)),  -- 0 for Warehouse Staff, 1 for Retailers
  PRIMARY KEY (UserID)
);

-- Many-to-Many Tables
CREATE TABLE Updates (
  GameID INT NOT NULL,
  StaffID INT NOT NULL,  -- Fixed column name for clarity
  PRIMARY KEY (GameID, StaffID),
  FOREIGN KEY (GameID) REFERENCES VideoGame(GameID),
  FOREIGN KEY (StaffID) REFERENCES UserTable(UserID)  -- Updated reference to UserTable
);

CREATE TABLE Views (
  GameID INT NOT NULL,
  UserID INT NOT NULL,
  PRIMARY KEY (GameID, UserID),
  FOREIGN KEY (GameID) REFERENCES VideoGame(GameID),
  FOREIGN KEY (UserID) REFERENCES UserTable(UserID)  -- Updated reference to UserTable
);

CREATE TABLE VideoGame_Platform (
  PlatformID INT NOT NULL CHECK (Rating BETWEEN 1 AND 3), -- Switch=1, Xbox=2, PS5=3
  Platform VARCHAR(255) NOT NULL,
  PRIMARY KEY (PlatformID),
);
