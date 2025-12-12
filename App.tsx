
import React, { useState } from 'react';
import Layout from './components/Layout';
import AiTutor from './components/AiTutor';
import Dashboard from './views/Dashboard';
import Theory from './views/Theory';
import Vendors from './views/Vendors';
import Certifications from './views/Certifications';
import VirtualLab from './components/VirtualLab';
import { LAB_SESSIONS } from './constants';
import { LabSession } from './types';
import { Terminal, Play, CheckCircle, Shield, Router, Box, Wifi, Monitor } from 'lucide-react';

const Labs = () => {
    const [activeSession, setActiveSession] = useState<LabSession | null>(null);

    if (activeSession) {
        return (
            <div className="animate-fade-in max-w-7xl mx-auto pb-10">
                <VirtualLab 
                    session={activeSession} 
                    onExit={() => setActiveSession(null)} 
                />
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
             <div className="mb-10 text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-xl mb-4 text-blue-600">
                    <Terminal size={32} />
                </div>
                <h2 className="text-4xl font-bold text-slate-800 mb-4">Virtual Lab Environment</h2>
                <p className="text-slate-500 text-lg">
                    Production-grade simulations. Interactive topology with full CLI/GUI synchronization for Cisco, Juniper, Fortinet, and more.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {LAB_SESSIONS.map(session => (
                    <div 
                        key={session.id}
                        onClick={() => setActiveSession(session)}
                        className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl cursor-pointer transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Terminal size={120} />
                        </div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                session.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : 
                                session.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {session.difficulty}
                            </span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors relative z-10">
                            {session.title}
                        </h3>
                        <p className="text-slate-500 mb-8 leading-relaxed relative z-10">
                            {session.description}
                        </p>
                        
                        <div className="relative z-10 pt-6 border-t border-slate-100 flex justify-between items-center">
                             <div className="flex items-center space-x-2">
                                 {session.topology.map(node => (
                                     <div key={node.deviceId} className="bg-slate-100 p-1.5 rounded text-slate-500" title={node.label}>
                                         {node.icon === 'Router' && <Router size={14}/>}
                                         {node.icon === 'Switch' && <Box size={14}/>}
                                         {node.icon === 'Firewall' && <Shield size={14}/>}
                                         {node.icon === 'AccessPoint' && <Wifi size={14}/>}
                                     </div>
                                 ))}
                             </div>
                             <span className="text-blue-600 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                                Launch Lab <Play size={14} className="ml-1 fill-current" /> 
                             </span>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'theory': return <Theory />;
      case 'vendors': return <Vendors />;
      case 'labs': return <Labs />;
      case 'certifications': return <Certifications />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        toggleAiChat={() => setIsAiChatOpen(prev => !prev)}
    >
      {renderContent()}
      <AiTutor isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
    </Layout>
  );
};

export default App;
