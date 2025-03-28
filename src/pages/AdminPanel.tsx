
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Search, UserPlus, UserCheck, UserX, 
  FileText, CheckCircle, XCircle, Plus
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const MOCK_PAPERS = [
  { 
    id: 'p1', 
    title: 'Blockchain Technology in Academic Publishing', 
    author: 'John Doe', 
    status: 'Published', 
    date: '2023-04-15',
    ipfsHash: 'QmT7fzZ7X9z5'
  },
  { 
    id: 'p2', 
    title: 'Smart Contract Implementation for Research Validation', 
    author: 'Jane Smith', 
    status: 'Pending', 
    date: '2023-05-22',
  },
  { 
    id: 'p3', 
    title: 'Decentralized Storage Solutions for Scientific Data', 
    author: 'Michael Johnson', 
    status: 'Published', 
    date: '2023-03-10',
    ipfsHash: 'QmX9V5jR2Z1q'
  },
  { 
    id: 'p4', 
    title: 'Token Economics in Academic Incentive Systems', 
    author: 'Sarah Williams', 
    status: 'Rejected', 
    date: '2023-06-05',
  },
];

const MOCK_USERS = [
  { id: 'u1', username: 'john_doe', role: 'User', walletAddress: '0x12345...', lastActive: '2023-06-01' },
  { id: 'u2', username: 'jane_smith', role: 'Auditor', walletAddress: '0x67890...', lastActive: '2023-06-05' },
  { id: 'u3', username: 'admin', role: 'Admin', walletAddress: '0xabcde...', lastActive: '2023-06-07' },
  { id: 'u4', username: 'michael_j', role: 'User', walletAddress: '0xfghij...', lastActive: '2023-05-25' }
];

const AdminPanel: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('papers');
  const [searchQuery, setSearchQuery] = useState('');
  const [papers, setPapers] = useState(MOCK_PAPERS);
  const [users, setUsers] = useState(MOCK_USERS);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const approveRejectPaper = (paperId: string, action: 'approve' | 'reject') => {
    const newPapers = papers.map(paper => {
      if (paper.id === paperId) {
        return {
          ...paper,
          status: action === 'approve' ? 'Published' : 'Rejected'
        };
      }
      return paper;
    });
    
    setPapers(newPapers);
    
    toast(`Paper ${action === 'approve' ? 'approved' : 'rejected'} successfully`, {
      description: `Paper ID: ${paperId}`,
    });
  };

  const updateUserRole = (userId: string, newRole: string) => {
    const newUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, role: newRole };
      }
      return user;
    });
    
    setUsers(newUsers);
    
    toast('User role updated successfully', {
      description: `User ID: ${userId} - New role: ${newRole}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredPapers = papers.filter(paper => 
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="cnki-heading text-2xl">Admin Control Panel</h1>
        <p className="text-gray-600">Manage papers, users, and system settings</p>
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
            Papers Management
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'users'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('users')}
          >
            User Management
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

      <div className="flex justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder={`Search ${activeTab}...`}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {activeTab === 'users' && (
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        )}
      </div>

      {activeTab === 'papers' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Papers</CardTitle>
            <CardDescription>
              Review and manage submitted papers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="cnki-table">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPapers.map((paper) => (
                  <TableRow key={paper.id}>
                    <TableCell className="font-medium">{paper.id}</TableCell>
                    <TableCell>{paper.title}</TableCell>
                    <TableCell>{paper.author}</TableCell>
                    <TableCell>{getStatusBadge(paper.status)}</TableCell>
                    <TableCell>{paper.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => paper.ipfsHash && window.open(`https://ipfs.io/ipfs/${paper.ipfsHash}`, '_blank')}
                          disabled={!paper.ipfsHash}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        {paper.status.toLowerCase() === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                              onClick={() => approveRejectPaper(paper.id, 'approve')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                              onClick={() => approveRejectPaper(paper.id, 'reject')}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPapers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <h3 className="text-lg font-medium">No papers found</h3>
                      <p>Try adjusting your search criteria</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'users' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="cnki-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>
                      <Badge className={
                        user.role === 'Admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : user.role === 'Auditor' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                      }>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.walletAddress}</TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Select 
                          defaultValue={user.role}
                          onValueChange={(value) => updateUserRole(user.id, value)}
                        >
                          <SelectTrigger className="w-[110px] h-9">
                            <SelectValue placeholder="Set role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="User">User</SelectItem>
                            <SelectItem value="Auditor">Auditor</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      <UserX className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <h3 className="text-lg font-medium">No users found</h3>
                      <p>Try adjusting your search criteria</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
                <Select defaultValue="pending">
                  <SelectTrigger id="defaultPaperStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="published">Published (Auto-approve)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="auditorsRequired">Auditors Required</Label>
                <Select defaultValue="1">
                  <SelectTrigger id="auditorsRequired">
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Auditor</SelectItem>
                    <SelectItem value="2">2 Auditors</SelectItem>
                    <SelectItem value="3">3 Auditors</SelectItem>
                  </SelectContent>
                </Select>
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
