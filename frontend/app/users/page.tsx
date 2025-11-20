'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UsersListClient from './UsersListClient';
import { useAuth } from '@/lib/contexts';
import { Button } from '@/components/ui';

export default function UsersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Users Directory</h1>
              <p className="mt-2 text-lg text-gray-600">
                Welcome, {user?.name}! Manage and view all registered users
              </p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Suspense fallback={<UsersListSkeleton />}>
          <UsersListClient />
        </Suspense>
      </div>
    </div>
  );
}

function UsersListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-gray-300 h-12 w-12" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

