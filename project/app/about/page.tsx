'use client';

import { useState, useEffect } from 'react';
import styles from './about.module.css';

interface UserInfo {
  UserID: number;
  UserName: string;
  UserType: number;
}

export default function About() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch('/api/user/info');
      if (!res.ok) {
        throw new Error('Failed to fetch user info');
      }
      const data = await res.json();
      setUserInfo(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load user information');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!userInfo) return <div>No user information available</div>;

  return (
    <div className={styles.container}>
      <h1>About</h1>
      <div className={styles.userInfo}>
        <h2>User Information</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <label>Username:</label>
            <span>{userInfo.UserName}</span>
          </div>
          <div className={styles.infoItem}>
            <label>Role:</label>
            <span>{userInfo.UserType === 0 ? 'Warehouse Staff' : 'Retailer'}</span>
          </div>
          <div className={styles.infoItem}>
            <label>User ID:</label>
            <span>{userInfo.UserID}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 