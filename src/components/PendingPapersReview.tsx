
import React, { useState, useEffect } from "react";
import { getContract, checkRoles, PaperStatus } from "@/services/contractService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, RefreshCw, FileText, Eye } from "lucide-react";

interface PendingPaper {
  paperId: number;
  ownerAddr: string;
  title: string;
  author: string;
  status: number;
  versionCount: number;
  ipfsHash: string;
  timestamp: number;
}

const PendingPapersReview: React.FC = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isAuditor, setIsAuditor] = useState(false);
  const [pendingPapers, setPendingPapers] = useState<PendingPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionPaperId, setActionPaperId] = useState<number | null>(null);

  useEffect(() => {
    checkUserRoleAndLoadPapers();
  }, []);

  async function checkUserRoleAndLoadPapers() {
    try {
      const { account, isOwner, isAuditor } = await checkRoles();
      setCurrentAccount(account);
      setIsOwner(isOwner);
      setIsAuditor(isAuditor);
      
      if (isOwner || isAuditor) {
        loadPendingPapers();
      } else {
        toast.error("You don't have permission to review papers");
      }
    } catch (err) {
      toast.error("Failed to check role: " + (err as Error).message);
    }
  }

  async function loadPendingPapers() {
    if (!isOwner && !isAuditor) return;
    
    setLoading(true);
    try {
      toast.info("Loading pending papers...");
      const contract = await getContract();
      
      const paperCountBn = await contract.paperCount();
      const paperCount = Number(paperCountBn);
      
      let list: PendingPaper[] = [];
      for (let i = 1; i <= paperCount; i++) {
        const [ownerAddr, title, author, statusBn, verCountBn] =
          await contract.getPaperInfo(i);
        const status = Number(statusBn);
        const versionCount = Number(verCountBn);
        
        if (status === PaperStatus.PENDING) {
          // Get the first version for preview
          const [ipfsHash, _, tsBn] = await contract.getVersion(i, 0);
          const timestamp = Number(tsBn);
          
          list.push({
            paperId: i,
            ownerAddr,
            title,
            author,
            status,
            versionCount,
            ipfsHash,
            timestamp,
          });
        }
      }
      
      setPendingPapers(list);
      toast.success(`Loaded ${list.length} pending papers for review`);
    } catch (err) {
      toast.error("Failed to load papers: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(paperId: number) {
    setActionPaperId(paperId);
    try {
      toast.info(`Approving paper ID ${paperId}...`);
      const contract = await getContract();
      const tx = await contract.approvePaper(paperId);
      await tx.wait();
      
      toast.success(`Paper ID ${paperId} approved!`);
      // Reload the list
      loadPendingPapers();
    } catch (err) {
      toast.error("Failed: " + (err as Error).message);
    } finally {
      setActionPaperId(null);
    }
  }

  async function handleReject(paperId: number) {
    setActionPaperId(paperId);
    try {
      toast.info(`Rejecting paper ID ${paperId}...`);
      const contract = await getContract();
      const tx = await contract.rejectPaper(paperId);
      await tx.wait();
      
      toast.success(`Paper ID ${paperId} rejected!`);
      // Reload the list
      loadPendingPapers();
    } catch (err) {
      toast.error("Failed: " + (err as Error).message);
    } finally {
      setActionPaperId(null);
    }
  }

  if (!isOwner && !isAuditor) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Pending Papers Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <p>You don't have permission to review papers.</p>
            <p>Only auditors and the contract owner can access this feature.</p>
            <Button variant="outline" onClick={checkUserRoleAndLoadPapers} className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Permissions
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pending Papers Review</CardTitle>
        <Button variant="outline" onClick={loadPendingPapers} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <p>
            <span className="font-medium">Current Account:</span> {currentAccount}
          </p>
          <p>
            <span className="font-medium">Role:</span>{" "}
            {isOwner ? "Owner" : ""}{isOwner && isAuditor ? " & " : ""}
            {isAuditor ? "Auditor" : ""}
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-primary" />
            <p className="mt-2">Loading pending papers...</p>
          </div>
        ) : pendingPapers.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-lg font-medium">No pending papers</p>
            <p className="text-gray-500">All papers have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingPapers.map((paper) => (
              <div 
                key={paper.paperId} 
                className="border rounded-md p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      Paper#{paper.paperId}: {paper.title}
                    </h3>
                    <p className="text-sm">Author: {paper.author}</p>
                    <p className="text-sm text-gray-500">
                      Owner: {paper.ownerAddr.slice(0, 6)}...{paper.ownerAddr.slice(-4)}
                    </p>
                    <div className="flex items-center mt-1 gap-2">
                      <Badge variant="outline">
                        {paper.versionCount} versions
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Submitted: {new Date(paper.timestamp * 1000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`https://ipfs.io/ipfs/${paper.ipfsHash}`, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View PDF
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                    onClick={() => handleApprove(paper.paperId)}
                    disabled={actionPaperId === paper.paperId}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {actionPaperId === paper.paperId ? "Processing..." : "Approve"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    onClick={() => handleReject(paper.paperId)}
                    disabled={actionPaperId === paper.paperId}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {actionPaperId === paper.paperId ? "Processing..." : "Reject"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingPapersReview;
