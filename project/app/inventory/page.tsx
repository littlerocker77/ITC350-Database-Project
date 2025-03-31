/**
 * Inventory Management Page
 * This component handles the display and management of video game inventory.
 * It provides functionality for viewing, adding, editing, and deleting games.
 * Admin users have additional capabilities for managing the inventory.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './inventory.module.css';
import GameForm from '../components/GameForm';
import { api } from '../services/api';
import { VideoGame, User, GameFormData, FilterState } from '../types';
import Image from 'next/image';

export default function Inventory() {
  // State management for the inventory system
  const [games, setGames] = useState<VideoGame[]>([]); // Stores all games in inventory
  const [platforms, setPlatforms] = useState<string[]>([]); // Available gaming platforms
  const [loading, setLoading] = useState(true); // Loading state indicator
  const [error, setError] = useState(''); // Error message storage
  const [user, setUser] = useState<User | null>(null); // Current user information
  const [filter, setFilter] = useState<FilterState>({ // Filter state for inventory
    platform: '',
    genre: '',
    rating: ''
  });
  
  // Form state management
  const [showAddForm, setShowAddForm] = useState(false); // Controls add game form visibility
  const [showEditForm, setShowEditForm] = useState(false); // Controls edit game form visibility
  const [editingGame, setEditingGame] = useState<VideoGame | null>(null); // Currently edited game
  const [editFormData, setEditFormData] = useState<GameFormData>({ // Form data for editing
    GameName: '',
    Price: '',
    Rating: '1',
    Genre: '',
    Quantity: '0',
    Platform: ''
  });
  const [newGame, setNewGame] = useState<GameFormData>({ // Form data for adding new game
    GameName: '',
    Price: '',
    Rating: '1',
    Genre: '',
    Quantity: '0',
    Platform: '',
    ImageUrl: ''
  });

  const router = useRouter();

  // Initial setup: check authentication and fetch data
  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  /**
   * Verifies user authentication status
   * Redirects to login if not authenticated
   */
  const checkAuth = async () => {
    try {
      const userData = await api.fetchUser();
      setUser(userData);
    } catch (err) {
      router.push('/login');
    }
  };

  /**
   * Fetches inventory and platform data from the API
   * Updates the state with the fetched data
   */
  const fetchData = async () => {
    try {
      const [inventoryData, platformsData] = await Promise.all([
        api.fetchInventory(),
        api.fetchPlatforms()
      ]);
      console.log('Fetched inventory data:', inventoryData);
      setGames(inventoryData);
      setPlatforms(platformsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  };

  /**
   * Handles the submission of a new game
   * Validates admin privileges and processes the form data
   */
  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.userType !== 1) {
      setError('Unauthorized: Only administrators can add games');
      return;
    }

    try {
      console.log('Submitting new game data:', newGame);
      await api.addGame(newGame);
      console.log('Game added successfully');
      setShowAddForm(false);
      fetchData();
      setNewGame({
        GameName: '',
        Price: '',
        Rating: '1',
        Genre: '',
        Quantity: '0',
        Platform: '',
        ImageUrl: ''
      });
    } catch (err) {
      console.error('Error adding game:', err);
      setError('Failed to add game');
    }
  };

  /**
   * Handles the update of an existing game
   * Validates admin privileges and processes the form data
   */
  const handleUpdateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.userType !== 1 || !editingGame) return;

    try {
      await api.updateGame(editingGame.GameID, editFormData);
      setShowEditForm(false);
      setEditingGame(null);
      fetchData();
    } catch (err) {
      setError('Failed to update game');
    }
  };

  /**
   * Handles the deletion of a game
   * Includes confirmation dialog and admin validation
   */
  const handleDeleteGame = async (gameId: number) => {
    if (!user || user.userType !== 1) return;

    if (!confirm('Are you sure you want to delete this game?')) {
      return;
    }

    try {
      await api.deleteGame(gameId);
      fetchData();
    } catch (err) {
      setError('Failed to delete game');
    }
  };

  /**
   * Initializes the edit form with the selected game's data
   * @param game The game to be edited
   */
  const startEdit = (game: VideoGame) => {
    setEditingGame(game);
    setEditFormData({
      ...game,
      Price: game.Price.toString(),
      Rating: game.Rating.toString(),
      Quantity: game.Quantity.toString(),
      ImageUrl: game.ImageUrl || ''
    });
    setShowEditForm(true);
  };

  /**
   * Handles form field changes for both add and edit forms
   * @param field The field being changed
   * @param value The new value
   */
  const handleFormChange = (field: keyof GameFormData, value: string) => {
    if (showEditForm) {
      setEditFormData({ ...editFormData, [field]: value });
    } else {
      setNewGame({ ...newGame, [field]: value });
    }
  };

  // Loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // Filter games based on selected criteria
  const filteredGames = games.filter(game => {
    if (filter.platform && game.Platform !== filter.platform) return false;
    if (filter.genre && game.Genre !== filter.genre) return false;
    if (filter.rating && game.Rating.toString() !== filter.rating) return false;
    return true;
  });

  // Render the inventory page
  return (
    <div className={styles.container}>
      {/* Header section with title and add button */}
      <div className={styles.header}>
        <h1>Game Inventory</h1>
        {user && user.userType === 1 && (
          <button 
            className={styles.addButton}
            onClick={() => setShowAddForm(true)}
          >
            Add New Game
          </button>
        )}
      </div>
      
      {/* Filter controls */}
      <div className={styles.filters}>
        <select 
          value={filter.platform}
          onChange={(e) => setFilter({...filter, platform: e.target.value})}
        >
          <option value="">All Platforms</option>
          {platforms.map((platform) => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
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

      {/* Game grid display */}
      <div className={styles.gameGrid}>
        {filteredGames.map((game) => (
          <div key={game.GameID} className={styles.gameCard}>
            {/* Game image section */}
            <div className={styles.gameImage}>
              {game.ImageUrl ? (
                <Image
                  src={game.ImageUrl}
                  alt={game.GameName}
                  width={300}
                  height={200}
                  className={styles.image}
                  priority
                />
              ) : (
                <div className={styles.placeholderImage}>
                  <span>No Image</span>
                </div>
              )}
            </div>
            {/* Game information section */}
            <div className={styles.gameInfo}>
              <h3>{game.GameName}</h3>
              <div className={styles.gameDetails}>
                <span className={styles.platform}>{game.Platform}</span>
                <span className={styles.genre}>{game.Genre}</span>
                <span className={styles.rating}>★ {game.Rating}</span>
              </div>
              <div className={styles.gamePrice}>
                <span className={styles.price}>${typeof game.Price === 'number' ? game.Price.toFixed(2) : Number(game.Price).toFixed(2)}</span>
                <span className={styles.quantity}>In Stock: {game.Quantity}</span>
              </div>
              {/* Admin actions */}
              {user && user.userType === 1 && (
                <div className={styles.adminActions}>
                  <button 
                    onClick={() => startEdit(game)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteGame(game.GameID)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add game modal */}
      {showAddForm && user && user.userType === 1 && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add New Game</h2>
            <GameForm
              game={newGame}
              platforms={platforms}
              onSubmit={handleAddGame}
              onCancel={() => setShowAddForm(false)}
              submitLabel="Add Game"
              onChange={handleFormChange}
            />
          </div>
        </div>
      )}

      {/* Edit game modal */}
      {showEditForm && user && user.userType === 1 && editingGame && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Game</h2>
            <GameForm
              game={editFormData}
              platforms={platforms}
              onSubmit={handleUpdateGame}
              onCancel={() => setShowEditForm(false)}
              submitLabel="Update Game"
              onChange={handleFormChange}
            />
          </div>
        </div>
      )}
    </div>
  );
} 