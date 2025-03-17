-- Insert into VideoGame
INSERT INTO VideoGame (Price, GameName, Rating, Genre, Quantity, Company)
VALUES 
  (59.99, 'The Legend of Zelda: Breath of the Wild', 5, 'Adventure', 100, 'Nintendo'),
  (49.99, 'Halo Infinite', 4, 'FPS', 75, 'Xbox Game Studios'),
  (59.99, 'Super Smash Bros. Ultimate', 5, 'Fighting', 50, 'Nintendo');  -- Fixed typo and misplaced period

-- Insert into Retailor
INSERT INTO Retailor (RPassword, RUserName)
VALUES 
  ('retail123', 'retail_user1'),
  ('retail456', 'retail_user2');

-- Insert into WarehouseStaff (Fixed Typo)
INSERT INTO WarehouseStaff (SPassword, SUserName, IsAdmin)
VALUES 
  ('staff123', 'admin_john', TRUE),
  ('staff456', 'worker_emma', FALSE);

-- Insert into Updates
INSERT INTO Updates (GameID, StaffID)
VALUES 
  (1, 1),
  (2, 1),
  (3, 1);

-- Insert into Views (Fixed RetailID 3 issue)
INSERT INTO Views (GameID, RetailID)
VALUES 
  (1, 1),
  (2, 2);

-- Insert into VideoGame_Platform (Fixed missing comma)
INSERT INTO VideoGame_Platform (Platform, GameID)
VALUES 
  ('Nintendo Switch', 1),
  ('Xbox Series X', 2),
  ('Nintendo Switch', 3);
