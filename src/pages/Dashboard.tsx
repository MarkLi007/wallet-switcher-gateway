
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Library, Clock, Star, BarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Dashboard: React.FC = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="cnki-container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          
          {isAdmin && (
            <Button 
              onClick={() => navigate('/admin')}
              className="flex items-center"
            >
              <BarChart className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                My Documents
              </CardTitle>
              <CardDescription>Your submitted papers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <div className="text-sm text-muted-foreground">
                2 pending review
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-500" />
                Recent Activity
              </CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">
                4 reviews, 8 downloads
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Citations
              </CardTitle>
              <CardDescription>Total citations received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">37</div>
              <div className="text-sm text-muted-foreground">
                +5 from last month
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="papers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="papers">Recent Papers</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="papers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Recent Papers</CardTitle>
                <CardDescription>
                  Papers you've submitted or collaborated on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <table className="cnki-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Citations</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-medium">Advances in Neural Networks</td>
                      <td>2023-05-12</td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      </td>
                      <td>23</td>
                    </tr>
                    <tr>
                      <td className="font-medium">Blockchain Security Analysis</td>
                      <td>2023-08-21</td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Under Review
                        </span>
                      </td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td className="font-medium">Quantum Computing Applications</td>
                      <td>2023-11-03</td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Accepted
                        </span>
                      </td>
                      <td>5</td>
                    </tr>
                    <tr>
                      <td className="font-medium">Smart Contract Vulnerabilities</td>
                      <td>2024-01-15</td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Peer Review
                        </span>
                      </td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Review Assignments</CardTitle>
                <CardDescription>
                  Papers assigned to you for review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Modern Applications of Distributed Systems
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Due: Apr 15, 2024
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <span className="text-xs text-muted-foreground">75% completed</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Ethical Implications of AI in Healthcare
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Due: Apr 22, 2024
                      </span>
                    </div>
                    <Progress value={30} className="h-2" />
                    <span className="text-xs text-muted-foreground">30% completed</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Cryptographic Methods for Blockchain
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Due: May 5, 2024
                      </span>
                    </div>
                    <Progress value={0} className="h-2" />
                    <span className="text-xs text-muted-foreground">Not started</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent interactions with the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <FileText className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Submitted peer review</p>
                      <p className="text-sm text-muted-foreground">
                        You submitted a review for "Neural Network Optimization"
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <Library className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Paper published</p>
                      <p className="text-sm text-muted-foreground">
                        Your paper "Advances in Neural Networks" was published
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                      <Star className="h-5 w-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New citation</p>
                      <p className="text-sm text-muted-foreground">
                        Your paper received 3 new citations
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 weeks ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
