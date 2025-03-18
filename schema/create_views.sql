-- CREATE VIEW Statements for REST API Data (* = view creation not necessary) 

-- View for /login (User Authentication)*
SELECT UserID, Username, Password, UserRole,
FROM users;

-- View for /inventory (Product Listings & Stock Levels)*
SELECT GameID, GameName, Platform, Rating, Genre, Company, Quantity, Price
FROM inventory;


-- View for /inventory when sorted by “Platform” (Multivalued attribute)
CREATE VIEW VideoGamePlatforms AS
SELECT 
    vg.GameID, 
    vg.GameName, 
    vg.Genre, 
    vg.Quantity, 
    vg.Rating, 
    vg.Price, 
    gp.Platform
FROM VideoGame vg
JOIN VideoGame_Platform gp ON vg.GameID = gp.GameID;

-- View for /about (Account info)*
SELECT UserID, Username, Password, UserType
FROM users;
