import React from 'react';
import { CERTIFICATIONS, VENDORS } from '../constants';
import { Award, TrendingUp } from 'lucide-react';

const Certifications = () => {
  // Prepare data for chart
  const chartData = CERTIFICATIONS.map(cert => ({
    name: cert.name.split(' ')[0], // Short name
    fullName: cert.name,
    cost: cert.costInr,
  })).sort((a, b) => a.cost - b.cost);

  const maxCost = Math.max(...chartData.map(d => d.cost));

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
            <h2 className="text-3xl font-bold mb-2">Certification Roadmap</h2>
            <p className="text-blue-100 max-w-2xl">
                Navigating the certification landscape can be confusing. Here is a breakdown of entry-level and associate certifications, including estimated exam costs in INR.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Custom CSS Bar Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-6">
                    <TrendingUp className="text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-800">Cost Comparison (₹)</h3>
                </div>
                <div className="space-y-4">
                    {chartData.map((data, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                            <div className="w-24 font-medium text-slate-600 truncate mr-3 text-right" title={data.fullName}>
                                {data.name}
                            </div>
                            <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden relative group">
                                <div 
                                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-3 hover:bg-indigo-500"
                                    style={{ width: `${(data.cost / maxCost) * 100}%` }}
                                >
                                    <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        ₹{data.cost.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end text-xs text-slate-400 mt-2">
                        <span>* Estimated exam fees</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-6">
                    <Award className="text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-800">Quick Stats</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <span className="text-slate-600 text-sm">Most Popular</span>
                        <span className="font-bold text-slate-800">Cisco CCNA</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <span className="text-slate-600 text-sm">Lowest Cost Entry</span>
                        <span className="font-bold text-slate-800">Palo Alto PCNSE (varies)</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <span className="text-slate-600 text-sm">Average Associate Cost</span>
                        <span className="font-bold text-slate-800">₹22,500</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {CERTIFICATIONS.map(cert => {
                const vendor = VENDORS.find(v => v.id === cert.vendorId);
                return (
                    <div key={cert.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            {vendor && <img src={vendor.logo} alt={vendor.name} className="h-10 w-10 object-contain" />}
                            <div>
                                <h4 className="font-bold text-slate-800 text-lg">{cert.name}</h4>
                                <div className="flex items-center space-x-2 text-sm text-slate-500">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium uppercase">{cert.level}</span>
                                    <span>•</span>
                                    <span>Exam: {cert.examCode}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end md:space-x-8">
                             <div className="text-right">
                                 <p className="text-xs text-slate-400 uppercase font-semibold">Estimated Cost</p>
                                 <p className="font-bold text-slate-800 text-xl">₹{cert.costInr.toLocaleString()}</p>
                             </div>
                             <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                 Details
                             </button>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default Certifications;