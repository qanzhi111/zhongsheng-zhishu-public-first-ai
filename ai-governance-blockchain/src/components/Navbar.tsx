import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { useAppStore } from '../store';
import { Wallet, Shield, Home, FileText, User, Menu, X } from 'lucide-react';
import { cn } from './Button';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isWalletConnected, walletAddress, setIsWalletConnected, setWalletAddress } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
      } else {
        alert('Please install MetaMask or another Ethereum wallet');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsWalletConnected(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              AI Governance
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-slate-300 hover:text-teal-400 transition-colors font-medium flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link 
              to="/proposals" 
              className="text-slate-300 hover:text-teal-400 transition-colors font-medium flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Proposals
            </Link>
            <Link 
              to="/compliance" 
              className="text-slate-300 hover:text-teal-400 transition-colors font-medium flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Compliance
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isWalletConnected ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/profile')}
                >
                  <User className="w-4 h-4 mr-2" />
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button onClick={connectWallet}>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>

          <button 
            className="md:hidden text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className={cn(
        'md:hidden bg-slate-900/95 border-b border-slate-800 transition-all duration-300 overflow-hidden',
        mobileMenuOpen ? 'max-h-96' : 'max-h-0'
      )}>
        <div className="px-4 py-6 space-y-4">
          <Link 
            to="/" 
            className="block text-slate-300 hover:text-teal-400 transition-colors font-medium py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/proposals" 
            className="block text-slate-300 hover:text-teal-400 transition-colors font-medium py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Proposals
          </Link>
          <Link 
            to="/compliance" 
            className="block text-slate-300 hover:text-teal-400 transition-colors font-medium py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Compliance
          </Link>
          <div className="pt-4 border-t border-slate-800">
            {isWalletConnected ? (
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    navigate('/profile');
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => {
                    disconnectWallet();
                    setMobileMenuOpen(false);
                  }}
                >
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full"
                onClick={() => {
                  connectWallet();
                  setMobileMenuOpen(false);
                }}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
