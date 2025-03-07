CREATE TABLE VideoGame (
  GameID INT NOT NULL AUTO_INCREMENT,
  Price DECIMAL(10, 2) NOT NULL CHECK (Price >= 0),
  GameName VARCHAR(255) NOT NULL,
  Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
  Genre VARCHAR(255) NOT NULL,
  Quantity INT NOT NULL CHECK (Quantity >= 0),
  Company VARCHAR(255) NOT NULL,
  PRIMARY KEY (GameID)
);

CREATE TABLE Retailor (
  RetailID INT NOT NULL AUTO_INCREMENT,
  RPassword VARCHAR(255) NOT NULL,
  RUserName VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (RetailID)
);

CREATE TABLE WarehouseStaff (
  StaffID INT NOT NULL AUTO_INCREMENT,
  SPassword VARCHAR(255) NOT NULL,
  SUserName VARCHAR(255) NOT NULL UNIQUE,
  IsAdmin BOOLEAN NOT NULL,
  PRIMARY KEY (StaffID)
);

-- Many-to-Many Tables
CREATE TABLE Updates (
  GameID INT NOT NULL,
  StaffID INT NOT NULL,
  PRIMARY KEY (GameID, StaffID),
  FOREIGN KEY (GameID) REFERENCES VideoGame(GameID),
  FOREIGN KEY (StaffID) REFERENCES WarehouseStaff(StaffID)
);

CREATE TABLE Views (
  GameID INT NOT NULL,
  RetailID INT NOT NULL,
  PRIMARY KEY (GameID, RetailID),
  FOREIGN KEY (GameID) REFERENCES VideoGame(GameID),
  FOREIGN KEY (RetailID) REFERENCES Retailor(RetailID)
);

CREATE TABLE VideoGame_Platform (
  Platform VARCHAR(255) NOT NULL,
  GameID INT NOT NULL,
  PRIMARY KEY (Platform, GameID),
  FOREIGN KEY (GameID) REFERENCES VideoGame(GameID)
);
