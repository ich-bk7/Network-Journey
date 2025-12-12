import React, { useState } from 'react';
import { Menu, Search, BookOpen, Server, Award, Terminal, X, MessageCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleAiChat: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, toggleAiChat }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Server className="text-white h-5 w-5" />
          </div>
          <span className="font-bold text-xl text-slate-800">Net-Start</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Server className="text-white h-6 w-6" />
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight">Net-Start</span>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem id="dashboard" label="Dashboard" icon={Menu} />
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Learning
          </div>
          <NavItem id="theory" label="Networking 101" icon={BookOpen} />
          <NavItem id="vendors" label="Vendor Guides" icon={Server} />
          <NavItem id="labs" label="Virtual Labs" icon={Terminal} />
          
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Career
          </div>
          <NavItem id="certifications" label="Certifications" icon={Award} />
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 bg-slate-50">
             <button 
                onClick={toggleAiChat}
                className="flex items-center justify-center space-x-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg shadow-sm transition-all"
             >
                 <MessageCircle size={18} />
                 <span>Ask AI Tutor</span>
             </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
             <h1 className="text-xl font-bold text-slate-800 capitalize">
                 {activeTab.replace('-', ' ')}
             </h1>
             <div className="hidden md:flex items-center relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input 
                    type="text" 
                    placeholder="Search topics, vendors..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
             </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
