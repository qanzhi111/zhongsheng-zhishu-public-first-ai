import React from 'react';
import { Proposal } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { cn } from './Button';
import { Calendar, Users, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProposalCardProps {
  proposal: Proposal;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  const navigate = useNavigate();
  
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'active':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'passed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'passed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card 
      className="hover:border-teal-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-teal-500/10"
      onClick={() => navigate(`/proposals/${proposal.id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1',
              getStatusColor(proposal.status)
            )}>
              {getStatusIcon(proposal.status)}
              {proposal.status.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/50">
              {proposal.category}
            </span>
          </div>
        </div>
        <CardTitle className="line-clamp-2">{proposal.title}</CardTitle>
        <CardDescription className="line-clamp-3 mt-2">
          {proposal.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div 
                className="bg-teal-500 transition-all duration-500"
                style={{ width: `${forPercentage}%` }}
              />
              <div 
                className="bg-rose-500 transition-all duration-500"
                style={{ width: `${againstPercentage}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-teal-400 font-semibold">
              For: {proposal.votesFor} ({forPercentage.toFixed(1)}%)
            </span>
            <span className="text-rose-400 font-semibold">
              Against: {proposal.votesAgainst} ({againstPercentage.toFixed(1)}%)
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Calendar className="w-4 h-4" />
          <span>Ends {new Date(proposal.endAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Users className="w-4 h-4" />
          <span>{totalVotes} votes</span>
        </div>
      </CardFooter>
    </Card>
  );
};
