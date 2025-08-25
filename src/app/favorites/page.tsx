"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function FavoritesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/?showLogin=true');
      return;
    }

    // Redirect to appropriate dashboard favorites section
    if (user?.role === 'customer') {
      router.push('/dashboard/customer?tab=favorites');
    } else if (user?.role === 'artisan') {
      router.push('/dashboard/artisan?tab=favorites');
    } else if (user?.role === 'admin') {
      router.push('/dashboard/admin?tab=favorites');
    } else {
      // Fallback to customer dashboard
      router.push('/dashboard/customer?tab=favorites');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
        <p className="text-white">Redirecting to favorites...</p>
      </div>
    </div>
  );
}

