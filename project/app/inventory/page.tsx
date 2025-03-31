'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './inventory.module.css';

interface VideoGame {
  GameID: number;
  GameName: string;
  Platform: string;
  Rating: number;
  Genre: string;
  Quantity: number;
  Price: number;
}

interface User {
  id: number;
  username: string;
  userType: number;
}

export default function Inventory() {
  const [games, setGames] = useState<VideoGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState({
    platform: '',
    genre: '',
    rating: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGame, setNewGame] = useState({
    GameName: '',
    Price: '',
    Rating: '1',
    Genre: '',
    Quantity: '0',
    Platform: ''
  });

  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchInventory();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/user');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const userData = await res.json();
      setUser(userData);
    } catch (err) {
      router.push('/login');
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      if (!res.ok) {
        throw new Error('Failed to fetch inventory');
      }
      const data = await res.json();
      setGames(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load inventory');
      setLoading(false);
    }
  };

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.userType !== 1) {
      setError('Unauthorized: Only administrators can add games');
      return;
    }

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newGame,
          Price: parseFloat(newGame.Price),
          Rating: parseInt(newGame.Rating),
          Quantity: parseInt(newGame.Quantity)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add game');
      }

      setShowAddForm(false);
      fetchInventory();
      setNewGame({
        GameName: '',
        Price: '',
        Rating: '1',
        Genre: '',
        Quantity: '0',
        Platform: ''
      });
    } catch (err) {
      setError('Failed to add game');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Inventory Management</h1>
        {user && user.userType === 1 && (
          <button 
            className={styles.addButton}
            onClick={() => setShowAddForm(true)}
          >
            Add New Game
          </button>
        )}
      </div>
      
      <div className={styles.filters}>
        <select 
          value={filter.platform}
          onChange={(e) => setFilter({...filter, platform: e.target.value})}
        >
          <option value="">All Platforms</option>
          <option value="Nintendo Switch">Nintendo Switch</option>
          <option value="Xbox Series X">Xbox Series X</option>
          <option value="PS5">PS5</option>
        </select>

        <select 
          value={filter.genre}
          onChange={(e) => setFilter({...filter, genre: e.target.value})}
        >
          <option value="">All Genres</option>
          <option value="Adventure">Adventure</option>
          <option value="FPS">FPS</option>
          <option value="Fighting">Fighting</option>
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Game Name</th>
            <th>Platform</th>
            <th>Genre</th>
            <th>Rating</th>
            <th>Quantity</th>
            <th>Price</th>
            {user && user.userType === 1 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.GameID}>
              <td>{game.GameName}</td>
              <td>{game.Platform}</td>
              <td>{game.Genre}</td>
              <td>{game.Rating}</td>
              <td>{game.Quantity}</td>
              <td>${typeof game.Price === 'number' ? game.Price.toFixed(2) : Number(game.Price).toFixed(2)}</td>
              {user && user.userType === 1 && (
                <td>
                  <button onClick={() => {}}>Edit</button>
                  <button onClick={() => {}}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showAddForm && user && user.userType === 1 && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add New Game</h2>
            <form onSubmit={handleAddGame}>
              <div className={styles.formGroup}>
                <label>Game Name:</label>
                <input
                  type="text"
                  value={newGame.GameName}
                  onChange={(e) => setNewGame({...newGame, GameName: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Platform:</label>
                <select
                  value={newGame.Platform}
                  onChange={(e) => setNewGame({...newGame, Platform: e.target.value})}
                  required
                >
                  <option value="">Select Platform</option>
                  <option value="Nintendo Switch">Nintendo Switch</option>
                  <option value="Xbox Series X">Xbox Series X</option>
                  <option value="PS5">PS5</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Price:</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newGame.Price}
                  onChange={(e) => setNewGame({...newGame, Price: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Rating:</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newGame.Rating}
                  onChange={(e) => setNewGame({...newGame, Rating: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Genre:</label>
                <select
                  value={newGame.Genre}
                  onChange={(e) => setNewGame({...newGame, Genre: e.target.value})}
                  required
                >
                  <option value="">Select Genre</option>
                  <option value="Adventure">Adventure</option>
                  <option value="FPS">FPS</option>
                  <option value="Fighting">Fighting</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Quantity:</label>
                <input
                  type="number"
                  min="0"
                  value={newGame.Quantity}
                  onChange={(e) => setNewGame({...newGame, Quantity: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit">Add Game</button>
                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 