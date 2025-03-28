
import React from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className={cn(
        "flex-1 py-8 px-4 sm:px-6 lg:px-8", 
        "cnki-container",
        className
      )}>
        {children}
      </div>
      
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

export default DashboardLayout;
