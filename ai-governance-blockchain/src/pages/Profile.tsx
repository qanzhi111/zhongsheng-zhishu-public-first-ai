import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Button } from '../components/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import { 
  User, 
  Wallet, 
  Shield, 
  FileText, 
  Vote, 
  Calendar, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { proposals, isWalletConnected, walletAddress, setIsWalletConnected, setWalletAddress } = useAppStore();
  
  const userProposals = proposals.filter(p => p.creatorId === 'user' || p.creatorId === 'user1');

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsWalletConnected(false);
    navigate('/');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-8"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {!isWalletConnected ? (
          <div className="text-center py-20">
            <Wallet className="w-20 h-20 text-slate-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Wallet Not Connected</h2>
            <p className="text-slate-400 mb-8">
              Please connect your wallet to view your profile
            </p>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Profile Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {walletAddress ? formatAddress(walletAddress) : 'User'}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-slate-400">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        <span className="font-mono text-sm">{walletAddress}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">Verified</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={disconnectWallet}
                  >
                    Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Proposals Created', value: userProposals.length, icon: FileText, color: 'text-teal-400' },
                { label: 'Total Votes', value: userProposals.reduce((sum, p) => sum + p.votesFor + p.votesAgainst, 0), icon: Vote, color: 'text-amber-400' },
                { label: 'Active Proposals', value: userProposals.filter(p => p.status === 'active').length, icon: Clock, color: 'text-cyan-400' },
                { label: 'Passed Proposals', value: userProposals.filter(p => p.status === 'passed').length, icon: CheckCircle2, color: 'text-green-400' },
              ].map((stat, idx) => (
                <Card key={idx}>
                  <CardContent className="py-6">
                    <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Your Proposals */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Proposals</h2>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/proposals/create')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Create New
                </Button>
              </div>

              {userProposals.length > 0 ? (
                <div className="space-y-4">
                  {userProposals.map((proposal) => {
                    const totalVotes = proposal.votesFor + proposal.votesAgainst;
                    const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
                    
                    return (
                      <Card 
                        key={proposal.id}
                        className="cursor-pointer hover:border-teal-500/50 transition-all duration-300"
                        onClick={() => navigate(`/proposals/${proposal.id}`)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                  proposal.status === 'active' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                  proposal.status === 'passed' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                  proposal.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                                  'bg-slate-500/10 text-slate-400 border-slate-500/30'
                                }`}>
                                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/50">
                                  {proposal.category}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-white mb-2">{proposal.title}</h3>
                              <div className="flex items-center gap-4 text-slate-400 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>Created {new Date(proposal.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Vote className="w-4 h-4" />
                                  <span>{totalVotes} votes</span>
                                </div>
                              </div>
                            </div>
                            <div className="md:w-48">
                              <div className="text-right">
                                <span className="text-teal-400 font-semibold">{forPercentage.toFixed(1)}%</span>
                                <span className="text-slate-500 mx-1">/</span>
                                <span className="text-rose-400 font-semibold">{(100 - forPercentage).toFixed(1)}%</span>
                              </div>
                              <div className="h-2 bg-slate-700 rounded-full overflow-hidden mt-2">
                                <div 
                                  className="h-full bg-gradient-to-r from-teal-500 to-teal-400"
                                  style={{ width: `${forPercentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No Proposals Yet</h3>
                    <p className="text-slate-400 mb-6">
                      Create your first proposal to participate in AI governance
                    </p>
                    <Button onClick={() => navigate('/proposals/create')}>
                      Create Your First Proposal
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Compliance Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  Compliance Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">KYC Verification</h4>
                      <p className="text-slate-400 text-sm">Identity verified for US compliance</p>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">Verified</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">AML Check</h4>
                      <p className="text-slate-400 text-sm">Anti-money laundering screening</p>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">Passed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-700/50 pt-6">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/compliance')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  View Full Compliance Info
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
