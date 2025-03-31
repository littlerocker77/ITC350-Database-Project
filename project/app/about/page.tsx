'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './about.module.css';

interface User {
  id: number;
  username: string;
  userType: number;
}

export default function About() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
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
      setNewUsername(userData.username);
    } catch (err) {
      router.push('/login');
    }
  };

  const handleUpdateUsername = async () => {
    if (!user || !newUsername.trim()) return;

    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id,
          username: newUsername.trim()
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update username');
      }

      setSuccess('Username updated successfully');
      setIsEditingUsername(false);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update username');
      setSuccess('');
    }
  };

  const handleUpdatePassword = async () => {
    if (!user || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id,
          password: newPassword
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update password');
      }

      setSuccess('Password updated successfully');
      setIsEditingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
      setSuccess('');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>User Profile</h1>
      
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.profileSection}>
        <div className={styles.field}>
          <label>Username:</label>
          <div className={styles.fieldContent}>
            {isEditingUsername ? (
              <>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className={styles.input}
                />
                <button 
                  onClick={handleUpdateUsername}
                  className={styles.saveButton}
                >
                  Save
                </button>
                <button 
                  onClick={() => {
                    setIsEditingUsername(false);
                    setNewUsername(user.username);
                    setError('');
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{user.username}</span>
                <button 
                  onClick={() => setIsEditingUsername(true)}
                  className={styles.editButton}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label>Password:</label>
          <div className={styles.fieldContent}>
            {isEditingPassword ? (
              <>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className={styles.input}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className={styles.input}
                />
                <button 
                  onClick={handleUpdatePassword}
                  className={styles.saveButton}
                >
                  Save
                </button>
                <button 
                  onClick={() => {
                    setIsEditingPassword(false);
                    setNewPassword('');
                    setConfirmPassword('');
                    setError('');
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>••••••••</span>
                <button 
                  onClick={() => setIsEditingPassword(true)}
                  className={styles.editButton}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label>User Type:</label>
          <span>{user.userType === 1 ? 'Administrator' : 'Regular User'}</span>
        </div>
      </div>
    </div>
  );
} 