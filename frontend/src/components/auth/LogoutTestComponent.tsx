import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import { useLogoutWithNavigation } from '@/lib/logoutService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const LogoutTestComponent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { items: cartItems, totalItems } = useCart();
  const { isLoading: appLoading, settings } = useGlobalState();
  const { logout } = useLogoutWithNavigation();

  const handleTestLogout = () => {
    console.log('=== LOGOUT TEST STARTED ===');
    console.log('Current state before logout:');
    console.log('- User authenticated:', isAuthenticated);
    console.log('- User data:', user);
    console.log('- Cart items count:', totalItems);
    console.log('- Cart items:', cartItems);
    console.log('- App loading:', appLoading);
    console.log('- App settings:', settings);
    console.log('- localStorage keys:', Object.keys(localStorage));
    console.log('- access_token in localStorage:', !!localStorage.getItem('access_token'));

    logout();
  };

  const handleCheckStorage = () => {
    console.log('=== STORAGE CHECK ===');
    console.log('localStorage contents:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key!);
      console.log(`${key}:`, value);
    }
    console.log('sessionStorage contents:');
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key!);
      console.log(`${key}:`, value);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Logout Test Component</CardTitle>
          <CardDescription>You need to be logged in to test logout functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Please log in first to test the logout functionality.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🔐 Logout Test Component</CardTitle>
        <CardDescription>
          Test the comprehensive logout functionality across all contexts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded">
            <h4 className="font-semibold text-blue-800">Auth Status</h4>
            <p className="text-sm text-blue-600">
              Authenticated: {isAuthenticated ? '✅' : '❌'}
            </p>
            {user && (
              <p className="text-sm text-blue-600">
                User: {user.firstName} {user.lastName}
              </p>
            )}
          </div>

          <div className="p-3 bg-green-50 rounded">
            <h4 className="font-semibold text-green-800">Cart Status</h4>
            <p className="text-sm text-green-600">
              Items in cart: {totalItems}
            </p>
          </div>

          <div className="p-3 bg-purple-50 rounded">
            <h4 className="font-semibold text-purple-800">App State</h4>
            <p className="text-sm text-purple-600">
              Loading: {appLoading ? '⏳' : '✅'}
            </p>
            <p className="text-sm text-purple-600">
              Theme: {settings.theme}
            </p>
          </div>

          <div className="p-3 bg-orange-50 rounded">
            <h4 className="font-semibold text-orange-800">Storage</h4>
            <p className="text-sm text-orange-600">
              Token: {localStorage.getItem('access_token') ? '✅' : '❌'}
            </p>
            <p className="text-sm text-orange-600">
              Cart: {localStorage.getItem('course_cart') ? '✅' : '❌'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCheckStorage}
            variant="outline"
            size="sm"
          >
            Check Storage
          </Button>
          <Button
            onClick={handleTestLogout}
            variant="destructive"
            size="sm"
          >
            Test Logout
          </Button>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Check the current state using the status cards above</li>
            <li>Click "Check Storage" to see what's in localStorage</li>
            <li>Click "Test Logout" to perform comprehensive logout</li>
            <li>Verify that all contexts are cleared and you're redirected to login</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};