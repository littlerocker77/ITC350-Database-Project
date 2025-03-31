'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/inventory" className={styles.logo}>
          P Triple E Games
        </Link>
        <div className={styles.links}>
          <Link 
            href="/inventory" 
            className={`${styles.link} ${isActive('/inventory') ? styles.active : ''}`}
          >
            Inventory
          </Link>
          <Link 
            href="/about" 
            className={`${styles.link} ${isActive('/about') ? styles.active : ''}`}
          >
            Profile
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
} 