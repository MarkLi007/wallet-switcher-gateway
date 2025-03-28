
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, FileText, Settings } from "lucide-react";
import WalletConnect from "./WalletConnect";

const EnhancedNavbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="cnki-container flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <FileText className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-lg">ThesisGateway</span>
          </Link>
          
          <nav className="hidden md:flex space-x-4">
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/submit-paper" 
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Submit Paper
            </Link>
            <Link 
              to="/add-version" 
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Add Version
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-purple-600 hover:text-purple-700 px-3 py-2 text-sm font-medium"
              >
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <WalletConnect />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" alt={user?.username || "User"} />
                    <AvatarFallback>
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.username || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.role || "user"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost" 
              onClick={() => navigate("/login")}
              className="text-sm"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default EnhancedNavbar;
