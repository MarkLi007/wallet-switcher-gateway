
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';
import { Book, Lock, ShieldCheck, Globe } from 'lucide-react';
import WalletButton from '@/components/WalletButton';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-3">
        <div className="cnki-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Book className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold text-gray-800">Thesis Gateway</span>
            </div>
            <WalletButton />
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center py-10 px-4">
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
          <div className="flex flex-col justify-center order-2 md:order-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Academic Research Gateway
            </h1>
            <p className="text-gray-600 mb-6">
              A secure platform for submitting, reviewing, and accessing academic papers
              and research with blockchain-based wallet authentication.
            </p>
            
            <div className="space-y-5 mt-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Secure Authentication</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Authenticate securely with wallet integration and role-based access control.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-md bg-green-100 flex items-center justify-center mr-3">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Administrator Controls</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comprehensive admin panel for managing submissions, users, and system settings.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-md bg-purple-100 flex items-center justify-center mr-3">
                  <Globe className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Research Management</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Submit, track, and access research papers through an intuitive interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <LoginForm />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="cnki-container">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Thesis Gateway. All rights reserved.</p>
            <p className="mt-2">Inspired by CNKI (China National Knowledge Infrastructure)</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
