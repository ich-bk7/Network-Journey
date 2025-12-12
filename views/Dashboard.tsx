import React from 'react';
import { BookOpen, Server, Terminal, Award, ArrowRight } from 'lucide-react';
import { THEORY_TOPICS, VENDORS } from '../constants';

interface DashboardProps {
    setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 md:p-12 text-center md:text-left shadow-xl">
            <div className="relative z-10 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Start Your <span className="text-blue-400">Network Engineering</span> Journey
                </h1>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                    From "What is an IP?" to configuring OSPF on enterprise gear. 
                    Vendor-agnostic theory meets practical, hands-on guides for Cisco, Juniper, and more.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <button 
                        onClick={() => setActiveTab('theory')}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
                    >
                        Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                    <button 
                        onClick={() => setActiveTab('vendors')}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all border border-slate-700 flex items-center justify-center"
                    >
                        Browse Vendors
                    </button>
                </div>
            </div>
            
            {/* Abstract Decorative Background */}
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 pointer-events-none hidden md:block">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                    <path fill="#3B82F6" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.2C93.5,8.9,82.2,22.1,70.6,33.1C59,44.1,47.1,52.9,34.8,60.2C22.5,67.5,9.8,73.3,-1.8,76.4C-13.4,79.5,-25.5,79.9,-36.4,73.6C-47.3,67.3,-57,54.3,-65.4,40.7C-73.8,27.1,-80.9,12.9,-80.3,-0.9C-79.7,-14.7,-71.4,-28.1,-61.2,-39.8C-51,-51.5,-38.9,-61.5,-26.1,-69.5C-13.3,-77.5,0.2,-83.5,13.7,-83.4C27.2,-83.3,53.8,-77.1,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div onClick={() => setActiveTab('theory')} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Networking 101</h3>
                <p className="text-sm text-slate-500">Master the OSI model, subnetting, and core theory.</p>
            </div>

            <div onClick={() => setActiveTab('vendors')} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group">
                <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Server className="text-indigo-600 h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Vendor Hub</h3>
                <p className="text-sm text-slate-500">Cisco, Juniper, Fortinet guides with CLI & GUI.</p>
            </div>

            <div onClick={() => setActiveTab('labs')} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group">
                <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Terminal className="text-purple-600 h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Virtual Labs</h3>
                <p className="text-sm text-slate-500">Practice safely with simulators like GNS3 and EVE-NG.</p>
            </div>

            <div onClick={() => setActiveTab('certifications')} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-green-200 hover:shadow-md transition-all cursor-pointer group">
                <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Award className="text-green-600 h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Career Path</h3>
                <p className="text-sm text-slate-500">Roadmaps and costs for top industry certifications.</p>
            </div>
        </div>

        {/* Recent Updates / Content Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 text-lg mb-4">Popular Topics</h3>
                <div className="space-y-4">
                    {THEORY_TOPICS.slice(0, 3).map(topic => (
                        <div key={topic.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setActiveTab('theory')}>
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                                    {topic.title.substring(0,1)}
                                </span>
                                <div>
                                    <p className="font-medium text-slate-800 text-sm">{topic.title}</p>
                                    <p className="text-xs text-slate-500">{topic.difficulty}</p>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-300" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                 <h3 className="font-bold text-slate-800 text-lg mb-4">Supported Vendors</h3>
                 <div className="flex flex-wrap gap-4">
                     {VENDORS.map(vendor => (
                         <div key={vendor.id} className="flex items-center space-x-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg" onClick={() => setActiveTab('vendors')}>
                             <img src={vendor.logo} alt="" className="h-4 w-4 object-contain" />
                             <span className="text-sm font-medium text-slate-700">{vendor.name}</span>
                         </div>
                     ))}
                 </div>
                 <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
                     <p className="text-indigo-800 text-sm font-medium mb-1">Need help?</p>
                     <p className="text-indigo-600 text-xs">Use the AI Tutor button in the sidebar to ask questions anytime.</p>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
