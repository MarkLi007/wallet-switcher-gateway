
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  BookOpen, 
  Clock, 
  FileText, 
  Filter, 
  UploadCloud 
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import PaperCard from '@/components/PaperCard';

// Mock data for demonstration
const MOCK_PAPERS = [
  { 
    id: 'p1', 
    title: 'Blockchain Technology in Academic Publishing', 
    author: 'John Doe', 
    abstract: 'This paper explores the application of blockchain technology in academic publishing, focusing on its potential to revolutionize peer review, citation tracking, and intellectual property protection.',
    status: 'Published', 
    date: '2023-04-15',
    ipfsHash: 'QmT7fzZ7X9z5'
  },
  { 
    id: 'p2', 
    title: 'Smart Contract Implementation for Research Validation', 
    author: 'Jane Smith', 
    abstract: 'An analysis of implementing smart contracts for automated validation of research findings and replication studies, with a focus on incentivizing reproducibility in scientific research.',
    status: 'Pending', 
    date: '2023-05-22',
  },
  { 
    id: 'p3', 
    title: 'Decentralized Storage Solutions for Scientific Data', 
    author: 'Michael Johnson', 
    abstract: 'Exploring the benefits and challenges of using decentralized storage networks for large scientific datasets, comparing IPFS, Filecoin, and traditional centralized storage solutions.',
    status: 'Published', 
    date: '2023-03-10',
    ipfsHash: 'QmX9V5jR2Z1q'
  },
  { 
    id: 'p4', 
    title: 'Token Economics in Academic Incentive Systems', 
    author: 'Sarah Williams', 
    abstract: 'A theoretical framework for applying token economics to academic incentive systems, potentially creating more transparent and equitable rewards for contributions to knowledge.',
    status: 'Rejected', 
    date: '2023-06-05',
  },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter papers based on search query and active tab
  const filteredPapers = MOCK_PAPERS.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          paper.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'published') return matchesSearch && paper.status.toLowerCase() === 'published';
    if (activeTab === 'pending') return matchesSearch && paper.status.toLowerCase() === 'pending';
    
    return matchesSearch;
  });

  const handleViewPaper = (ipfsHash: string) => {
    // In a real app, redirect to paper view or open in IPFS gateway
    window.open(`https://ipfs.io/ipfs/${ipfsHash}`, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="cnki-heading text-2xl">Welcome, {user?.username}</h1>
        <p className="text-gray-600">Browse and manage academic papers stored on the blockchain</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search papers by title or author..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4" />
            <span>Submit Paper</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>All Papers</span>
          </TabsTrigger>
          <TabsTrigger value="published" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Published</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPapers.length > 0 ? (
          filteredPapers.map(paper => (
            <PaperCard
              key={paper.id}
              id={paper.id}
              title={paper.title}
              author={paper.author}
              abstract={paper.abstract}
              status={paper.status}
              date={paper.date}
              ipfsHash={paper.ipfsHash}
              onView={() => paper.ipfsHash && handleViewPaper(paper.ipfsHash)}
            />
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-lg font-medium">No papers found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
