import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { 
  Shield, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Globe, 
  Lock,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

const Compliance: React.FC = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const complianceSections = [
    {
      id: 'kyc',
      title: 'KYC (Know Your Customer)',
      icon: CheckCircle2,
      status: 'Compliant',
      statusColor: 'text-green-400',
      content: `
        Our platform implements robust KYC procedures to verify the identity of all users:
        
        • Government-issued ID verification
        • Address validation through utility bills or bank statements
        • Biometric verification where required by law
        • Sanctions list screening against OFAC, UN, and other international bodies
        • Ongoing monitoring for suspicious activity
        
        All KYC data is encrypted and stored in compliance with data protection regulations.
      `
    },
    {
      id: 'aml',
      title: 'AML (Anti-Money Laundering)',
      icon: Shield,
      status: 'Compliant',
      statusColor: 'text-green-400',
      content: `
        Our AML program includes comprehensive measures to prevent money laundering:
        
        • Transaction monitoring for suspicious patterns
        • Currency transaction reporting (CTR) where required
        • Suspicious activity reporting (SAR) protocols
        • Customer risk assessment and categorization
        • Regular AML compliance audits
        • Employee AML training programs
        
        We work closely with regulatory authorities to ensure full compliance with all applicable AML laws and regulations.
      `
    },
    {
      id: 'sec',
      title: 'SEC Compliance',
      icon: FileText,
      status: 'Compliant',
      statusColor: 'text-green-400',
      content: `
        Our platform is designed to be compliant with US Securities regulations:
        
        • All tokens and governance mechanisms are structured to avoid classification as securities
        • We provide clear disclosures about platform risks and operations
        • Regular reports to regulatory authorities as required
        • Compliance with Regulation S-P for privacy of consumer financial information
        • Adherence to Regulation S-ID for identity theft prevention
        
        Legal counsel reviews all platform changes to ensure ongoing compliance.
      `
    },
    {
      id: 'data',
      title: 'Data Privacy & Protection',
      icon: Lock,
      status: 'Compliant',
      statusColor: 'text-green-400',
      content: `
        We are committed to protecting user data in compliance with global standards:
        
        • GDPR compliance for EU users
        • CCPA compliance for California residents
        • End-to-end encryption of sensitive data
        • Regular security audits and penetration testing
        • Clear privacy policy explaining data collection and usage
        • User consent for data collection and processing
        • Right to access, rectify, and delete personal data
        
        Our security practices are regularly audited by independent third-party firms.
      `
    },
    {
      id: 'blockchain',
      title: 'Blockchain Compliance',
      icon: Globe,
      status: 'Compliant',
      statusColor: 'text-green-400',
      content: `
        Our blockchain implementation adheres to all applicable regulations:
        
        • All transactions are recorded on a public, immutable blockchain
        • We maintain records of all user activities and transactions
        • We cooperate with law enforcement requests as required by law
        • Our smart contracts are audited for security and compliance
        • We implement chain analysis tools to detect illicit activity
        • Compliance with FinCEN regulations for money services businesses
        
        We actively participate in industry working groups on blockchain regulation.
      `
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-8"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Compliance Information</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Our platform is built from the ground up with compliance in mind, adhering to all relevant US laws and international standards.
          </p>
        </div>

        {/* Compliance Status Overview */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Overall Compliance Status</h3>
                  <p className="text-green-400 font-semibold">Fully Compliant</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">5/5</div>
                  <div className="text-slate-400 text-sm">Compliant Areas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">2024</div>
                  <div className="text-slate-400 text-sm">Last Audit</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Sections */}
        <div className="space-y-4">
          {complianceSections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;
            
            return (
              <Card 
                key={section.id}
                className="overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full text-left"
                >
                  <CardContent className="pt-6 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-teal-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                          <div className={`flex items-center gap-2 ${section.statusColor}`}>
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium">{section.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </button>
                
                {isExpanded && (
                  <div className="border-t border-slate-700/50">
                    <CardContent className="pt-6">
                      <div className="prose prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap text-slate-300 font-sans text-sm leading-relaxed bg-transparent p-0 m-0">
                          {section.content}
                        </pre>
                      </div>
                    </CardContent>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Legal Documents */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="w-6 h-6" />
              Legal Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Terms of Service', description: 'Complete user agreement and terms of service' },
                { title: 'Privacy Policy', description: 'How we collect, use, and protect your data' },
                { title: 'Risk Disclosure', description: 'Important information about platform risks' },
                { title: 'Compliance Report', description: 'Latest regulatory compliance audit report' },
              ].map((doc, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group"
                >
                  <div>
                    <h4 className="text-white font-medium group-hover:text-teal-400 transition-colors">{doc.title}</h4>
                    <p className="text-slate-400 text-sm">{doc.description}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact for Compliance Inquiries */}
        <Card className="mt-8 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 border-teal-500/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Compliance Inquiries</h3>
                <p className="text-slate-400">
                  Have questions about our compliance practices? Contact our compliance team.
                </p>
              </div>
              <Button>
                <Shield className="w-4 h-4 mr-2" />
                Contact Compliance Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Compliance;
