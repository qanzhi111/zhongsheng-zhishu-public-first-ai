export interface Proposal {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'active' | 'passed' | 'rejected';
  creatorId: string;
  createdAt: string;
  endAt: string;
  votesFor: number;
  votesAgainst: number;
  transactionHash?: string;
}

export interface Vote {
  id: string;
  proposalId: string;
  userId: string;
  support: boolean;
  timestamp: string;
  transactionHash: string;
}

export interface User {
  id: string;
  email: string;
  walletAddress?: string;
  kycVerified: boolean;
  createdAt: string;
}

export interface CreateProposalRequest {
  title: string;
  description: string;
  category: string;
  endAt: string;
}

export interface SubmitVoteRequest {
  proposalId: string;
  support: boolean;
  signature: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface Stats {
  totalProposals: number;
  totalVotes: number;
  activeUsers: number;
  blockHeight: number;
}
