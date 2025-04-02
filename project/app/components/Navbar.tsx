/**
 * Navigation Bar Component
 * A responsive navigation bar that provides access to different sections
 * of the application and handles user logout functionality.
 */

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

/**
 * Navbar Component
 * Provides navigation links and logout functionality for the application.
 * 
 * Features:
 * - Responsive navigation links
 * - Active link highlighting
 * - Secure logout handling
 * - Automatic redirection after logout
 * 
 * @returns {JSX.Element} The navigation bar component
 */
export default function Navbar() {
  // Get current path and router for navigation
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Checks if a given path matches the current active route
   * @param {string} path - The path to check
   * @returns {boolean} True if the path matches the current route
   */
  const isActive = (path: string) => pathname === path;

  /**
   * Handles the logout process by calling the logout API endpoint
   * and redirecting to the login page upon success.
   */
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
        {/* Application logo/brand */}
        <Link href="/inventory" className={styles.logo}>
          P Triple E Games
        </Link>
        
        {/* Navigation links */}
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