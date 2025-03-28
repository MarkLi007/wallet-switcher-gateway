
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getContract, PaperStatus, checkRoles } from '@/services/contractService';
import { toast } from 'sonner';
import { 
  Search, 
  BookOpen, 
  Clock, 
  FileText, 
  Filter, 
  UploadCloud,
  RefreshCw 
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import PaperCard from '@/components/PaperCard';

interface Paper {
  id: string;
  title: string;
  author: string;
  abstract?: string;
  status: string;
  date: string;
  ipfsHash?: string;
  owner: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  
  // User role states
  const [currentAccount, setCurrentAccount] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [isAuditor, setIsAuditor] = useState(false);

  // Load papers from blockchain
  useEffect(() => {
    checkUserRoleAndLoadPapers();
  }, []);

  async function checkUserRoleAndLoadPapers() {
    try {
      const { account, isOwner, isAuditor } = await checkRoles();
      setCurrentAccount(account);
      setIsOwner(isOwner);
      setIsAuditor(isAuditor);
      
      loadPapers();
    } catch (err) {
      toast.error("Failed to check role: " + (err as Error).message);
      setLoading(false);
    }
  }

  async function loadPapers() {
    setLoading(true);
    try {
      const contract = await getContract();
      const paperCountBn = await contract.paperCount();
      const paperCount = Number(paperCountBn);
      
      let papersList: Paper[] = [];
      
      for (let i = 1; i <= paperCount; i++) {
        const [ownerAddr, title, author, statusBn, verCountBn] =
          await contract.getPaperInfo(i);
          
        const status = Number(statusBn);
        
        if (verCountBn > 0) {
          // Get the first version for the IPFS hash
          const [ipfsHash, _, tsBn] = await contract.getVersion(i, 0);
          const timestamp = Number(tsBn);
          
          // Skip papers with PENDING or REJECTED status if the user is not:
          // - the paper owner
          // - an auditor
          // - the contract owner
          const isPaperOwner = currentAccount.toLowerCase() === ownerAddr.toLowerCase();
          
          if ((status === PaperStatus.PENDING || status === PaperStatus.REJECTED) && 
              !isPaperOwner && !isAuditor && !isOwner) {
            continue;
          }
          
          // Map status number to string
          let statusStr;
          switch (status) {
            case PaperStatus.PENDING:
              statusStr = 'Pending';
              break;
            case PaperStatus.PUBLISHED:
              statusStr = 'Published';
              break;
            case PaperStatus.REJECTED:
              statusStr = 'Rejected';
              break;
            case PaperStatus.REMOVED:
              statusStr = 'Removed';
              break;
            default:
              statusStr = 'Unknown';
          }
          
          papersList.push({
            id: i.toString(),
            title,
            author,
            status: statusStr,
            date: new Date(timestamp * 1000).toLocaleDateString(),
            ipfsHash: ipfsHash,
            owner: ownerAddr
          });
        }
      }
      
      setPapers(papersList);
      toast.success(`Loaded ${papersList.length} papers`);
    } catch (err) {
      toast.error("Failed to load papers: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // Filter papers based on search query and active tab
  const filteredPapers = papers.filter(paper => {
    const matchesSearch = 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      paper.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'published') return matchesSearch && paper.status.toLowerCase() === 'published';
    if (activeTab === 'pending') return matchesSearch && paper.status.toLowerCase() === 'pending';
    if (activeTab === 'rejected') return matchesSearch && paper.status.toLowerCase() === 'rejected';
    
    return matchesSearch;
  });

  const handleViewPaper = (paperId: string) => {
    navigate(`/paper/${paperId}`);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="cnki-heading text-2xl">Welcome, {user?.username || "Researcher"}</h1>
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
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={loadPapers}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          
          <Button 
            className="flex items-center gap-2"
            onClick={() => navigate("/submit-paper")}
          >
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
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-10 w-10 animate-spin text-primary" />
          <span className="ml-3 text-lg">Loading papers...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.length > 0 ? (
            filteredPapers.map(paper => (
              <PaperCard
                key={paper.id}
                id={paper.id}
                title={paper.title}
                author={paper.author}
                abstract={paper.abstract || ""}
                status={paper.status}
                date={paper.date}
                ipfsHash={paper.ipfsHash}
                onView={() => handleViewPaper(paper.id)}
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
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
