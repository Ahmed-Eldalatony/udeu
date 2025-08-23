import React from 'react';
import { AdminDashboard } from '../admin/admin-dashboard';
import { useAuth } from '../../contexts/AuthContext';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();

  // Simple role check - in a real app, you'd have proper role-based access control
  const isAdmin = user?.role === 'admin' || user?.role === 'instructor';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};