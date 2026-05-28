import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Button } from '../components/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

const ProposalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { proposals, isWalletConnected, updateProposal } = useAppStore();
  const [voting, setVoting] = useState(false);
  const [userVote, setUserVote] = useState<'for' | 'against' | null>(null);

  const proposal = proposals.find(p => p.id === id);

  if (!proposal) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Proposal not found</h2>
          <Button onClick={() => navigate('/proposals')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Proposals
          </Button>
        </div>
      </div>
    );
  }

  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;

  const handleVote = async (support: boolean) => {
    if (!isWalletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    setVoting(true);
    
    // Simulate voting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateProposal(proposal.id, {
      votesFor: support ? proposal.votesFor + 1 : proposal.votesFor,
      votesAgainst: !support ? proposal.votesAgainst + 1 : proposal.votesAgainst
    });
    
    setUserVote(support ? 'for' : 'against');
    setVoting(false);
  };

  const getStatusColor = (status: typeof proposal.status) => {
    switch (status) {
      case 'active': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'passed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-8"
          onClick={() => navigate('/proposals')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Proposals
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Proposal Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(proposal.status)}`}>
                    {proposal.status === 'active' && <Clock className="w-4 h-4" />}
                    {proposal.status === 'passed' && <CheckCircle2 className="w-4 h-4" />}
                    {proposal.status === 'rejected' && <XCircle className="w-4 h-4" />}
                    {proposal.status.toUpperCase()}
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/50">
                    {proposal.category}
                  </span>
                </div>
                <CardTitle className="text-3xl">{proposal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                    {proposal.description}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-700/50 pt-6 flex items-center justify-between">
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Created {new Date(proposal.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Ends {new Date(proposal.endAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {proposal.transactionHash && (
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${proposal.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1"
                  >
                    View on Etherscan
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </CardFooter>
            </Card>

            {/* Discussion Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  Discussion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                        A
                      </div>
                      <div>
                        <div className="font-semibold text-white">Alice</div>
                        <div className="text-slate-400 text-sm">2 days ago</div>
                      </div>
                    </div>
                    <p className="text-slate-300">This is a great proposal! I fully support this initiative.</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                        B
                      </div>
                      <div>
                        <div className="font-semibold text-white">Bob</div>
                        <div className="text-slate-400 text-sm">1 day ago</div>
                      </div>
                    </div>
                    <p className="text-slate-300">I have some concerns about the implementation details. Can we discuss this further?</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Voting Section */}
            <Card>
              <CardHeader>
                <CardTitle>Vote Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Vote Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-teal-400 font-semibold flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4" />
                      For
                    </span>
                    <span className="text-slate-300">{proposal.votesFor} ({forPercentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${forPercentage}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-rose-400 font-semibold flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4" />
                      Against
                    </span>
                    <span className="text-slate-300">{proposal.votesAgainst} ({againstPercentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-500 ml-auto"
                      style={{ width: `${againstPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{totalVotes} total votes</span>
                </div>

                {userVote && (
                  <div className={`p-4 rounded-xl ${userVote === 'for' ? 'bg-teal-500/10 border border-teal-500/30' : 'bg-rose-500/10 border border-rose-500/30'}`}>
                    <p className="text-sm font-medium text-white">
                      You voted <span className={userVote === 'for' ? 'text-teal-400' : 'text-rose-400'}>{userVote.toUpperCase()}</span>
                    </p>
                  </div>
                )}
              </CardContent>
              
              {proposal.status === 'active' && !userVote && (
                <CardFooter className="border-t border-slate-700/50 pt-6 space-y-3">
                  <Button 
                    className="w-full bg-teal-500 hover:bg-teal-600"
                    onClick={() => handleVote(true)}
                    disabled={voting}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {voting ? 'Voting...' : 'Vote For'}
                  </Button>
                  <Button 
                    className="w-full bg-rose-500 hover:bg-rose-600"
                    onClick={() => handleVote(false)}
                    disabled={voting}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    {voting ? 'Voting...' : 'Vote Against'}
                  </Button>
                  {!isWalletConnected && (
                    <p className="text-slate-400 text-sm text-center">
                      Connect your wallet to vote
                    </p>
                  )}
                </CardFooter>
              )}
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Proposal Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status</span>
                  <span className={`font-medium ${
                    proposal.status === 'active' ? 'text-amber-400' :
                    proposal.status === 'passed' ? 'text-green-400' :
                    proposal.status === 'rejected' ? 'text-rose-400' :
                    'text-slate-400'
                  }`}>
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Votes</span>
                  <span className="text-white font-medium">{totalVotes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">End Date</span>
                  <span className="text-white font-medium">
                    {new Date(proposal.endAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetail;
