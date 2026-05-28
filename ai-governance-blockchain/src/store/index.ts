import { create } from 'zustand';
import { Proposal, User, Stats } from '../types';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  
  proposals: Proposal[];
  setProposals: (proposals: Proposal[]) => void;
  addProposal: (proposal: Proposal) => void;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  
  stats: Stats;
  setStats: (stats: Stats) => void;
  
  isWalletConnected: boolean;
  setIsWalletConnected: (connected: boolean) => void;
  
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
}

const initialStats: Stats = {
  totalProposals: 12,
  totalVotes: 1247,
  activeUsers: 423,
  blockHeight: 19234567,
};

const initialProposals: Proposal[] = [
  {
    id: '1',
    title: 'Implement AI Ethical Guidelines V2',
    description: 'Update the core AI ethical guidelines to include new provisions for transparency and accountability in machine learning models.',
    category: 'Ethics',
    status: 'active',
    creatorId: 'user1',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    votesFor: 342,
    votesAgainst: 128,
  },
  {
    id: '2',
    title: 'Decentralized Governance Model',
    description: 'Propose a new decentralized governance model for AI decision-making processes.',
    category: 'Governance',
    status: 'active',
    creatorId: 'user2',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    votesFor: 521,
    votesAgainst: 89,
  },
  {
    id: '3',
    title: 'Public AI Resource Allocation',
    description: 'Allocate more resources to public AI research and development initiatives.',
    category: 'Resources',
    status: 'passed',
    creatorId: 'user3',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    votesFor: 678,
    votesAgainst: 45,
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  },
];

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  
  proposals: initialProposals,
  setProposals: (proposals) => set({ proposals }),
  addProposal: (proposal) => set((state) => ({ proposals: [proposal, ...state.proposals] })),
  updateProposal: (id, updates) => set((state) => ({
    proposals: state.proposals.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),
  
  stats: initialStats,
  setStats: (stats) => set({ stats }),
  
  isWalletConnected: false,
  setIsWalletConnected: (connected) => set({ isWalletConnected: connected }),
  
  walletAddress: null,
  setWalletAddress: (address) => set({ walletAddress: address }),
}));
