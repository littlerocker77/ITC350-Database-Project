/**
 * Type Definitions
 * This file contains all the TypeScript interfaces used throughout the application.
 */

/**
 * Represents a video game in the inventory system
 */
export interface VideoGame {
  GameID: number;           // Unique identifier for the game
  GameName: string;         // Name of the game
  Price: number;           // Price of the game (stored as decimal)
  Rating: number;          // Rating from 1-5
  Genre: string;           // Game genre (e.g., Adventure, FPS, Fighting)
  Quantity: number;        // Number of copies in stock
  Platform: string;        // Gaming platform (e.g., PS5, Xbox, Switch)
  ImageUrl?: string;       // Optional URL to the game's image
}

/**
 * Represents a user in the system
 */
export interface User {
  UserID: number;          // Unique identifier for the user
  UserName: string;        // Username for login
  UserType: number;        // 0 for Warehouse Staff, 1 for Retailers
}

/**
 * Represents the form data for adding or editing a game
 */
export interface GameFormData {
  GameName: string;        // Name of the game
  Platform: string;        // Gaming platform
  Price: string;          // Price as string (for form input)
  Rating: string;         // Rating as string (for form input)
  Genre: string;          // Game genre
  Quantity: string;       // Quantity as string (for form input)
  ImageUrl?: string;      // Optional URL to the game's image
}

/**
 * Represents the filter state for the inventory view
 */
export interface FilterState {
  platform: string;       // Selected platform filter
  genre: string;         // Selected genre filter
  rating: string;        // Selected rating filter
} 