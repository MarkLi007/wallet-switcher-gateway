
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, ChevronDown, Copy, ExternalLink, Power, RefreshCw } from 'lucide-react';
import { BrowserProvider } from 'ethers';
import { toast } from 'sonner';

const EnhancedWalletButton: React.FC = () => {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkName, setNetworkName] = useState<string>("");

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  async function checkConnection() {
    if (!window.ethereum) return;

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const address = accounts[0].address;
        setCurrentAccount(address);
        
        const network = await provider.getNetwork();
        setChainId(network.chainId.toString());
        setNetworkName(getNetworkName(network.chainId.toString()));
      }
    } catch (err) {
      console.log("Not connected:", err);
    }
  }

  async function connectWallet() {
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
        const chainIdStr = network.chainId.toString();
        setChainId(chainIdStr);
        setNetworkName(getNetworkName(chainIdStr));
        toast.success("Wallet connected successfully");
      }
    } catch (err) {
      toast.error("Connection failed: " + (err as Error).message);
    } finally {
      setIsConnecting(false);
    }
  }

  function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      setCurrentAccount(null);
      toast.info("Wallet disconnected");
    } else {
      setCurrentAccount(accounts[0]);
      toast.info("Account changed");
    }
  }

  function handleChainChanged(_chainId: string) {
    window.location.reload();
  }

  function getNetworkName(chainIdStr: string): string {
    const chainId = parseInt(chainIdStr);
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet";
      case 5:
        return "Goerli";
      case 11155111:
        return "Sepolia";
      case 137:
        return "Polygon";
      case 80001:
        return "Mumbai";
      case 31337:
        return "Hardhat";
      default:
        return "Unknown Network";
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Address copied to clipboard"))
      .catch(err => toast.error("Failed to copy: " + err.message));
  }

  function formatAddress(address: string): string {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  function disconnectWallet() {
    // Note: MetaMask doesn't support programmatic disconnection
    // This just resets the state in our app
    setCurrentAccount(null);
    setChainId("");
    setNetworkName("");
    toast.info("Wallet state reset - please disconnect manually in your wallet");
  }

  return (
    <>
      {currentAccount ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="wallet-btn border-none bg-blue-600 hover:bg-blue-700">
              <Wallet className="wallet-icon h-5 w-5" />
              <span className="hidden md:inline">{formatAddress(currentAccount)}</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              Wallet Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer flex justify-between">
              <div className="flex items-center">
                <span className="font-mono">{formatAddress(currentAccount)}</span>
              </div>
              <Copy 
                className="h-4 w-4 ml-2 cursor-pointer" 
                onClick={() => copyToClipboard(currentAccount)}
              />
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-default flex justify-between">
              <span>Network:</span> 
              <span className="font-medium text-blue-600">{networkName}</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(`https://etherscan.io/address/${currentAccount}`, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer" onClick={checkConnection}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Connection
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={disconnectWallet}>
              <Power className="h-4 w-4 mr-2" />
              Reset Connection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          onClick={connectWallet} 
          disabled={isConnecting}
          className="wallet-btn"
        >
          {isConnecting ? (
            <>
              <span className="loader mr-2"></span>
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="wallet-icon h-5 w-5" />
              <span>Connect Wallet</span>
            </>
          )}
        </Button>
      )}
    </>
  );
};

export default EnhancedWalletButton;
