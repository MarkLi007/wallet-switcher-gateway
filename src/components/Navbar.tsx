
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Book, LogOut, User, Shield } from 'lucide-react';
import EnhancedWalletButton from './EnhancedWalletButton';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3">
      <div className="cnki-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Book className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold text-gray-800">Thesis Gateway</span>
            </Link>
            
            {isAuthenticated && (
              <nav className="hidden md:flex space-x-4 ml-6">
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-primary font-medium text-sm"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-600 hover:text-primary font-medium text-sm"
                  >
                    Admin Panel
                  </Link>
                )}
              </nav>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <EnhancedWalletButton />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-600 hidden md:block">
                  <span className="mr-1">Hello,</span>
                  <span className="font-medium">{user?.username}</span>
                  {isAdmin && (
                    <span className="ml-1 text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                      Admin
                    </span>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-gray-600"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
              >
                <User className="h-4 w-4 mr-1" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
