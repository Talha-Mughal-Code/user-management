import { Suspense } from 'react';
import UsersListClient from './UsersListClient';
import { authApi } from '@/lib/api';
import { User } from '@/lib/types';

async function getUsers(): Promise<User[]> {
  try {
    return await authApi.getAllUsers();
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

export default async function UsersPage() {
  const initialUsers = await getUsers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Users Directory</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage and view all registered users
          </p>
        </div>

        <Suspense fallback={<UsersListSkeleton />}>
          <UsersListClient initialUsers={initialUsers} />
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

