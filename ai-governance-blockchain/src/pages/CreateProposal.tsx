import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Button } from '../components/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import { ArrowLeft, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Proposal } from '../types';

const CreateProposal: React.FC = () => {
  const navigate = useNavigate();
  const { isWalletConnected, addProposal } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Ethics',
    endDate: ''
  });

  const categories = ['Ethics', 'Governance', 'Resources', 'Technical', 'Other'];

  const validateStep1 = () => {
    return formData.title.length >= 10 && formData.description.length >= 50;
  };

  const handleSubmit = async () => {
    if (!isWalletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);

    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newProposal: Proposal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: 'active',
      creatorId: 'user',
      createdAt: new Date().toISOString(),
      endAt: new Date(formData.endDate).toISOString(),
      votesFor: 0,
      votesAgainst: 0
    };

    addProposal(newProposal);
    setStep(3);
    setLoading(false);
  };

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Wallet Not Connected</h2>
          <p className="text-slate-400 mb-8">
            Please connect your wallet to create a proposal
          </p>
          <Button onClick={() => navigate('/proposals')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Proposals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-8"
          onClick={() => navigate('/proposals')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Proposals
        </Button>

        {/* Progress Steps */}
        {step < 3 && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {[1, 2].map((s) => (
                <React.Fragment key={s}>
                  <div className={`flex items-center gap-3 ${s < step ? 'text-teal-400' : s === step ? 'text-white' : 'text-slate-500'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      s < step ? 'bg-teal-500 text-white' :
                      s === step ? 'bg-slate-700 text-white border-2 border-teal-500' :
                      'bg-slate-800 text-slate-500'
                    }`}>
                      {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                    </div>
                    <span className="hidden sm:inline font-medium">
                      {s === 1 ? 'Proposal Details' : 'Review & Submit'}
                    </span>
                  </div>
                  {s < 2 && (
                    <div className={`w-16 h-1 rounded-full ${s < step ? 'bg-teal-500' : 'bg-slate-700'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-6 h-6" />
                Create New Proposal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Proposal Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a clear, descriptive title for your proposal"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                />
                <p className="text-slate-500 text-sm mt-2">
                  {formData.title.length}/10+ characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-teal-500 transition-colors"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your proposal in detail. Include the problem, solution, and expected outcomes."
                  rows={10}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                />
                <p className="text-slate-500 text-sm mt-2">
                  {formData.description.length}/50+ characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Voting End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-700/50 pt-6 flex justify-end">
              <Button 
                onClick={() => setStep(2)}
                disabled={!validateStep1() || !formData.endDate}
              >
                Continue
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Proposal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Title</h3>
                <p className="text-white">{formData.title}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Category</h3>
                <p className="text-white">{formData.category}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Description</h3>
                <p className="text-white whitespace-pre-wrap">{formData.description}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Voting Ends</h3>
                <p className="text-white">{new Date(formData.endDate).toLocaleDateString()}</p>
              </div>
              
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-amber-400 font-medium mb-1">Important</h3>
                    <p className="text-slate-300 text-sm">
                      Once submitted, your proposal will be live on the blockchain and cannot be modified.
                      Please review carefully before submitting.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-700/50 pt-6 flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Proposal'}
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card className="text-center">
            <CardContent className="py-12">
              <div className="w-24 h-24 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-teal-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Proposal Submitted!</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Your proposal has been successfully created and is now live for voting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/proposals')}
                >
                  View All Proposals
                </Button>
                <Button 
                  onClick={() => navigate(`/proposals/${Date.now()}`)}
                >
                  View Your Proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateProposal;
