
import React, { useState, useEffect } from "react";
import { getContract, checkRoles } from "@/services/contractService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { UserPlus, UserMinus, RefreshCw } from "lucide-react";

const AuditorManagement: React.FC = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [newAuditorAddr, setNewAuditorAddr] = useState("");
  const [isAddingAuditor, setIsAddingAuditor] = useState(false);
  const [isRemovingAuditor, setIsRemovingAuditor] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  async function checkUserRole() {
    try {
      const { account, isOwner } = await checkRoles();
      setCurrentAccount(account);
      setIsOwner(isOwner);
      
      if (!isOwner) {
        toast.error("You don't have permission to manage auditors");
      }
    } catch (err) {
      toast.error("Failed to check role: " + (err as Error).message);
    }
  }

  async function handleAddAuditor() {
    if (!newAuditorAddr || !newAuditorAddr.startsWith('0x')) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }
    
    setIsAddingAuditor(true);
    try {
      toast.info("Adding auditor...");
      const contract = await getContract();
      const tx = await contract.addAuditor(newAuditorAddr);
      await tx.wait();
      
      toast.success("Auditor added successfully!");
      setNewAuditorAddr("");
    } catch (err) {
      toast.error("Failed: " + (err as Error).message);
    } finally {
      setIsAddingAuditor(false);
    }
  }

  async function handleRemoveAuditor() {
    if (!newAuditorAddr || !newAuditorAddr.startsWith('0x')) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }
    
    setIsRemovingAuditor(true);
    try {
      toast.info("Removing auditor...");
      const contract = await getContract();
      const tx = await contract.removeAuditor(newAuditorAddr);
      await tx.wait();
      
      toast.success("Auditor removed successfully!");
      setNewAuditorAddr("");
    } catch (err) {
      toast.error("Failed: " + (err as Error).message);
    } finally {
      setIsRemovingAuditor(false);
    }
  }

  if (!isOwner) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Auditor Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <p>You don't have permission to manage auditors.</p>
            <p>Only the contract owner can access this feature.</p>
            <Button variant="outline" onClick={checkUserRole} className="mt-2">
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
      <CardHeader>
        <CardTitle>Auditor Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p>Current Account: {currentAccount}</p>
            <p className="text-green-600 font-medium">
              Owner Access: Yes
            </p>
          </div>
          
          <div className="pt-2">
            <p className="mb-2">Enter an Ethereum address to add or remove an auditor:</p>
            <div className="flex gap-2">
              <Input
                placeholder="0x..."
                value={newAuditorAddr}
                onChange={(e) => setNewAuditorAddr(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleAddAuditor}
                disabled={isAddingAuditor}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {isAddingAuditor ? "Adding..." : "Add Auditor"}
              </Button>
              <Button 
                onClick={handleRemoveAuditor}
                disabled={isRemovingAuditor}
                variant="destructive"
              >
                <UserMinus className="h-4 w-4 mr-2" />
                {isRemovingAuditor ? "Removing..." : "Remove Auditor"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditorManagement;
