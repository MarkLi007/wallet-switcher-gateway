import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export const WalletConnect: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0]);
        setIsConnected(accounts.length > 0);
      });
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(account);
      setIsConnected(true);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
  };

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {account}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};
