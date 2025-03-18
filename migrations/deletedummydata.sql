SET SQL_SAFE_UPDATES = 0;

-- Delete in reverse order to respect foreign key constraints
DELETE FROM VideoGame_Platform;
DELETE FROM Views;
DELETE FROM Updates;
DELETE FROM UserTable;  -- Combines WarehouseStaff & Retailor
DELETE FROM VideoGame;

-- Reset auto-increment counters (optional)
ALTER TABLE VideoGame AUTO_INCREMENT = 1;
ALTER TABLE UserTable AUTO_INCREMENT = 1;

SET SQL_SAFE_UPDATES = 1;
