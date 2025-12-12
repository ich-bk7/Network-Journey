

import React, { useState, useMemo } from 'react';
import { VENDORS, VENDOR_GUIDES } from '../constants';
import { VendorGuide, ConfigType } from '../types';
import { Terminal, Monitor, ChevronRight, Copy, BookOpen, Settings } from 'lucide-react';

// A generic schematic component to represent Vendor GUIs without external images
const GuiMockup = ({ vendorId, context }: { vendorId: string, context?: string }) => {
    // Styles
    const styles = {
        cisco: { header: 'bg-blue-800', sidebar: 'bg-slate-100', accent: 'bg-blue-600' },
        juniper: { header: 'bg-slate-800', sidebar: 'bg-slate-50', accent: 'bg-yellow-600' },
        fortinet: { header: 'bg-teal-700', sidebar: 'bg-slate-800', accent: 'bg-teal-600' },
        paloalto: { header: 'bg-slate-100 border-b-2 border-yellow-500', sidebar: 'bg-slate-800', accent: 'bg-slate-600' },
        aruba: { header: 'bg-orange-600', sidebar: 'bg-slate-900', accent: 'bg-orange-500' },
        extreme: { header: 'bg-purple-700', sidebar: 'bg-slate-100', accent: 'bg-purple-600' }
    };
    
    const s = styles[vendorId as keyof typeof styles] || styles.cisco;
    const isPalo = vendorId === 'paloalto';

    return (
        <div className="w-full aspect-video bg-white rounded-lg overflow-hidden border border-slate-200 shadow-md flex flex-col font-sans text-xs select-none">
            {/* Fake Browser Bar */}
            <div className="bg-slate-200 h-6 flex items-center px-2 space-x-1 border-b border-slate-300">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <div className="ml-4 bg-white px-2 rounded w-1/2 text-[9px] text-slate-400">https://192.168.1.1/admin</div>
            </div>

            {/* GUI Header */}
            <div className={`${s.header} ${isPalo ? 'text-slate-700' : 'text-white'} h-10 flex items-center justify-between px-4`}>
                <span className="font-bold uppercase tracking-wider">{vendorId} WebUI</span>
                <span className="opacity-75">admin</span>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className={`${s.sidebar} w-1/4 p-2 flex flex-col space-y-1`}>
                    <div className="h-4 bg-slate-300/50 rounded w-3/4 mb-2"></div>
                    <div className={`h-6 rounded px-2 flex items-center ${context === 'interface' ? 'bg-slate-300' : ''} text-slate-600 font-bold`}>
                        {context === 'interface' ? '> Network' : 'Network'}
                    </div>
                     <div className={`h-6 rounded px-2 flex items-center ${context === 'policy' ? 'bg-slate-300' : ''} text-slate-600 font-bold`}>
                        {context === 'policy' ? '> Policy' : 'Policy'}
                    </div>
                     <div className={`h-6 rounded px-2 flex items-center ${context === 'routing' ? 'bg-slate-300' : ''} text-slate-600 font-bold`}>
                        {context === 'routing' ? '> Routing' : 'System'}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-slate-50 p-4">
                    <div className="bg-white border border-slate-200 rounded shadow-sm h-full p-4">
                        <div className="h-6 border-b border-slate-100 mb-4 font-bold text-slate-700 flex items-center">
                            <Settings size={12} className="mr-2"/> 
                            {context === 'interface' ? 'Interface Configuration' : context === 'policy' ? 'Security Policy' : 'System Settings'}
                        </div>
                        
                        <div className="space-y-3">
                            {/* Fake Forms */}
                            <div className="flex items-center">
                                <div className="w-24 text-slate-500 text-[10px] uppercase font-bold">Name</div>
                                <div className="flex-1 h-6 border border-slate-300 rounded bg-slate-50"></div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-24 text-slate-500 text-[10px] uppercase font-bold">IP Address</div>
                                <div className="w-32 h-6 border border-slate-300 rounded bg-slate-50"></div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-24 text-slate-500 text-[10px] uppercase font-bold">Zone</div>
                                <div className="w-24 h-6 border border-slate-300 rounded bg-slate-50"></div>
                            </div>
                            
                            <div className="pt-4 flex justify-end">
                                <div className={`${s.accent} text-white px-4 py-1 rounded shadow-sm`}>OK</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Vendors = () => {
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<VendorGuide | null>(null);
  const [configType, setConfigType] = useState<ConfigType>(ConfigType.CLI);
  const [activeSection, setActiveSection] = useState(0);

  const activeVendor = useMemo(() => VENDORS.find(v => v.id === selectedVendorId), [selectedVendorId]);
  const availableGuides = useMemo(() => VENDOR_GUIDES.filter(g => g.vendorId === selectedVendorId), [selectedVendorId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (selectedGuide && activeVendor) {
      const currentSection = selectedGuide.sections[activeSection];

      return (
          <div className="animate-fade-in max-w-7xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
             <div className="flex items-center justify-between mb-6 shrink-0">
                <button 
                    onClick={() => { setSelectedGuide(null); setActiveSection(0); }}
                    className="flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                >
                    ← Back to {activeVendor.name}
                </button>
                <div className="flex bg-white border border-slate-200 p-1 rounded-lg">
                    <button
                        onClick={() => setConfigType(ConfigType.CLI)}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            configType === ConfigType.CLI 
                                ? 'bg-slate-900 text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Terminal className="w-4 h-4 mr-2" /> CLI
                    </button>
                    <button
                            onClick={() => setConfigType(ConfigType.GUI)}
                            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            configType === ConfigType.GUI 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Monitor className="w-4 h-4 mr-2" /> GUI
                    </button>
                </div>
             </div>

             <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-0">
                 {/* Navigation Sidebar */}
                 <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 flex flex-col h-full overflow-hidden shrink-0">
                    <div className="p-6 border-b border-slate-200 bg-white shrink-0">
                        <div className="flex items-center space-x-3 mb-2">
                             <img src={activeVendor.logo} alt={activeVendor.name} className="h-6 w-auto object-contain" />
                        </div>
                        <h2 className="font-bold text-slate-800 text-lg leading-tight mb-1">{selectedGuide.title}</h2>
                        <p className="text-xs text-slate-500">{selectedGuide.description}</p>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-1">
                        {selectedGuide.sections.map((sec, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveSection(idx)}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all flex items-start ${
                                    activeSection === idx 
                                        ? 'bg-white shadow-sm text-blue-600 font-medium border border-slate-200' 
                                        : 'text-slate-600 hover:bg-slate-200/50'
                                }`}
                            >
                                <span className="mr-3 text-xs font-bold text-slate-400 mt-0.5 w-5">{String(idx + 1).padStart(2, '0')}</span>
                                <span className="truncate">{sec.title}</span>
                            </button>
                        ))}
                    </div>
                 </div>

                 {/* Content Area */}
                 <div className="flex-1 overflow-y-auto bg-slate-50">
                    <div className="p-8 max-w-4xl mx-auto">
                        <div className="flex items-center space-x-2 mb-6">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase tracking-wide">
                                Topic {activeSection + 1}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-8">{currentSection.title}</h3>

                        {configType === ConfigType.CLI ? (
                            <div className="relative group rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900">
                                <div className="bg-[#2d2d2d] px-4 py-3 flex justify-between items-center border-b border-slate-700">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(currentSection.cliCommands)}
                                        className="text-slate-400 hover:text-white transition-colors flex items-center text-xs uppercase font-bold tracking-wider"
                                    >
                                        <Copy size={14} className="mr-1" /> Copy Config
                                    </button>
                                </div>
                                <pre className="p-6 overflow-x-auto font-mono text-sm leading-relaxed text-slate-300 selection:bg-blue-500/30 min-h-[400px]">
                                    {currentSection.cliCommands}
                                </pre>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-xl text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
                                        <Monitor className="mr-3 text-blue-600" size={24}/> 
                                        Step-by-Step Configuration
                                    </h4>
                                    <div className="space-y-6">
                                        {currentSection.guiSteps.length > 0 ? currentSection.guiSteps.map((step, idx) => (
                                            <div key={idx} className="flex items-start group">
                                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm mr-4 border border-indigo-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    {idx + 1}
                                                </div>
                                                <p className="mt-1 text-slate-700 leading-relaxed font-medium">{step}</p>
                                            </div>
                                        )) : (
                                            <div className="flex flex-col items-center justify-center h-24 text-slate-400">
                                                <p>No specific GUI steps provided for this task.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* CSS-based GUI Mockup (No Images) */}
                                <div className="mt-8">
                                    <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">Interface Preview</h4>
                                    <GuiMockup vendorId={activeVendor.id} context={currentSection.guiContext} />
                                </div>
                            </div>
                        )}
                    </div>
                 </div>
             </div>
          </div>
      )
  }

  // Vendor Selection
  if (activeVendor) {
      return (
          <div className="animate-fade-in max-w-6xl mx-auto">
             <button 
                onClick={() => setSelectedVendorId(null)}
                className="mb-6 flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors"
             >
                ← Return to Vendor List
             </button>
             
             <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <img src={activeVendor.logo} alt={activeVendor.name} className="h-16 w-32 object-contain" />
                 </div>
                 <div>
                     <h2 className="text-3xl font-bold text-slate-800">{activeVendor.name}</h2>
                     <p className="text-slate-500 text-lg mt-2 max-w-2xl">{activeVendor.description}</p>
                 </div>
             </div>

             <h3 className="text-lg font-bold text-slate-700 mb-4">Available Configuration Guides</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {availableGuides.map(guide => (
                     <div 
                        key={guide.id}
                        onClick={() => setSelectedGuide(guide)}
                        className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-lg cursor-pointer transition-all group flex flex-col h-full"
                     >
                         <div className="flex justify-between items-start mb-4">
                             <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                 <BookOpen size={24} />
                             </div>
                             <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                 guide.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : 
                                 guide.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                             }`}>
                                 {guide.difficulty}
                             </span>
                         </div>
                         <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{guide.title}</h3>
                         <p className="text-slate-500 text-sm mb-6 flex-grow">{guide.description}</p>
                         <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                             <div className="text-xs text-slate-400 font-mono">
                                 {guide.sections.length} Topics
                             </div>
                             <div className="flex items-center text-blue-600 text-sm font-bold">
                                 Start <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform"/>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
          </div>
      )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {VENDORS.map(vendor => (
            <div 
                key={vendor.id}
                onClick={() => setSelectedVendorId(vendor.id)}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center text-center h-full group"
            >
                <div className="h-32 w-full flex items-center justify-center mb-6 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors p-4">
                    <img src={vendor.logo} alt={vendor.name} className="max-h-16 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{vendor.name}</h3>
                <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">{vendor.description}</p>
                <div className="w-full pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-medium text-slate-400">
                    <span className="bg-slate-100 px-2 py-1 rounded">CLI: {vendor.primaryCli}</span>
                    <span className="text-blue-600 flex items-center font-bold group-hover:underline">
                        Explore <ChevronRight size={14} className="ml-1" />
                    </span>
                </div>
            </div>
        ))}
    </div>
  );
};

export default Vendors;
