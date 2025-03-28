import React from 'react';
import { Link } from 'react-router-dom';
import { WalletConnect } from './WalletConnect';

const EnhancedNavbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/submit-paper">Submit Paper</Link></li>
      </ul>
      <WalletConnect />
    </nav>
  );
};

export default EnhancedNavbar;
