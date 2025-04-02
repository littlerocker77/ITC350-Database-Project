/**
 * Home Page Component
 * This is the root page component that automatically redirects users
 * to the login page. It serves as the entry point of the application.
 */

import { redirect } from 'next/navigation';

/**
 * Home Component
 * A simple component that immediately redirects users to the login page.
 * This ensures that users must authenticate before accessing any part
 * of the application.
 * 
 * @returns {never} This function never returns as it always redirects
 */
export default function Home() {
  redirect('/login');
} 