
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Upload, FileText } from 'lucide-react';
import { uploadToIPFS, calculateFileHash, getContract } from '../services/contractService';

const AddVersionForm = () => {
  const [paperId, setPaperId] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [references, setReferences] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!pdfFile) {
      toast.error("Please select a PDF file");
      return;
    }
    
    if (!paperId) {
      toast.error("Please enter a paper ID");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload to IPFS
      toast.info("Uploading to IPFS...");
      const cid = await uploadToIPFS(pdfFile);
      
      // Calculate file hash
      const fileHash = await calculateFileHash(pdfFile);
      
      // Parse references
      let refs = [];
      if (references.trim() !== "") {
        refs = references
          .split(",")
          .map(str => parseInt(str.trim(), 10))
          .filter(num => !isNaN(num));
      }
      
      // Submit new version
      toast.info("Adding new version to blockchain...");
      const contract = await getContract();
      const tx = await contract.addVersion(
        paperId,
        cid,
        fileHash,
        "0x", // No signature
        refs
      );
      
      // Wait for confirmation
      await tx.wait();
      toast.success("New version added successfully", {
        description: `CID: ${cid.slice(0, 15)}...`
      });
      
      // Reset form
      setPaperId("");
      setPdfFile(null);
      setReferences("");
      
    } catch (err) {
      toast.error("Failed to add version: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Add New Version
        </CardTitle>
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
              If this version references other papers in the system, provide their IDs
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
                Add Version
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddVersionForm;
