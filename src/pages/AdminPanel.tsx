
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, Search, Download, CheckCircle, XCircle, AlertCircle, FileText, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

// Mock data for demonstration
const MOCK_PAPERS = [
  { 
    id: 'p1', 
    title: 'Advances in Neural Networks', 
    author: 'Zhang Wei', 
    date: '2023-05-12', 
    status: 'published',
    category: 'Computer Science',
    downloads: 124,
    citations: 23
  },
  { 
    id: 'p2', 
    title: 'Blockchain Security Analysis', 
    author: 'Li Juan', 
    date: '2023-08-21', 
    status: 'pending',
    category: 'Information Security',
    downloads: 0,
    citations: 0
  },
  { 
    id: 'p3', 
    title: 'Quantum Computing Applications', 
    author: 'Wang Chen', 
    date: '2023-11-03', 
    status: 'approved',
    category: 'Physics',
    downloads: 45,
    citations: 5
  },
  { 
    id: 'p4', 
    title: 'Smart Contract Vulnerabilities', 
    author: 'Liu Yang', 
    date: '2024-01-15', 
    status: 'review',
    category: 'Blockchain',
    downloads: 0,
    citations: 0
  },
  { 
    id: 'p5', 
    title: 'Machine Learning for Medical Diagnosis', 
    author: 'Huang Mei', 
    date: '2024-02-02', 
    status: 'pending',
    category: 'Healthcare',
    downloads: 0,
    citations: 0
  },
  { 
    id: 'p6', 
    title: 'Cybersecurity in IoT Networks', 
    author: 'Zhao Feng', 
    date: '2024-02-18', 
    status: 'rejected',
    category: 'Network Security',
    downloads: 0,
    citations: 0
  },
  { 
    id: 'p7', 
    title: 'Natural Language Processing Advances', 
    author: 'Chen Ling', 
    date: '2024-03-05', 
    status: 'review',
    category: 'Artificial Intelligence',
    downloads: 18,
    citations: 0
  }
];

const MOCK_USERS = [
  { 
    id: 'u1', 
    username: 'admin', 
    name: 'Admin User', 
    role: 'Administrator', 
    papers: 3, 
    joined: '2022-01-15',
    status: 'active'
  },
  { 
    id: 'u2', 
    username: 'user', 
    name: 'Regular User', 
    role: 'User', 
    papers: 2, 
    joined: '2022-03-22',
    status: 'active'
  },
  { 
    id: 'u3', 
    username: 'zhang_wei', 
    name: 'Zhang Wei', 
    role: 'Researcher', 
    papers: 5, 
    joined: '2022-05-11',
    status: 'active'
  },
  { 
    id: 'u4', 
    username: 'li_juan', 
    name: 'Li Juan', 
    role: 'Reviewer', 
    papers: 1, 
    joined: '2022-07-08',
    status: 'active'
  },
  { 
    id: 'u5', 
    username: 'wang_chen', 
    name: 'Wang Chen', 
    role: 'Researcher', 
    papers: 4, 
    joined: '2022-09-14',
    status: 'inactive'
  }
];

const statusColors: Record<string, string> = {
  published: 'bg-green-100 text-green-800',
  approved: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  review: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800'
};

const AdminPanel: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [papers, setPapers] = useState(MOCK_PAPERS);
  const [users, setUsers] = useState(MOCK_USERS);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleApprove = (paperId: string) => {
    setPapers(
      papers.map((paper) =>
        paper.id === paperId ? { ...paper, status: 'approved' } : paper
      )
    );
    toast.success('Paper has been approved');
  };

  const handleReject = (paperId: string) => {
    setPapers(
      papers.map((paper) =>
        paper.id === paperId ? { ...paper, status: 'rejected' } : paper
      )
    );
    toast.success('Paper has been rejected');
  };

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          paper.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || paper.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           user.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="cnki-container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage submissions, users, and system settings</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                Total Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">78</div>
              <div className="text-sm text-muted-foreground">
                12 pending review
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-500" />
                Registered Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">215</div>
              <div className="text-sm text-muted-foreground">
                42 new this month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Download className="h-5 w-5 mr-2 text-green-500" />
                Total Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,432</div>
              <div className="text-sm text-muted-foreground">
                +256 from last month
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="papers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="papers">Paper Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="papers" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search papers..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2 min-w-[200px]">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <table className="cnki-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Submission Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPapers.length > 0 ? (
                      filteredPapers.map((paper) => (
                        <tr key={paper.id}>
                          <td className="font-medium">{paper.title}</td>
                          <td>{paper.author}</td>
                          <td>{paper.category}</td>
                          <td>{paper.date}</td>
                          <td>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[paper.status]}`}>
                              {paper.status.charAt(0).toUpperCase() + paper.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => toast.info(`Viewing details for ${paper.title}`)}
                              >
                                Details
                              </Button>
                              
                              {paper.status === 'pending' || paper.status === 'review' ? (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
                                    onClick={() => handleApprove(paper.id)}
                                  >
                                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                    Approve
                                  </Button>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => handleReject(paper.id)}
                                  >
                                    <XCircle className="h-3.5 w-3.5 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-gray-500">
                          No papers found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <table className="cnki-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Papers</th>
                      <th>Join Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="font-medium">{user.username}</td>
                          <td>{user.name}</td>
                          <td>
                            <Badge variant={user.role === 'Administrator' ? 'destructive' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td>{user.papers}</td>
                          <td>{user.joined}</td>
                          <td>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => toast.info(`Viewing details for ${user.name}`)}
                              >
                                Details
                              </Button>
                              
                              {user.status === 'active' ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 px-2 text-gray-600"
                                  onClick={() => {
                                    setUsers(
                                      users.map((u) =>
                                        u.id === user.id ? { ...u, status: 'inactive' } : u
                                      )
                                    );
                                    toast.success(`${user.name} has been deactivated`);
                                  }}
                                >
                                  Deactivate
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 px-2 text-green-600"
                                  onClick={() => {
                                    setUsers(
                                      users.map((u) =>
                                        u.id === user.id ? { ...u, status: 'active' } : u
                                      )
                                    );
                                    toast.success(`${user.name} has been activated`);
                                  }}
                                >
                                  Activate
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-gray-500">
                          No users found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure global system settings and policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="max-upload-size">Maximum Upload Size (MB)</Label>
                    <Input id="max-upload-size" type="number" defaultValue={50} />
                    <p className="text-xs text-muted-foreground">
                      Maximum file size for paper uploads
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="auto-approve">Auto-Approve Submissions</Label>
                    <Select defaultValue="no">
                      <SelectTrigger id="auto-approve">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Automatically approve submissions without review
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="min-reviewers">Minimum Reviewers</Label>
                    <Input id="min-reviewers" type="number" defaultValue={2} />
                    <p className="text-xs text-muted-foreground">
                      Minimum number of reviewers required per paper
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="email-notifications">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="important">Important Only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Configure system-wide email notification settings
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button
                    onClick={() => toast.success('Settings saved successfully')}
                  >
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-amber-500" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security and access policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password-policy">Password Policy</Label>
                    <Select defaultValue="strong">
                      <SelectTrigger id="password-policy">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="strong">Strong</SelectItem>
                        <SelectItem value="very-strong">Very Strong</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Set password strength requirements
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input id="session-timeout" type="number" defaultValue={30} />
                    <p className="text-xs text-muted-foreground">
                      Time until inactive sessions are logged out
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <Select defaultValue="optional">
                      <SelectTrigger id="two-factor">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="required">Required for All</SelectItem>
                        <SelectItem value="admin-only">Required for Admins</SelectItem>
                        <SelectItem value="optional">Optional</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Configure two-factor authentication policy
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-attempts">Max Login Attempts</Label>
                    <Input id="login-attempts" type="number" defaultValue={5} />
                    <p className="text-xs text-muted-foreground">
                      Maximum failed login attempts before lockout
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button
                    onClick={() => toast.success('Security settings saved successfully')}
                  >
                    Save Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
