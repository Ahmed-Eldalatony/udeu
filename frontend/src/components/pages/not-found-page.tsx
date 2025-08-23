import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../layout/layout';
import { Button } from '../ui/button';

export const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="text-9xl font-bold text-gray-300">404</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for. The page may have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="space-y-4">
            <Link to="/">
              <Button size="lg" className="w-full">
                Go to Homepage
              </Button>
            </Link>

            <Link to="/courses">
              <Button variant="outline" size="lg" className="w-full">
                Browse Courses
              </Button>
            </Link>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Need help? <a href="#" className="text-blue-600 hover:text-blue-500">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};