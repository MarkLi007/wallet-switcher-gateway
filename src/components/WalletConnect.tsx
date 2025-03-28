
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Wallet, Check, Loader2 } from "lucide-react";
import { BrowserProvider } from "ethers";

const WalletConnect: React.FC = () => {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet is connected on component mount
  useEffect(() => {
    checkConnection();
    
    // Set up event listeners
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }
    
    // Clean up event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  async function checkConnection() {
    if (!window.ethereum) {
      console.log("MetaMask not detected");
      return;
    }
    
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const address = accounts[0].address;
        setCurrentAccount(address);
        
        const network = await provider.getNetwork();
        setChainId(network.chainId.toString());
      }
    } catch (err) {
      console.log("Not connected to wallet");
    }
  }

  async function connectWallet() {
    if (currentAccount) {
      // If already connected, disconnect (clear state)
      setCurrentAccount(null);
      setChainId("");
      toast.success("Wallet disconnected");
      return;
    }
    
    setIsConnecting(true);
    
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask");
        return;
      }
      
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        
        const network = await provider.getNetwork();
        setChainId(network.chainId.toString());
        
        toast.success("Wallet connected", {
          description: `Address: ${accounts[0].slice(0, 8)}...`
        });
      }
    } catch (err) {
      toast.error("Connection failed: " + (err as Error).message);
    } finally {
      setIsConnecting(false);
    }
  }

  function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      // Disconnected
      setCurrentAccount(null);
      setChainId("");
      toast.info("Wallet disconnected");
    } else {
      // Account changed
      setCurrentAccount(accounts[0]);
      toast.info("Account changed", {
        description: accounts[0].slice(0, 8) + "..."
      });
    }
  }

  function handleChainChanged() {
    // We'll just reload the page
    window.location.reload();
  }

  return (
    <Button
      onClick={connectWallet}
      variant={currentAccount ? "outline" : "default"}
      className={`wallet-btn transition-all duration-300 ${
        currentAccount ? "border-green-500 text-green-600" : ""
      }`}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : currentAccount ? (
        <>
          <Check className="h-4 w-4 mr-2 text-green-500" />
          {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};

export default WalletConnect;
