import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import CommentSection from '@/components/CommentSection';
import DiffCompare from '@/components/DiffCompare';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  FileText, 
  Clock, 
  Info, 
  Eye, 
  EyeOff,
  MessageSquare, 
  FileDiff,
  User
} from 'lucide-react';

import { getContract, checkRoles, PaperStatus } from '@/services/contractService';
import { getCurrentAccount } from '@/services/contractService';

interface PaperInfo {
  owner: string;
  title: string;
  author: string;
  status: number;
  versionCount: number;
}

interface VersionData {
  ipfsHash: string;
  fileHash: string;
  timestamp: number;
  signature: string;
  references: number[];
}

const PaperDetailsPage: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const { user } = useAuth();
  const [info, setInfo] = useState<PaperInfo | null>(null);
  const [verIndex, setVerIndex] = useState("0");
  const [verData, setVerData] = useState<VersionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [versionLoading, setVersionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  
  // User roles for permission checks
  const [currentAccount, setCurrentAccount] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isAuditor, setIsAuditor] = useState(false);
  const [isPaperOwner, setIsPaperOwner] = useState(false);

  // Status mapping function
  const mapStatus = (status: number) => {
    switch (status) {
      case PaperStatus.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case PaperStatus.PUBLISHED:
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case PaperStatus.REJECTED:
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case PaperStatus.REMOVED:
        return <Badge className="bg-gray-100 text-gray-800">Removed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Check user roles
  useEffect(() => {
    const checkUserRoles = async () => {
      try {
        const { account, isOwner, isAuditor } = await checkRoles();
        setCurrentAccount(account);
        setIsOwner(isOwner);
        setIsAuditor(isAuditor);
      } catch (err) {
        console.error("Failed to check roles:", err);
      }
    };
    
    checkUserRoles();
  }, []);

  // Load paper info
  useEffect(() => {
    if (!paperId) return;
    
    const loadPaperInfo = async () => {
      setLoading(true);
      try {
        const contract = await getContract();
        const [owner, title, author, statusBn, verCountBn] = 
          await contract.getPaperInfo(paperId);
          
        const status = Number(statusBn);
        const versionCount = Number(verCountBn);
        
        setInfo({ owner, title, author, status, versionCount });
        
        // Check if current account is the paper owner
        const account = await getCurrentAccount();
        setIsPaperOwner(account.toLowerCase() === owner.toLowerCase());
        
        // Load first version by default
        if (versionCount > 0) {
          loadVersion("0");
        }
      } catch (err) {
        toast.error("Failed to load paper: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    loadPaperInfo();
  }, [paperId]);
  
  // Load version data
  const loadVersion = async (vIndex: string) => {
    if (!paperId || !info) return;
    
    setVersionLoading(true);
    try {
      const contract = await getContract();
      const [ipfsHash, fileHash, tsBn, signature, refs] = 
        await contract.getVersion(paperId, vIndex);
        
      const timestamp = Number(tsBn);
      const referencesArray = refs.map((r: any) => Number(r));
      
      setVerData({
        ipfsHash,
        fileHash,
        timestamp,
        signature,
        references: referencesArray
      });
      
      setVerIndex(vIndex);
    } catch (err) {
      toast.error("Failed to load version: " + (err as Error).message);
      setVerData(null);
    } finally {
      setVersionLoading(false);
    }
  };
  
  // Handle version selection change
  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vIndex = e.target.value;
    if (!info) return;
    
    // Validate version index
    const versionNum = Number(vIndex);
    if (isNaN(versionNum) || versionNum < 0 || versionNum >= info.versionCount) {
      toast.error(`Version index must be between 0 and ${info.versionCount - 1}`);
      return;
    }
    
    loadVersion(vIndex);
  };
  
  // Check if user can view PDF
  const canViewPdf = () => {
    if (!info) return false;
    
    // Published papers are visible to everyone
    if (info.status === PaperStatus.PUBLISHED) {
      return true;
    }
    
    // Pending/Rejected papers are visible to:
    // - Owner of the paper
    // - Auditors
    // - Admin (contract owner)
    return isPaperOwner || isAuditor || isOwner;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Clock className="h-10 w-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!info) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold">Paper Not Found</h2>
          <p className="text-gray-500 mt-2">
            The paper with ID {paperId} could not be found.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // Check visibility of paper for non-owners and non-auditors
  const isPrivateStatusPaper = info.status === PaperStatus.PENDING || 
                              info.status === PaperStatus.REJECTED;
                              
  if (isPrivateStatusPaper && !isPaperOwner && !isAuditor && !isOwner) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <EyeOff className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold">Access Restricted</h2>
          <p className="text-gray-500 mt-2">
            This paper is in {info.status === PaperStatus.PENDING ? 'pending review' : 'rejected'} status.
            <br />
            Only the paper owner, auditors, and admin can view it.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="cnki-heading text-2xl">{info.title}</h1>
        <div className="flex items-center text-gray-600 mt-2">
          <User className="h-4 w-4 mr-1" />
          <span>{info.author}</span>
          <span className="mx-2">•</span>
          <span>Paper ID: {paperId}</span>
          <span className="mx-2">•</span>
          {mapStatus(info.status)}
        </div>
      </div>

      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="info" className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            <span>Paper Info</span>
          </TabsTrigger>
          {canViewPdf() && (
            <TabsTrigger value="versions" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Versions</span>
            </TabsTrigger>
          )}
          {info.versionCount > 1 && (
            <TabsTrigger value="diff" className="flex items-center gap-1">
              <FileDiff className="h-4 w-4" />
              <span>Compare Versions</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="comments" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Comments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Paper Information</CardTitle>
              <CardDescription>
                Details about the paper and its current status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-gray-500">Title</Label>
                  <p className="font-medium">{info.title}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Author</Label>
                  <p className="font-medium">{info.author}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Status</Label>
                  <p className="font-medium">{mapStatus(info.status)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Version Count</Label>
                  <p className="font-medium">{info.versionCount}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Owner Address</Label>
                  <p className="font-medium text-sm break-all">{info.owner}</p>
                </div>
                {isPaperOwner && (
                  <div>
                    <Badge className="bg-blue-100 text-blue-800">
                      You are the owner of this paper
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {canViewPdf() && (
          <TabsContent value="versions">
            <Card>
              <CardHeader>
                <CardTitle>Paper Versions</CardTitle>
                <CardDescription>
                  Select a version to view details and access the PDF
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <Label htmlFor="versionSelect">Version:</Label>
                    <Input
                      id="versionSelect"
                      type="number"
                      min={0}
                      max={info.versionCount - 1}
                      value={verIndex}
                      onChange={handleVersionChange}
                      className="mt-1"
                    />
                  </div>
                  <div className="text-sm text-gray-500 pt-6">
                    Available versions: 0 to {info.versionCount - 1}
                  </div>
                </div>
                
                {versionLoading ? (
                  <div className="flex justify-center py-10">
                    <Clock className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : verData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm text-gray-500">File Hash</Label>
                        <p className="font-medium text-sm break-all">{verData.fileHash}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Timestamp</Label>
                        <p className="font-medium">
                          {new Date(verData.timestamp * 1000).toLocaleString()}
                        </p>
                      </div>
                      
                      {verData.references.length > 0 && (
                        <div>
                          <Label className="text-sm text-gray-500">References</Label>
                          <p className="font-medium">
                            {verData.references.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Label className="text-sm text-gray-500">IPFS Hash</Label>
                      <p className="font-medium text-sm break-all mb-2">{verData.ipfsHash}</p>
                      <Button 
                        variant="default" 
                        onClick={() => window.open(`https://ipfs.io/ipfs/${verData.ipfsHash}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View PDF
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Select a version to view details
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {info.versionCount > 1 && (
          <TabsContent value="diff">
            <DiffCompare 
              paperId={paperId || ""} 
              versionCount={info.versionCount} 
            />
          </TabsContent>
        )}

        <TabsContent value="comments">
          <CommentSection paperId={paperId || ""} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default PaperDetailsPage;
