-- Dummy data of various video game attributes that will be used in the application
-- Insert into VideoGame
INSERT INTO VideoGame (Price, GameName, Rating, Genre, Quantity)
VALUES 
  (59.99, 'The Legend of Zelda: Breath of the Wild', 5, 'Adventure', 100),
  (49.99, 'Halo Infinite', 4, 'FPS', 75),
  (59.99, 'Super Smash Bros. Ultimate', 5, 'Fighting', 50);

-- Insert into UserTable (Retailers and Warehouse Staff)
-- Retailers (UserType = 1)
INSERT INTO UserTable (Password, UserName, UserType)
VALUES 
  ('retail123', 'retail_user1', 1),
  ('retail456', 'retail_user2', 1);

-- Warehouse Staff (UserType = 0)
INSERT INTO UserTable (Password, UserName, UserType)
VALUES 
  ('staff123', 'admin_john', 0),
  ('staff456', 'worker_emma', 0);

-- Insert into Updates (Tracks which staff updated which game)
INSERT INTO Updates (GameID, StaffID)
VALUES 
  (1, 3),  -- Assuming 'admin_john' has UserID 3
  (2, 3),
  (3, 3);

-- Insert into Views (Tracks which retailers viewed which games)
INSERT INTO Views (GameID, UserID)
VALUES 
  (1, 1),  -- retail_user1 viewed The Legend of Zelda
  (2, 2);  -- retail_user2 viewed Halo Infinite

-- Insert into VideoGame_Platform (Associates games with platforms)
INSERT INTO VideoGame_Platform (Platform, GameID)
VALUES 
  ('Nintendo Switch', 1),
  ('Xbox Series X', 2),
  ('Nintendo Switch', 3);
