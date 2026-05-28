import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProposalCard } from '../components/ProposalCard';
import { 
  Shield, 
  Vote, 
  Users, 
  Layers, 
  ArrowRight, 
  Globe,
  Lock,
  Scale
} from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { proposals, stats, isWalletConnected } = useAppStore();
  const featuredProposals = proposals.filter(p => p.status === 'active').slice(0, 3);

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-teal-400" />,
      title: 'Decentralized Governance',
      description: 'AI decisions governed by the community through transparent blockchain voting.'
    },
    {
      icon: <Lock className="w-8 h-8 text-teal-400" />,
      title: 'Secure & Transparent',
      description: 'All votes are recorded on-chain, ensuring immutability and full transparency.'
    },
    {
      icon: <Scale className="w-8 h-8 text-teal-400" />,
      title: 'US Law Compliant',
      description: 'Designed with regulatory compliance in mind, adhering to US legal standards.'
    },
    {
      icon: <Globe className="w-8 h-8 text-teal-400" />,
      title: 'Global Participation',
      description: 'Anyone can participate and contribute to shaping the future of AI governance.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full mb-8">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              <span className="text-teal-400 text-sm font-medium">Live on Ethereum Sepolia</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-teal-100 to-white bg-clip-text text-transparent">
                Decentralized AI
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Governance
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              A blockchain-based platform for transparent, community-driven AI ethical decision-making.
              Compliant with US regulations and powered by Ethereum.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/proposals')}
                className="text-lg"
              >
                <Vote className="w-5 h-5 mr-2" />
                View Proposals
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              {!isWalletConnected && (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/proposals')}
                  className="text-lg"
                >
                  Learn More
                </Button>
              )}
              {isWalletConnected && (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/proposals/create')}
                  className="text-lg"
                >
                  Create Proposal
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Proposals', value: stats.totalProposals, icon: Layers },
              { label: 'Total Votes', value: stats.totalVotes, icon: Vote },
              { label: 'Active Users', value: stats.activeUsers, icon: Users },
              { label: 'Block Height', value: stats.blockHeight.toLocaleString(), icon: Shield }
            ].map((stat, idx) => (
              <Card key={idx} className="p-6 text-center">
                <stat.icon className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Proposals */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Proposals</h2>
              <p className="text-slate-400">Participate in shaping AI's future</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/proposals')}
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Us?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Built on the principles of decentralization, transparency, and compliance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-8 hover:border-teal-500/50 transition-all duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 text-center bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/20">
            <Shield className="w-16 h-16 text-teal-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Make Your Voice Heard?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join thousands of participants shaping the ethical future of AI through decentralized governance.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/proposals')}
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
