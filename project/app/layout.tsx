/**
 * Root Layout Component
 * This is the main layout component that wraps all pages in the application.
 * It provides the basic HTML structure, font configuration, and navigation.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';

// Initialize Inter font from Google Fonts with Latin subset
const inter = Inter({ subsets: ['latin'] });

// Define metadata for the application
export const metadata: Metadata = {
  title: 'P Triple E Games',
  description: 'Inventory Management System',
};

/**
 * RootLayout Component
 * Provides the base layout structure for all pages in the application.
 * 
 * Features:
 * - HTML language set to English
 * - Inter font applied to all text
 * - Navigation bar at the top
 * - Main content area that flexibly grows to fill available space
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render within the layout
 * @returns {JSX.Element} The root layout structure
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
} 