import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getContract, calculateFileHash, uploadToIPFS } from "@/services/contractService";
import { BrowserProvider, keccak256 } from "ethers";
import { FilePlus2, Upload } from "lucide-react";

const AddVersionForm: React.FC = () => {
  const [paperId, setPaperId] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [signature, setSignature] = useState("");
  const [references, setReferences] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAutoSign(cid: string) {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not found");
      }
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const data = `${paperId}|${cid}`;
      const hash = keccak256(new TextEncoder().encode(data));
      const sig = await signer.signMessage(hash);
      setSignature(sig);
      toast.success("Auto-signed successfully");
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
      toast.info("Uploading to IPFS...");
      const cid = await uploadToIPFS(pdfFile);
      
      // Calculate fileHash
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
      
      toast.info("Calling addVersion...");
      const contract = await getContract();
      const tx = await contract.addVersion(
        paperId,
        cid,
        fileHash,
        finalSig,
        refs
      );
      
      await tx.wait();
      toast.success("Version submitted successfully", {
        description: `CID: ${cid.slice(0, 10)}...`
      });
      
      // Reset form
      setPaperId("");
      setPdfFile(null);
      setReferences("");
      setSignature("");
    } catch (err) {
      toast.error("Failed: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FilePlus2 className="h-5 w-5" />
          Add New Version (with References)
        </CardTitle>
        <CardDescription>
          Add a new version to an existing paper with references to other papers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paperId">Paper ID:</Label>
            <Input
              id="paperId"
              value={paperId}
              onChange={(e) => setPaperId(e.target.value)}
              placeholder="Enter the paper ID"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pdfFile">Select PDF:</Label>
            <div className="flex items-center gap-2">
              <Input
                id="pdfFile"
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files && setPdfFile(e.target.files[0])}
                required
                className="flex-1"
              />
              {pdfFile && (
                <span className="text-sm text-green-600">
                  {pdfFile.name}
                </span>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="references">Referenced Paper IDs:</Label>
            <Input
              id="references"
              placeholder="E.g., 1,2,5"
              value={references}
              onChange={(e) => setReferences(e.target.value)}
            />
            <p className="text-sm text-gray-500">Comma-separated list of paper IDs</p>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit Version
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddVersionForm;
