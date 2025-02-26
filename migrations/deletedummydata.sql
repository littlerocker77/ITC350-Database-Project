-- Delete in reverse order to respect foreign keys
DELETE FROM VideoGame_Platform;
DELETE FROM Views;
DELETE FROM Updates;
DELETE FROM WearhouseStaff;
DELETE FROM Retailor;
DELETE FROM VideoGame;

-- Reset auto-increment counters (optional)
ALTER TABLE VideoGame AUTO_INCREMENT = 1;
ALTER TABLE Retailor AUTO_INCREMENT = 1;
ALTER TABLE WearhouseStaff AUTO_INCREMENT = 1;
