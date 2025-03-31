export interface VideoGame {
  GameID: number;
  GameName: string;
  Platform: string;
  Rating: number;
  Genre: string;
  Quantity: number;
  Price: number;
  ImageUrl?: string;
}

export interface User {
  id: number;
  username: string;
  userType: number;
}

export interface GameFormData {
  GameName: string;
  Price: string;
  Rating: string;
  Genre: string;
  Quantity: string;
  Platform: string;
  ImageUrl?: string;
}

export interface FilterState {
  platform: string;
  genre: string;
  rating: string;
} 