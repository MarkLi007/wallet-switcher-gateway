
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadToIPFS, calculateFileHash } from "@/services/contractService";

const AddVersionForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [references, setReferences] = useState<string>("");

  useEffect(() => {
    const getFileHash = async () => {
      if (file) {
        try {
          const hash = await calculateFileHash(file);
          setSignature(hash);
        } catch (error) {
          console.error("Error calculating file hash:", error);
        }
      }
    };
    getFileHash();
  }, [file]);

  const handleAddVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    try {
      const fileData = await uploadToIPFS(file);
      setReferences(fileData);
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Version</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddVersion} className="space-y-4">
          <div className="space-y-2">
            <Input 
              type="file" 
              accept=".pdf,.json,.txt" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              className="cursor-pointer"
            />
            {signature && (
              <p className="text-sm text-gray-500">File hash: {signature.substring(0, 10)}...</p>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={!file}
            className="w-full"
          >
            Add New Version
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddVersionForm;
