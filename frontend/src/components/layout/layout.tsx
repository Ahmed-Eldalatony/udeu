import React from 'react';
import { Navbar } from './navbar';
import { Footer } from './footer';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  onSearch?: (query: string) => void;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  cartItemCount?: number;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showNavbar = true,
  showFooter = true,
  onSearch,
  user,
  cartItemCount,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && (
        <Navbar
          onSearch={onSearch}
          user={user}
          cartItemCount={cartItemCount}
        />
      )}

      <main className="flex-1">
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
};