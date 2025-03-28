
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import AuditorManagement from '@/components/AuditorManagement';
import PendingPapersReview from '@/components/PendingPapersReview';

const AdminPanel: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('papers');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/dashboard');
      toast.error("You don't have access to the Admin Panel");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="cnki-heading text-2xl">Admin Control Panel</h1>
        <p className="text-gray-600">Manage papers, auditors, and system settings</p>
      </div>

      <div className="flex mb-6">
        <div className="flex space-x-2 border-b border-gray-200 w-full">
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'papers'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('papers')}
          >
            Papers Review
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'auditors'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('auditors')}
          >
            Auditor Management
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'settings'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            System Settings
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder={`Search ${activeTab}...`}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {activeTab === 'papers' && (
        <PendingPapersReview />
      )}

      {activeTab === 'auditors' && (
        <AuditorManagement />
      )}

      {activeTab === 'settings' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
              Configure system-wide settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="defaultPaperStatus">Default Paper Status</Label>
                <Input 
                  id="defaultPaperStatus" 
                  defaultValue="Pending"
                  disabled
                />
                <p className="text-xs text-gray-500">
                  This is controlled by the smart contract and cannot be changed
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ipfsGateway">IPFS Gateway URL</Label>
                <Input 
                  id="ipfsGateway" 
                  defaultValue="https://ipfs.io/ipfs/" 
                  placeholder="Enter IPFS gateway URL" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contractAddress">Smart Contract Address</Label>
                <Input 
                  id="contractAddress" 
                  defaultValue="0x1fDd9b748d0A341CCEb2336D979ffaBcE369e71D" 
                  placeholder="Enter contract address" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint">Backend API Endpoint</Label>
                <Input 
                  id="apiEndpoint" 
                  defaultValue="http://localhost:3002" 
                  placeholder="Enter API endpoint" 
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default AdminPanel;
