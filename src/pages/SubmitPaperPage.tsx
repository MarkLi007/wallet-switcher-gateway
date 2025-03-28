
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, FileText } from 'lucide-react';
import { getCurrentAccount, getContract, uploadToIPFS, calculateFileHash } from '@/services/contractService';
import { BrowserProvider, keccak256 } from "ethers";

const SubmitPaperPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [signature, setSignature] = useState("");
  const [references, setReferences] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto sign with the connected wallet
  async function handleAutoSign(cid: string) {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not found");
      }
      
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Concatenate title, author, and CID for signature
      const data = `${title}|${author}|${cid}`;
      const hash = keccak256(new TextEncoder().encode(data));
      const sig = await signer.signMessage(hash);
      
      setSignature(sig);
      return sig;
    } catch (err) {
      toast.error("Signing failed: " + (err as Error).message);
      return "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!pdfFile) {
      toast.error("Please select a PDF file");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Check if wallet is connected
      await getCurrentAccount();
      
      // Upload to IPFS
      toast.info("Uploading to IPFS...");
      const cid = await uploadToIPFS(pdfFile);
      
      // Calculate file hash
      const fileHash = await calculateFileHash(pdfFile);
      
      // Auto sign
      const finalSig = await handleAutoSign(cid) || "0x";
      
      // Parse references
      let refs: number[] = [];
      if (references.trim() !== "") {
        refs = references
          .split(",")
          .map(str => parseInt(str.trim(), 10))
          .filter(num => !isNaN(num));
      }
      
      // Submit paper
      toast.info("Submitting paper to blockchain...");
      const contract = await getContract();
      const tx = await contract.submitPaper(
        title,
        author,
        cid,
        fileHash,
        finalSig,
        refs
      );
      
      // Wait for transaction confirmation
      await tx.wait();
      
      toast.success("Paper submitted successfully", {
        description: `CID: ${cid.slice(0, 15)}...`
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      toast.error("Submission failed: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="cnki-heading text-2xl">Submit New Paper</h1>
        <p className="text-gray-600">Submit your academic paper to be stored on the blockchain</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Paper Submission Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Paper Title:</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter the title of your paper"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author:</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name(s)"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pdfFile">Upload PDF:</Label>
                <Input
                  id="pdfFile"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files && setPdfFile(e.target.files[0])}
                  required
                />
                {pdfFile && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {pdfFile.name} ({Math.round(pdfFile.size / 1024)} KB)
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="references">Referenced Papers (Optional):</Label>
                <Input
                  id="references"
                  value={references}
                  onChange={(e) => setReferences(e.target.value)}
                  placeholder="Enter paper IDs separated by commas (e.g., 1,2,5)"
                />
                <p className="text-xs text-gray-500">
                  If this paper references other papers in the system, provide their IDs
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Paper
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SubmitPaperPage;
