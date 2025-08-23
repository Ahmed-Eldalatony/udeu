import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useLogoutWithNavigation } from '@/lib/logoutService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileMenu } from '@/components/ui/mobile-menu';
import { Search, User, BookOpen, ShoppingCart } from 'lucide-react';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearch,
}) => {
  const { user, isLoading } = useAuth();
  const { totalItems } = useCart();
  const { logout } = useLogoutWithNavigation();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">UdemyClone</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </form>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <MobileMenu onSearch={onSearch} />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            {/* Categories */}
            <Link to="/courses" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">
              Categories
            </Link>

            {/* Shopping Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-gray-900" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Authentication */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {user.firstName}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Navigation - Hidden on mobile */}
      <div className="hidden md:block bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 py-2 text-sm">
            <Link to="/courses" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
              All Courses
            </Link>
            <Link to="/instructor-dashboard" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
              Teach on UdemyClone
            </Link>
            <Link to="/business" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
              UdemyClone Business
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};