import React, { useState } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { useState } from "react";
import { useEffect } from "react";
import { useContext, createContext, createFileHash, uploadToIPFS } from "services/contractService";

const AddVersionForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [refereces, setReferences] = useState<string | null>("");

  useEffect(() => {
    const getFileHash = () => {
      if (file) {
        const hash = createFileHash(file);
        setSignature(hash);
      }
    };
    getFileHash();
  }, [file]);

  const handleAddVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const fileData = await uploadToIPFS(file);
    setReferences(fileData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Version</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddVersion}>
          <Input 
            type="file" 
            accept="application/json" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
          />
          <Button 
            type="submit" 
            disabled={!file}
          >
            Add New Version
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddVersionForm;
