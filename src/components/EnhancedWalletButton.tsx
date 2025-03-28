
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EnhancedWalletButton: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const { toast } = useToast();

  const connectWallet = async () => {
    if (isConnected) {
      // If already connected, disconnect
      setIsConnected(false);
      setWalletAddress('');
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected successfully"
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Simulate connection with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock wallet connection
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 10) + '...';
      setWalletAddress(mockAddress);
      setIsConnected(true);
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${mockAddress}`,
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button 
      onClick={connectWallet}
      variant={isConnected ? "outline" : "default"}
      className={`wallet-btn transition-all duration-300 ${isConnected ? 'border-green-500 text-green-600' : ''}`}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : isConnected ? (
        <>
          <Check className="h-4 w-4 mr-2 text-green-500" />
          {walletAddress}
        </>
      ) : (
        <>
          <Wallet className="wallet-icon h-4 w-4 mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};

export default EnhancedWalletButton;
