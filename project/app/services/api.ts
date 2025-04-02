/**
 * API Service Module
 * This module provides a centralized interface for all API calls to the backend.
 * It handles data transformation, error handling, and authentication for all API requests.
 */

import { VideoGame, GameFormData } from '../types/types';

// Base URL for all API endpoints
const API_BASE = '/api';

/**
 * API Service Object
 * Contains methods for all API interactions including:
 * - Fetching inventory and platform data
 * - User authentication
 * - CRUD operations for games
 * - Image upload functionality
 */
export const api = {
  /**
   * Fetches the complete inventory of games
   * @returns Promise<VideoGame[]> Array of video games
   * @throws Error if the request fails
   */
  async fetchInventory() {
    const res = await fetch(`${API_BASE}/inventory`);
    if (!res.ok) throw new Error('Failed to fetch inventory');
    return res.json();
  },

  /**
   * Fetches all available gaming platforms
   * @returns Promise<string[]> Array of platform names
   * @throws Error if the request fails
   */
  async fetchPlatforms() {
    const res = await fetch(`${API_BASE}/platforms`);
    if (!res.ok) throw new Error('Failed to fetch platforms');
    return res.json();
  },

  /**
   * Fetches the current user's information
   * @returns Promise<User> User object containing id, username, and userType
   * @throws Error if the request fails
   */
  async fetchUser() {
    const res = await fetch(`${API_BASE}/auth/user`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  /**
   * Adds a new game to the inventory
   * @param game GameFormData object containing the new game's information
   * @returns Promise containing the result of the operation
   * @throws Error if the request fails
   */
  async addGame(game: GameFormData) {
    console.log('API: Preparing to add game with data:', game);
    // Transform form data into the format expected by the API
    const gameData = {
      ...game,
      Price: parseFloat(game.Price),
      Rating: parseInt(game.Rating),
      Quantity: parseInt(game.Quantity),
      ImageUrl: game.ImageUrl || null
    };
    console.log('API: Sending processed game data:', gameData);
    
    const res = await fetch(`${API_BASE}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error('API: Failed to add game:', errorData);
      throw new Error(errorData.error || 'Failed to add game');
    }
    
    const result = await res.json();
    console.log('API: Game added successfully:', result);
    return result;
  },

  /**
   * Updates an existing game in the inventory
   * @param id The ID of the game to update
   * @param data GameFormData object containing the updated game information
   * @returns Promise containing the result of the operation
   * @throws Error if the request fails
   */
  async updateGame(id: number, data: GameFormData) {
    console.log('API: Preparing to update game with data:', data);
    // Transform form data into the format expected by the API
    const gameData = {
      ...data,
      Price: parseFloat(data.Price),
      Rating: parseInt(data.Rating),
      Quantity: parseInt(data.Quantity),
      ImageUrl: data.ImageUrl || null
    };
    console.log('API: Sending processed game data:', gameData);

    const response = await fetch(`${API_BASE}/inventory/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API: Failed to update game:', errorData);
      throw new Error(errorData.error || 'Failed to update game');
    }

    const result = await response.json();
    console.log('API: Game updated successfully:', result);
    return result;
  },

  /**
   * Deletes a game from the inventory
   * @param gameId The ID of the game to delete
   * @returns Promise containing the result of the operation
   * @throws Error if the request fails
   */
  async deleteGame(gameId: number) {
    const res = await fetch(`${API_BASE}/inventory/${gameId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete game');
    return res.json();
  },

  /**
   * Uploads an image file to the server
   * @param file The image file to upload
   * @returns Promise<string> URL of the uploaded image
   * @throws Error if the upload fails
   */
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    console.log('Sending image upload request...');
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Upload failed:', errorData);
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const data = await response.json();
    console.log('Upload response:', data);
    return data.url;
  },
}; 