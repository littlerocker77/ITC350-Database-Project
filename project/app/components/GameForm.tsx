import { GameFormData } from '../types';
import styles from './GameForm.module.css';
import Image from 'next/image';
import { useState } from 'react';
import { api } from '../services/api';

interface GameFormProps {
  game: GameFormData;
  platforms: string[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  onChange: (field: keyof GameFormData, value: string) => void;
}

export default function GameForm({
  game,
  platforms,
  onSubmit,
  onCancel,
  submitLabel,
  onChange
}: GameFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(game.ImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      onChange('ImageUrl', '');
      return;
    }

    try {
      setIsUploading(true);
      console.log('Starting image upload for file:', file.name);
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload the image
      const imageUrl = await api.uploadImage(file);
      console.log('Image uploaded successfully, URL:', imageUrl);
      
      // Update the form data with the new image URL
      onChange('ImageUrl', imageUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
      setPreviewUrl(null);
      onChange('ImageUrl', '');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onChange('ImageUrl', '');
  };

  return (
    <form onSubmit={onSubmit}>
      <div className={styles.formGroup}>
        <label>Game Name:</label>
        <input
          type="text"
          value={game.GameName}
          onChange={(e) => onChange('GameName', e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Platform:</label>
        <select
          value={game.Platform}
          onChange={(e) => onChange('Platform', e.target.value)}
          required
        >
          <option value="">Select Platform</option>
          {platforms.map((platform) => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Price:</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={game.Price}
          onChange={(e) => onChange('Price', e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Rating:</label>
        <input
          type="number"
          min="1"
          max="5"
          value={game.Rating}
          onChange={(e) => onChange('Rating', e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Genre:</label>
        <select
          value={game.Genre}
          onChange={(e) => onChange('Genre', e.target.value)}
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
          value={game.Quantity}
          onChange={(e) => onChange('Quantity', e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Game Image (Optional):</label>
        <div className={styles.imageUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
            disabled={isUploading}
          />
          {isUploading && <div className={styles.uploading}>Uploading...</div>}
          {previewUrl && (
            <div className={styles.imagePreviewContainer}>
              <Image
                src={previewUrl}
                alt="Game preview"
                width={200}
                height={120}
                className={styles.preview}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className={styles.removeImage}
              >
                Remove Image
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="submit">{submitLabel}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
} 