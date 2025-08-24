import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/hooks/useApp';
import { Button } from './button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './sheet';
import {
  Menu,
  Home,
  BookOpen,
  User,
  ShoppingCart,
  LogIn,
  UserPlus,
  Settings,
  LogOut
} from 'lucide-react';

interface MobileMenuProps {
  onSearch?: (query: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    user,
    logout,
    cartTotalItems,
    isLoggedIn,
    isInstructor
  } = useApp();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            UdemyClone
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="space-y-2">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button type="submit" size="sm" className="w-full">
              Search
            </Button>
          </form>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/courses"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>Courses</span>
            </Link>

            {isLoggedIn && (
              <Link
                to="/dashboard"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            )}

            {isInstructor && (
              <Link
                to="/instructor-dashboard"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Instructor Dashboard</span>
              </Link>
            )}

            <Link
              to="/cart"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartTotalItems}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>
          </nav>

          {/* User Authentication */}
          <div className="pt-4 border-t border-gray-200">
            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="px-3 py-2 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    handleLinkClick();
                  }}
                  className="w-full flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={handleLinkClick}>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Log In
                  </Button>
                </Link>

                <Link to="/register" onClick={handleLinkClick}>
                  <Button className="w-full flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};