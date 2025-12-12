

import React, { useState, useRef, useEffect } from 'react';
import { LabScenario, TerminalState, DeviceType } from '../types';
import { CheckCircle, Terminal as TerminalIcon, Monitor, Wifi, Shield, Globe, Settings, Save, RefreshCw } from 'lucide-react';

interface VirtualTerminalProps {
  scenario: LabScenario;
  onComplete: () => void;
}

const VirtualTerminal: React.FC<VirtualTerminalProps> = ({ scenario, onComplete }) => {
  const [viewMode, setViewMode] = useState<'CLI' | 'GUI'>('CLI');
  const [state, setState] = useState<TerminalState | null>(null);
  
  // CLI State
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // GUI State
  const [guiTab, setGuiTab] = useState('dashboard');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if(viewMode === 'CLI') bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state?.history, viewMode]);

  useEffect(() => {
    if (!scenario) return;
    
    const initial = JSON.parse(JSON.stringify(scenario.initialState));
    
    let bootMsg: string[] = [];
    if (scenario.vendor === 'Cisco') {
        bootMsg = ['Cisco IOS Software, Version 17.3.4', 'Press RETURN to get started!'];
    } else if (scenario.vendor === 'Juniper') {
        bootMsg = ['Junos OS 21.4R1.12', 'root@device% cli', '{master:0}'];
    } else if (scenario.vendor === 'Fortinet') {
        bootMsg = ['FortiGate-VM64 v7.2.0', 'Login: admin', 'Password:', 'Welcome!'];
    } else if (scenario.vendor === 'Palo Alto') {
        bootMsg = ['PA-VM', 'Welcome to PanOS', 'admin@PA-VM>'];
    }

    initial.history = [...bootMsg, ''];
    setState(initial);
    setIsSuccess(false);
    setInput('');
    setGuiTab('dashboard');
  }, [scenario]);

  const checkSuccess = (nextState: TerminalState) => {
      if (!isSuccess && scenario.validationRules(nextState)) {
          setIsSuccess(true);
          onComplete();
      }
  };

  // --- CLI LOGIC ---
  const getPrompt = () => {
    if (!state) return '>';
    if (scenario.vendor === 'Cisco') {
        const h = state.hostname;
        switch (state.mode) {
            case 'user': return `${h}>`;
            case 'priv': return `${h}#`;
            case 'config': return `${h}(config)#`;
            case 'config-if': return `${h}(config-if)#`;
            default: return '>';
        }
    }
    if (scenario.vendor === 'Juniper') return state.mode === 'user' ? `${state.hostname}>` : `${state.hostname}#`;
    if (scenario.vendor === 'Palo Alto') return state.mode === 'user' ? `${state.hostname}>` : `${state.hostname}#`;
    if (scenario.vendor === 'Fortinet') {
        const h = state.hostname;
        if (state.vendorContext && state.vendorContext.length > 0) {
            const last = state.vendorContext[state.vendorContext.length - 1];
            if (last.includes('interface')) return `${h} (interface) #`;
            if (last.includes('edit')) return `${h} (${last.split(' ')[1]}) #`;
            return `${h} (global) #`;
        }
        return `${h} #`;
    }
    return '>';
  };

  const processCommand = (cmd: string) => {
    if (!state) return;
    const cleanCmd = cmd.trim(); // Keep case for names
    const lowerCmd = cleanCmd.toLowerCase();
    
    const newHistory = [...state.history, `${getPrompt()} ${cleanCmd}`];
    let nextState = JSON.parse(JSON.stringify(state));
    let output: string | null = null;

    if (lowerCmd !== '') {
        // --- CISCO PARSER ---
        if (scenario.vendor === 'Cisco') {
             if (lowerCmd === 'exit') {
                if (state.mode === 'config-if') nextState.mode = 'config';
                else if (state.mode === 'config') nextState.mode = 'priv';
                else nextState.mode = 'user';
             }
             else if (state.mode === 'user' && lowerCmd.startsWith('en')) nextState.mode = 'priv';
             else if (state.mode === 'priv' && lowerCmd.startsWith('conf')) nextState.mode = 'config';
             else if (state.mode === 'priv' && lowerCmd.startsWith('wlan ')) { 
                 // Simple WLC logic
                 newHistory.push('WLAN Created.'); 
             }
             else if (state.mode === 'config') {
                  if (lowerCmd.startsWith('hostname ')) nextState.hostname = cleanCmd.split(' ')[1];
                  else if (lowerCmd.startsWith('int ')) {
                      const intName = cleanCmd.split(' ')[1];
                      if (!nextState.interfaces[intName]) nextState.interfaces[intName] = { name: intName, ip: '', mask: '', up: false };
                      nextState.mode = 'config-if';
                      nextState.context = intName;
                  }
             }
             else if (state.mode === 'config-if') {
                 if (lowerCmd.startsWith('ip addr')) {
                     const parts = cleanCmd.split(' ');
                     if(nextState.interfaces[nextState.context]) {
                         nextState.interfaces[nextState.context].ip = parts[2];
                         nextState.interfaces[nextState.context].mask = parts[3];
                     }
                 }
                 else if (lowerCmd === 'no shut') {
                      if(nextState.interfaces[nextState.context]) nextState.interfaces[nextState.context].up = true;
                 }
             }
        }
        // --- FORTINET PARSER ---
        else if (scenario.vendor === 'Fortinet') {
             if (!nextState.vendorContext) nextState.vendorContext = [];
             if (lowerCmd === 'end') nextState.vendorContext = [];
             else if (lowerCmd === 'next') nextState.vendorContext.pop();
             else if (nextState.vendorContext.length === 0 && lowerCmd === 'config system interface') nextState.vendorContext.push('config system interface');
             else if (nextState.vendorContext[0] === 'config system interface') {
                 if (lowerCmd.startsWith('edit ')) {
                     const port = cleanCmd.split(' ')[1];
                     nextState.vendorContext.push(`edit ${port}`);
                     nextState.context = port;
                 }
                 else if (lowerCmd.startsWith('set ip ')) {
                     const parts = cleanCmd.split(' ');
                     if (nextState.interfaces[nextState.context]) {
                         nextState.interfaces[nextState.context].ip = parts[2];
                         nextState.interfaces[nextState.context].mask = parts[3];
                     }
                 }
                 else if (lowerCmd.startsWith('set alias ')) {
                      // Just mock support
                 }
             }
        }
        // --- JUNIPER PARSER ---
        else if (scenario.vendor === 'Juniper') {
             if (lowerCmd === 'configure') nextState.mode = 'priv';
             else if (lowerCmd === 'commit') {
                 if (nextState.candidateConfig) {
                     if (nextState.candidateConfig.interfaces) {
                         nextState.interfaces = { ...nextState.interfaces, ...nextState.candidateConfig.interfaces };
                     }
                 }
                 nextState.candidateConfig = {};
                 output = 'Commit complete.';
             }
             else if (lowerCmd.startsWith('set interfaces ')) {
                 // set interfaces ge-0/0/0 unit 0 family inet address 10.1.1.1/24
                 const parts = cleanCmd.split(' ');
                 const intName = parts[2];
                 const ipCidr = parts[parts.length - 1]; // simplified
                 const [ip] = ipCidr.split('/');
                 
                 const candInts = { ...nextState.candidateConfig?.interfaces };
                 if (!candInts[intName]) candInts[intName] = { ...state.interfaces[intName] || { name: intName, ip: '', up: true} };
                 candInts[intName].ip = ip;
                 nextState.candidateConfig = { ...nextState.candidateConfig, interfaces: candInts };
             }
             else if (lowerCmd.startsWith('set security zones security-zone ')) {
                 // set security zones security-zone TRUST interfaces ge-0/0/0.0
                 const parts = cleanCmd.split(' ');
                 const zone = parts[4];
                 const intRaw = parts[6];
                 const intName = intRaw.split('.')[0];

                 const candInts = { ...nextState.candidateConfig?.interfaces };
                 if (!candInts[intName]) candInts[intName] = { ...state.interfaces[intName] || { name: intName, ip: '', up: true} };
                 candInts[intName].securityZone = zone;
                 nextState.candidateConfig = { ...nextState.candidateConfig, interfaces: candInts };
             }
        }
    }

    if (output) newHistory.push(output);
    nextState.history = newHistory;
    setState(nextState);
    checkSuccess(nextState);
  };

  // --- GUI LOGIC ---

  const handleGuiUpdate = (updates: Partial<TerminalState>) => {
      // Helper to merge state from GUI actions
      const nextState = JSON.parse(JSON.stringify(state));
      // Shallow merge for top level, deep merge needs care. Here we assume specific updates
      if (updates.interfaces) {
          nextState.interfaces = { ...nextState.interfaces, ...updates.interfaces };
      }
      // Log action to history for realism
      nextState.history.push('GUI: Configuration updated via Web Interface.');
      setState(nextState);
      checkSuccess(nextState);
  };

  const DeviceWebUI = () => {
     if (!state) return null;

     // Vendor Specific Styles
     const theme = {
         Cisco: 'bg-blue-600',
         Juniper: 'bg-slate-800', // J-Web dark
         Fortinet: 'bg-teal-700', // FortiOS Green
         'Palo Alto': 'bg-[#f0f0f0] border-t-4 border-yellow-500', // PAN-OS
         Aruba: 'bg-orange-600'
     }[scenario.vendor] || 'bg-slate-700';

     return (
         <div className="flex flex-col h-full bg-slate-100 text-slate-800 font-sans">
             {/* Header */}
             <div className={`${theme} text-white px-4 py-2 flex justify-between items-center shadow-md`}>
                 <div className="font-bold text-lg flex items-center space-x-2">
                    {scenario.vendor === 'Fortinet' && <Shield size={18}/>}
                    {scenario.vendor === 'Cisco' && <Globe size={18}/>}
                    <span>{state.hostname} — Web Management</span>
                 </div>
                 <div className="text-xs opacity-80">Admin | Logout</div>
             </div>

             <div className="flex flex-1 overflow-hidden">
                 {/* Sidebar */}
                 <div className="w-48 bg-white border-r border-slate-300 flex flex-col">
                     <button onClick={() => setGuiTab('dashboard')} className={`p-3 text-left hover:bg-slate-100 flex items-center ${guiTab === 'dashboard' ? 'bg-slate-200 font-bold border-l-4 border-blue-500' : ''}`}>
                         <Monitor size={16} className="mr-2"/> Dashboard
                     </button>
                     <button onClick={() => setGuiTab('network')} className={`p-3 text-left hover:bg-slate-100 flex items-center ${guiTab === 'network' ? 'bg-slate-200 font-bold border-l-4 border-blue-500' : ''}`}>
                         <Settings size={16} className="mr-2"/> Network
                     </button>
                     {scenario.deviceType === 'WLC' && (
                        <button onClick={() => setGuiTab('wireless')} className={`p-3 text-left hover:bg-slate-100 flex items-center ${guiTab === 'wireless' ? 'bg-slate-200 font-bold border-l-4 border-blue-500' : ''}`}>
                             <Wifi size={16} className="mr-2"/> Wireless
                        </button>
                     )}
                 </div>

                 {/* Main Area */}
                 <div className="flex-1 p-6 overflow-y-auto">
                     {guiTab === 'dashboard' && (
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white p-4 rounded shadow border border-slate-200">
                                 <h3 className="font-bold text-slate-500 text-xs uppercase mb-2">System Information</h3>
                                 <div className="text-sm">
                                     <div className="flex justify-between py-1 border-b border-slate-100"><span>Hostname:</span> <span className="font-mono">{state.hostname}</span></div>
                                     <div className="flex justify-between py-1 border-b border-slate-100"><span>Firmware:</span> <span>v7.2 (Stable)</span></div>
                                     <div className="flex justify-between py-1"><span>Uptime:</span> <span>02:14:55</span></div>
                                 </div>
                             </div>
                             <div className="bg-white p-4 rounded shadow border border-slate-200">
                                 <h3 className="font-bold text-slate-500 text-xs uppercase mb-2">Interface Status</h3>
                                 <div className="space-y-2">
                                     {Object.values(state.interfaces).map(int => (
                                         <div key={int.name} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded">
                                             <span className="font-mono">{int.name}</span>
                                             <span className={`px-2 py-0.5 rounded text-xs text-white ${int.up ? 'bg-green-500' : 'bg-red-400'}`}>
                                                 {int.up ? 'UP' : 'DOWN'}
                                             </span>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                     )}

                     {guiTab === 'network' && (
                         <div className="bg-white rounded shadow border border-slate-200 overflow-hidden">
                             <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-sm">Interface Configuration</div>
                             <table className="w-full text-sm text-left">
                                 <thead className="bg-slate-100 text-slate-500 font-semibold">
                                     <tr>
                                         <th className="p-3">Name</th>
                                         <th className="p-3">IP Address</th>
                                         <th className="p-3">Zone/VLAN</th>
                                         <th className="p-3">Actions</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {Object.values(state.interfaces).map(int => (
                                         <tr key={int.name} className="border-t border-slate-100 hover:bg-slate-50">
                                             <td className="p-3 font-mono font-bold text-blue-600">{int.name}</td>
                                             <td className="p-3">
                                                 <input 
                                                    type="text" 
                                                    defaultValue={int.ip} 
                                                    className="border border-slate-300 rounded px-2 py-1 w-32 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    onBlur={(e) => {
                                                        const newVal = e.target.value;
                                                        if (newVal !== int.ip) {
                                                            handleGuiUpdate({ 
                                                                interfaces: { [int.name]: { ...int, ip: newVal, up: true } }
                                                            });
                                                        }
                                                    }}
                                                 />
                                             </td>
                                             <td className="p-3">
                                                 {scenario.vendor === 'Juniper' ? (
                                                     <select 
                                                        className="border border-slate-300 rounded px-2 py-1"
                                                        defaultValue={int.securityZone || 'None'}
                                                        onChange={(e) => {
                                                            handleGuiUpdate({
                                                                interfaces: { [int.name]: { ...int, securityZone: e.target.value } }
                                                            })
                                                        }}
                                                     >
                                                         <option value="None">None</option>
                                                         <option value="TRUST">TRUST</option>
                                                         <option value="UNTRUST">UNTRUST</option>
                                                     </select>
                                                 ) : (
                                                     <span className="text-slate-400">—</span>
                                                 )}
                                             </td>
                                             <td className="p-3">
                                                 <button className="text-blue-600 hover:underline">Edit</button>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                             {scenario.vendor === 'Juniper' && (
                                 <div className="p-3 bg-yellow-50 border-t border-yellow-100 text-xs text-yellow-800 flex justify-between items-center">
                                     <span>Configuration changes are pending.</span>
                                     <button 
                                        onClick={() => {
                                            if (scenario.vendor === 'Juniper') {
                                                // Simulate commit logic simply by ensuring state is "saved" in our model
                                                setState(prev => ({...prev!, history: [...prev!.history, 'GUI: Commit Successful']}));
                                            }
                                        }}
                                        className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                                     >
                                         Commit
                                     </button>
                                 </div>
                             )}
                         </div>
                     )}
                 </div>
             </div>
         </div>
     )
  }

  // --- RENDER WRAPPER ---
  
  if (!state) return <div className="p-4 bg-slate-900 text-white">Loading Simulator...</div>;

  return (
    <div className="flex flex-col h-[600px] w-full rounded-lg overflow-hidden border border-slate-300 shadow-2xl">
        {/* Toggle Bar */}
        <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => setViewMode('CLI')}
                    className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${viewMode === 'CLI' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
                >
                    <TerminalIcon size={14} className="mr-2" /> Console (CLI)
                </button>
                <button 
                    onClick={() => setViewMode('GUI')}
                    className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${viewMode === 'GUI' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
                >
                    <Monitor size={14} className="mr-2" /> Web Interface (GUI)
                </button>
            </div>
            
            {isSuccess && (
                <div className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    <CheckCircle size={12} className="mr-1" />
                    Lab Complete
                </div>
            )}
        </div>

        {viewMode === 'CLI' ? (
            <div className="flex-1 bg-[#1e1e1e] font-mono text-sm p-4 overflow-y-auto" onClick={() => inputRef.current?.focus()}>
                {state.history.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap break-all text-slate-300 leading-tight">{line}</div>
                ))}
                <div className="flex items-center text-slate-300">
                    <span className="mr-2 whitespace-nowrap">{getPrompt()}</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') { processCommand(input); setInput(''); }}}
                        className="flex-1 bg-transparent border-none outline-none text-slate-300 p-0 m-0"
                        autoFocus
                    />
                </div>
                <div ref={bottomRef} />
            </div>
        ) : (
            <div className="flex-1 bg-white relative">
                <DeviceWebUI />
            </div>
        )}
    </div>
  );
};

export default VirtualTerminal;