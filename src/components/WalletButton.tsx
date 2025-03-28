
import React, { useState } from 'react';
import { Wallet, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

const wallets = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊' },
  { id: 'coinbase', name: 'Coinbase', icon: '🪙' },
  { id: 'trust', name: 'Trust Wallet', icon: '🔒' },
  { id: 'phantom', name: 'Phantom', icon: '👻' }
];

interface WalletButtonProps {
  className?: string;
}

const WalletButton: React.FC<WalletButtonProps> = ({ className }) => {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const connectWallet = (walletId: string, walletName: string) => {
    setIsConnecting(true);
    setIsOpen(false);
    
    // Simulate connection process
    setTimeout(() => {
      setSelectedWallet(walletId);
      setIsConnecting(false);
      toast.success(`Connected to ${walletName}`);
    }, 1500);
  };

  const disconnectWallet = () => {
    setSelectedWallet(null);
    toast.info('Wallet disconnected');
  };

  return (
    <div className={className}>
      {!selectedWallet ? (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="default" 
              className="wallet-btn"
              disabled={isConnecting}
            >
              <Wallet className="wallet-icon h-4 w-4" />
              {isConnecting ? "Connecting..." : "Connect Wallet"} 
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0">
            <div className="flex flex-col p-2">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.id}
                  variant="ghost"
                  className="justify-start px-2 py-1.5 text-sm"
                  onClick={() => connectWallet(wallet.id, wallet.name)}
                >
                  <span className="mr-2">{wallet.icon}</span>
                  {wallet.name}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="text-green-600 border-green-200 bg-green-50"
          >
            <Check className="h-3.5 w-3.5 mr-1.5" />
            <span>
              {wallets.find(w => w.id === selectedWallet)?.name || 'Wallet'} Connected
            </span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={disconnectWallet}
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
};

export default WalletButton;
