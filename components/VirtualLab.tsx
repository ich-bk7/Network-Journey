
import React, { useState, useRef, useEffect } from 'react';
import { LabSession, DeviceState } from '../types';
import { Terminal, Monitor, Wifi, Shield, Box, Router as RouterIcon, Activity, Layout, HelpCircle, Cloud, FileText, ChevronUp, ChevronDown, Settings, List } from 'lucide-react';

interface VirtualLabProps {
  session: LabSession;
  onExit: () => void;
}

const VirtualLab: React.FC<VirtualLabProps> = ({ session, onExit }) => {
  // Master State: Holds the configuration of ALL devices in the topology
  const [labState, setLabState] = useState<Record<string, DeviceState>>(session.devices);
  const [activeDeviceId, setActiveDeviceId] = useState<string>(session.topology.find(t => t.icon === 'Firewall')?.deviceId || Object.keys(session.devices)[0]); 
  const [viewMode, setViewMode] = useState<'CLI' | 'GUI' | 'DOCS'>('CLI');
  const [cliInput, setCliInput] = useState('');
  const [isTopologyCollapsed, setIsTopologyCollapsed] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const cliInputRef = useRef<HTMLInputElement>(null);
  const activeDevice = labState[activeDeviceId];

  // Auto-scroll CLI
  useEffect(() => {
    if(viewMode === 'CLI') bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeDevice?.history, viewMode]);

  // Focus input on click
  const focusCli = () => cliInputRef.current?.focus();

  // --- HELPER: Command Registry ---
  const getDeviceCommands = (vendor: string): Record<string, string[]> => {
      if (['Cisco', 'Aruba', 'Extreme'].includes(vendor)) {
          return {
              'User Mode': ['enable', 'ping', 'traceroute', 'show version', 'show clock', 'show history', 'show inventory', 'show users', 'show sessions', 'show ssh', 'show flash', 'show file systems'],
              'Privileged Mode': ['configure terminal', 'write', 'copy run start', 'reload', 'debug ip packet', 'undebug all', 'clear counters', 'clear arp', 'clear logging', 'delete nvram:startup-config'],
              'Show Configuration': ['show running-config', 'show startup-config', 'show interfaces', 'show ip interface brief', 'show ip route', 'show protocols'],
              'Show Layer 2': ['show vlan brief', 'show mac address-table', 'show spanning-tree', 'show etherchannel summary', 'show cdp neighbors', 'show cdp neighbors detail', 'show lldp neighbors', 'show lldp neighbors detail'],
              'Show Layer 3/Routing': ['show ip protocols', 'show ip ospf neighbor', 'show ip ospf interface', 'show bgp summary', 'show bgp all', 'show ip nat translations', 'show ip nat statistics'],
              'Show Security': ['show access-lists', 'show crypto isakmp sa', 'show crypto ipsec sa', 'show port-security'],
              'Show System/Hardware': ['show environment', 'show power inline', 'show processes cpu', 'show memory', 'show logging', 'show controllers', 'show tech-support', 'show diag']
          };
      } else if (vendor === 'Juniper') {
          return {
              'Operational': ['configure', 'show interfaces terse', 'show interfaces extensive', 'show route', 'show route summary', 'show configuration', 'request system reboot', 'request system halt', 'monitor traffic', 'ping', 'traceroute', 'clear interface statistics'],
              'Show System': ['show version', 'show system uptime', 'show system storage', 'show system processes', 'show chassis hardware', 'show chassis routing-engine', 'show chassis alarms', 'show chassis environment'],
              'Show Routing/Proto': ['show arp', 'show lldp neighbors', 'show ospf neighbor', 'show ospf interface', 'show bgp summary', 'show bgp neighbor', 'show route protocol ospf', 'show route protocol bgp'],
              'Show Security': ['show security policies', 'show security zones', 'show security flow session', 'show security nat source rule'],
              'Logs': ['show log messages', 'show cli history', 'clear log messages'],
              'Configuration': ['edit', 'set interfaces', 'set security zones', 'delete', 'commit', 'exit']
          };
      } else if (vendor === 'Fortinet') {
          return {
              'Execute': ['execute ping', 'execute ssh', 'execute telnet', 'execute reboot', 'execute ping-options', 'execute factoryreset', 'execute backup config'],
              'Get System': ['get system status', 'get system performance status', 'get system interface', 'get system arp', 'get hardware status', 'get hardware cpu', 'get hardware memory'],
              'Get Router': ['get router info routing-table all', 'get router info ospf neighbor', 'get router info bgp summary', 'get router info kernel'],
              'Diagnose': ['diagnose sys session list', 'diagnose sys top', 'diagnose hardware deviceinfo nic', 'diagnose debug enable', 'diagnose debug flow trace'],
              'Show / Config': ['show firewall policy', 'show system dns', 'show vpn ipsec tunnel summary', 'config system interface', 'config firewall policy', 'config router static', 'show full-configuration']
          };
      } else if (vendor === 'Palo Alto') {
          return {
              'Operational': ['show system info', 'show system resources', 'show system statistics', 'show system state', 'request system restart', 'request shutdown', 'ping', 'test security-policy-match', 'debug dataplane packet-diag'],
              'Show Network': ['show interface all', 'show interface logical', 'show interface hardware', 'show arp all', 'show routing route', 'show high-availability all'],
              'Show Session/User': ['show session all', 'show session info', 'show session meter', 'show jobs all', 'show admins', 'show user ip-user-mapping all'],
              'Show Config': ['show running security-policy', 'show running nat-policy', 'show counter global', 'show config running', 'show config candidate'],
              'Configuration': ['configure', 'set network interface', 'set network zone', 'commit', 'exit', 'load config from']
          };
      }
      return {};
  };

  // --- HELPER: Dynamic Neighbor Discovery ---
  const findNeighbors = (currentDev: DeviceState, type: 'ARP' | 'CDP') => {
      const neighbors: string[] = [];
      const currentInts = Object.values(currentDev.interfaces).filter(i => i.ip && i.up);

      currentInts.forEach(myInt => {
          if (!myInt.ip) return;
          const mySubnet = myInt.ip.split('.').slice(0, 3).join('.');
          
          Object.values(labState).forEach(otherDev => {
              if (otherDev.id === currentDev.id) return;
              Object.values(otherDev.interfaces).forEach(otherInt => {
                  if (otherInt.ip && otherInt.up && otherInt.ip.startsWith(mySubnet)) {
                      if (type === 'ARP') {
                          const mac = `00${otherDev.id.slice(-2)}:${otherDev.id.slice(0,2)}:5e:${otherInt.ip.split('.')[3]}`;
                          neighbors.push(`${otherInt.ip.padEnd(15)} ${'00:05:00'.padEnd(9)} ${mac.padEnd(16)} ARPA   ${myInt.name}`);
                      } else {
                          neighbors.push(`${otherDev.name.padEnd(20)} ${myInt.name.padEnd(15)} 150       R S I    ${otherDev.type.padEnd(10)} ${otherInt.name}`);
                      }
                  }
              });
          });
      });
      return neighbors;
  };

  // --- TOPOLOGY MAP (WITH VISUAL CONNECTIONS) ---
  const TopologyView = () => (
      <div className={`bg-slate-900 border-b border-slate-700 transition-all duration-300 flex flex-col relative shrink-0 ${isTopologyCollapsed ? 'h-12' : 'h-64 py-6'}`}>
          <button 
            onClick={() => setIsTopologyCollapsed(!isTopologyCollapsed)}
            className="absolute top-2 right-4 text-slate-500 hover:text-white z-20"
          >
            {isTopologyCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
          
          {isTopologyCollapsed ? (
              <div className="flex items-center px-6 h-full text-slate-400 text-sm">
                  <span className="font-bold mr-4">Topology Hidden</span>
                  <div className="flex space-x-2">
                      {session.topology.map(node => (
                          <div key={node.deviceId} className={`w-2 h-2 rounded-full ${activeDeviceId === node.deviceId ? 'bg-blue-500' : 'bg-slate-600'}`} />
                      ))}
                  </div>
              </div>
          ) : (
            <div className="relative w-full h-full overflow-x-auto flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center min-w-[800px]">
                    {/* SVG Layer for Connections */}
                    <svg className="w-full h-full absolute top-0 left-0 pointer-events-none">
                        {/* Define connections based on SOW sequence: Client -> Switch -> Router -> Firewall -> ISP */}
                        <defs>
                             <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill="#475569" />
                             </marker>
                        </defs>
                        {/* Line: Client to Switch */}
                        <line x1="100" y1="75" x2="300" y2="75" stroke="#475569" strokeWidth="2" />
                        <text x="110" y="65" fill="#94a3b8" fontSize="10" fontFamily="monospace">eth0</text>
                        <text x="250" y="65" fill="#94a3b8" fontSize="10" fontFamily="monospace">Gi0/1</text>
                        <text x="110" y="90" fill="#64748b" fontSize="9">.10</text>
                        <text x="250" y="90" fill="#64748b" fontSize="9">.1</text>

                        {/* Line: Switch to Router */}
                        <line x1="300" y1="75" x2="500" y2="75" stroke="#475569" strokeWidth="2" />
                        <text x="310" y="65" fill="#94a3b8" fontSize="10" fontFamily="monospace">Gi0/2</text>
                        <text x="450" y="65" fill="#94a3b8" fontSize="10" fontFamily="monospace">Gi0/0</text>
                        <text x="310" y="90" fill="#64748b" fontSize="9">.1</text>
                        <text x="450" y="90" fill="#64748b" fontSize="9">.2</text>

                        {/* Line: Router to Firewall */}
                        <line x1="500" y1="75" x2="700" y2="75" stroke="#475569" strokeWidth="2" />
                        <text x="510" y="65" fill="#94a3b8" fontSize="10" fontFamily="monospace">Gi0/1</text>
                        <text x="650" y="65" fill="#94a3b8" fontSize="10" fontFamily="monospace">port2</text>
                        <text x="510" y="90" fill="#64748b" fontSize="9">.1</text>
                        <text x="650" y="90" fill="#64748b" fontSize="9">.2</text>

                        {/* Line: Firewall to ISP */}
                        <line x1="700" y1="75" x2="900" y2="75" stroke="#475569" strokeWidth="2" />
                        <text x="710" y="65" fill="#94a3b8" fontSize="10" fontFamily="monospace">port1</text>
                        <text x="850" y="65" fill="#94a3b8" fontSize="10" fontFamily="monospace">eth0</text>
                        <text x="710" y="90" fill="#64748b" fontSize="9">.2</text>
                        <text x="850" y="90" fill="#64748b" fontSize="9">.1</text>
                    </svg>
                </div>
                
                <div className="flex justify-between w-full max-w-4xl z-10 px-10 min-w-[800px]">
                    {session.topology.map((node, index) => {
                        const dev = labState[node.deviceId];
                        const isActive = activeDeviceId === node.deviceId;
                        const Icon = {
                            'AccessPoint': Wifi, 'Switch': Box, 'Router': RouterIcon, 'Firewall': Shield, 'Cloud': Cloud
                        }[node.icon];

                        const isInteractive = node.icon !== 'Cloud';

                        return (
                            <button
                                key={node.deviceId}
                                disabled={!isInteractive}
                                onClick={() => setActiveDeviceId(node.deviceId)}
                                className={`flex flex-col items-center transition-all duration-200 group ${isActive ? 'scale-110' : 'opacity-80'} ${!isInteractive ? 'cursor-default opacity-50' : 'hover:opacity-100 hover:-translate-y-1'}`}
                            >
                                <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center shadow-lg mb-2 border-2 transition-colors ${
                                    isActive ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/50' : 'bg-slate-800 border-slate-600 text-slate-400 group-hover:border-slate-400'
                                }`}>
                                    <Icon size={28} />
                                    {isActive && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-slate-900"></div>}
                                </div>
                                <span className={`text-[10px] md:text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap ${isActive ? 'bg-blue-900/50 text-blue-200' : 'text-slate-500'}`}>
                                    {dev.name}
                                </span>
                                <span className="text-[9px] font-mono text-slate-600 mt-0.5">{dev.vendor}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
          )}
      </div>
  );

  // --- PARSER ENGINE ---

  const getPrompt = (state: DeviceState) => {
      const h = state.name;
      if (['Cisco', 'Aruba', 'Extreme'].includes(state.vendor)) {
          if (state.cliMode === 'user') return `${h}>`;
          if (state.cliMode === 'priv') return `${h}#`;
          if (state.cliMode === 'config') return `${h}(config)#`;
          if (state.cliMode === 'config-if') return `${h}(config-if)#`;
          if (state.cliMode === 'config-router') return `${h}(config-router)#`;
      }
      if (state.vendor === 'Juniper') return state.cliMode === 'edit' ? `[edit]\nroot@${h}#` : `root@${h}>`;
      if (state.vendor === 'Palo Alto') return state.cliMode === 'config' ? `admin@${h}#` : `admin@${h}>`;
      if (state.vendor === 'Fortinet') {
          if (state.cliContext.length > 0) return `${h} (${state.cliContext[state.cliContext.length-1]}) #`;
          return `${h} #`;
      }
      return `${h}>`;
  };

  const handleCliCommand = (cmd: string) => {
      const newState = JSON.parse(JSON.stringify(activeDevice)); 
      const prompt = getPrompt(newState);
      
      if (cmd.trim() === '') {
          newState.history.push(prompt);
          updateDevice(newState);
          return;
      }
      newState.history.push(`${prompt} ${cmd}`);

      const cleanCmd = cmd.trim();
      const tokens = cleanCmd.split(/\s+/);
      const raw = cleanCmd; // preserve case for some checks
      
      if (cleanCmd === '?' || cleanCmd === 'help') {
          showHelp(newState);
      } 
      else if (['Cisco', 'Aruba', 'Extreme'].includes(newState.vendor)) {
          processCiscoCommand(newState, tokens, raw);
      } else if (newState.vendor === 'Juniper') {
          processJuniperCommand(newState, tokens, raw);
      } else if (newState.vendor === 'Fortinet') {
          processFortinetCommand(newState, tokens, raw);
      } else if (newState.vendor === 'Palo Alto') {
          processPaloAltoCommand(newState, tokens, raw);
      } else {
          newState.history.push('% Error: No parser available for this vendor.');
      }

      updateDevice(newState);
      setCliInput('');
  };

  // --- CISCO PARSER (EXPANDED TO 120+ COMMANDS) ---
  const processCiscoCommand = (state: DeviceState, tokens: string[], raw: string) => {
      const verb = tokens[0].toLowerCase();
      const t1 = tokens[1] ? tokens[1].toLowerCase() : '';
      const t2 = tokens[2] ? tokens[2].toLowerCase() : '';
      const lowerRaw = raw.toLowerCase();

      // Navigation
      if (verb === 'exit') {
          if (state.cliMode === 'config-if' || state.cliMode === 'config-router') { state.cliMode = 'config'; state.cliContext = []; }
          else if (state.cliMode === 'config') state.cliMode = 'priv';
          else if (state.cliMode === 'priv') state.cliMode = 'user';
          return;
      }
      if (verb === 'end') {
          if (state.cliMode !== 'user') state.cliMode = 'priv';
          return;
      }

      // User Mode
      if (state.cliMode === 'user') {
          if (verb === 'enable' || verb === 'en') { state.cliMode = 'priv'; }
          else if (verb === 'ping') { state.history.push('Sending 5, 100-byte ICMP Echos to target, timeout is 2 seconds:'); state.history.push('!!!!!'); state.history.push('Success rate is 100 percent (5/5)'); }
          else if (verb === 'traceroute' || verb === 'trace') { state.history.push(`Tracing the route to ${tokens[1] || 'target'}`); state.history.push('  1 192.168.20.1 2 msec 1 msec 1 msec'); state.history.push('  2 10.0.0.2 4 msec 3 msec 4 msec'); }
          else if (verb === 'show' || verb === 'sh') {
             if (t1 === 'version' || t1 === 'ver') { state.history.push('Cisco IOS Software, ISR Software (X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 17.3.4a'); state.history.push('Uptime is 4 weeks, 2 days, 3 hours'); }
             else if (t1 === 'clock') state.history.push('14:45:10.123 UTC Mon May 22 2024');
             else if (t1 === 'history') state.history.push(state.history.filter(h => h.startsWith(state.name)).join('\n'));
             else if (t1 === 'users') state.history.push('    Line       User       Host(s)              Idle       Location\n*  0 con 0                idle                 00:00:00');
             else if (t1 === 'sessions') state.history.push('No active connections.');
             else if (t1 === 'ssh') state.history.push('% SSH not enabled');
             else if (t1 === 'inventory') { state.history.push('NAME: "Chassis", DESCR: "Cisco ISR4331 Chassis"'); state.history.push('PID: ISR4331/K9        , VID: V01 , SN: FDO2134251'); }
             else if (t1 === 'flash' || t1 === 'file') state.history.push('Directory of flash:/\n    1  -rw-    500000000   May 1 2024  isr4300-universalk9.17.03.04a.SPA.bin');
             else state.history.push('% Invalid input detected at "^" marker.');
          }
          else state.history.push('% Unknown command.');
      } 
      // Privileged Mode
      else if (state.cliMode === 'priv') {
          if (lowerRaw.startsWith('conf')) { state.history.push('Enter configuration commands, one per line.  End with CNTL/Z.'); state.cliMode = 'config'; }
          else if (verb === 'reload') state.history.push('Proceed with reload? [confirm]');
          else if (verb === 'write' || verb === 'wr' || (verb === 'copy' && t1 === 'run' && t2 === 'start')) { state.history.push('Building configuration...\n[OK]'); }
          else if (verb === 'delete') { if (t1.includes('nvram') || t1.includes('startup')) state.history.push('Erase of nvram: complete'); }
          else if (verb === 'clear') {
              if (t1 === 'counters') state.history.push('Clear "show interface" counters on all interfaces [confirm]\nCounters cleared.');
              if (t1 === 'arp') state.history.push('ARP cache cleared.');
              if (t1 === 'logging') state.history.push('Logging buffer cleared.');
              if (t1 === 'ip' && t2 === 'nat') state.history.push('Dynamic translation slots cleared.');
          }
          else if (verb === 'debug') {
              if (t1 === 'ip' && t2 === 'packet') state.history.push('IP packet debugging is on');
              else if (t1 === 'all') state.history.push('All possible debugging has been turned on');
              else state.history.push('% Incomplete command.');
          }
          else if (verb === 'undebug' || (verb === 'no' && t1 === 'debug')) { state.history.push('All possible debugging has been turned off'); }
          else if (verb === 'show' || verb === 'sh') {
              // Interfaces & IP
              if (lowerRaw.includes('ip int br')) { state.history.push('Interface              IP-Address      OK? Method Status                Protocol'); Object.values(state.interfaces).forEach((iface:any) => state.history.push(`${iface.name.padEnd(22)} ${iface.ip.padEnd(15)} YES manual ${iface.up?'up':'admin down'}           ${iface.up?'up':'down'}`)); }
              else if (lowerRaw.includes('run')) { state.history.push(`hostname ${state.name}`); Object.values(state.interfaces).forEach((i:any) => { state.history.push(`interface ${i.name}\n ip address ${i.ip} ${i.mask}\n ${!i.up?'shutdown':''}`); }); state.history.push('end'); }
              else if (lowerRaw.includes('startup')) { state.history.push(`hostname ${state.name}\n! Startup Config`); }
              else if (lowerRaw.includes('ip route')) { state.history.push('S*   0.0.0.0/0 [1/0] via 10.0.0.2'); Object.values(state.interfaces).forEach((i:any)=> { if(i.ip) state.history.push(`C    ${i.ip}/24 is directly connected, ${i.name}`); }); }
              else if (lowerRaw.includes('arp')) { const neighbors = findNeighbors(state, 'ARP'); state.history.push('Protocol  Address          Age (min)  Hardware Addr   Type   Interface'); neighbors.forEach(n => state.history.push(`Internet  ${n}`)); }
              
              // Layer 2
              else if (lowerRaw.includes('mac add')) state.history.push('Vlan    Mac Address       Type        Ports\n----    -----------       --------    -----\n10      0050.56b0.1122    DYNAMIC     Gi0/2');
              else if (lowerRaw.includes('vlan')) state.history.push('VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n1    default                          active    Gi0/0\n10   Data                             active    Gi0/2');
              else if (lowerRaw.includes('spanning-tree')) state.history.push('VLAN0010\n  Spanning tree enabled protocol rstp\n  Root ID    Priority    32778\n             Address     0016.9d82.1234\n             This bridge is the root');
              else if (lowerRaw.includes('etherchannel')) state.history.push('Group  Port-channel  Protocol    Ports\n------+-------------+-----------+-----------------------------------------------');
              else if (lowerRaw.includes('cdp nei')) { state.history.push('Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID'); findNeighbors(state, 'CDP').forEach(n => state.history.push(n)); }
              else if (lowerRaw.includes('lldp nei')) { state.history.push('Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID'); findNeighbors(state, 'CDP').forEach(n => state.history.push(n)); }
              
              // Protocols
              else if (lowerRaw.includes('ip proto')) state.history.push('Routing Protocol is "ospf 1"\n  Router ID 1.1.1.1\n  Number of areas in this router is 1. 1 normal 0 stub 0 nssa');
              else if (lowerRaw.includes('ip ospf nei')) state.history.push('Neighbor ID     Pri   State           Dead Time   Address         Interface\n2.2.2.2           1   FULL/BDR        00:00:33    10.0.0.2        Gi0/0');
              else if (lowerRaw.includes('ip ospf int')) state.history.push('Gi0/0 is up, line protocol is up \n  Internet Address 10.0.0.1/30, Area 0, Process ID 1');
              else if (lowerRaw.includes('bgp sum')) state.history.push('BGP router identifier 1.1.1.1, local AS number 65000\nNeighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd\n10.0.0.2        4 65001      12      12        3    0    0 00:11:12        1');
              else if (lowerRaw.includes('ip nat trans')) state.history.push('Pro Inside global      Inside local       Outside local      Outside global\ntcp 203.0.113.10:80    192.168.10.10:80   ---                ---');
              else if (lowerRaw.includes('ip nat stat')) state.history.push('Total active translations: 1 (1 static, 0 dynamic; 0 extended)');
              else if (lowerRaw.includes('access-lists')) state.history.push('Standard IP access list 10\n    10 permit 192.168.10.0, wildcard bits 0.0.0.255');
              
              // Hardware & System
              else if (lowerRaw.includes('env')) state.history.push('Fan 1: OK, Fan 2: OK\nTemp: 28C (Normal)');
              else if (lowerRaw.includes('power inline')) state.history.push('Module   Available     Used     Remaining\n          (Watts)     (Watts)    (Watts)\n1           370.0        0.0       370.0');
              else if (lowerRaw.includes('proc cpu')) state.history.push('CPU utilization for five seconds: 1%/0%; one minute: 1%; five minutes: 1%');
              else if (lowerRaw.includes('mem')) state.history.push('Processor Pool Total: 10245628 Used: 452123 Free: 98124505');
              else if (lowerRaw.includes('log')) state.history.push('Syslog logging: enabled (0 messages dropped, 0 messages rate-limited, 0 flushes, 0 overruns, xml disabled, filtering disabled)');
              else if (lowerRaw.includes('flash') || lowerRaw.includes('file sys')) state.history.push('Size(b)       Free(b)      Type  Flags  Prefixes\n* 4096000000    3500000000   disk  rw     flash:');
              else if (lowerRaw.includes('control')) state.history.push('Interface GigabitEthernet0/0\nHardware is ISR4331-3x1GE');
              else if (lowerRaw.includes('tech') || lowerRaw.includes('diag')) state.history.push('... Generating Tech Support Output ...\n(This typically outputs thousands of lines of config/state)\n[DONE]');
              else if (lowerRaw.includes('crypto isakmp sa')) state.history.push('dst             src             state          conn-id status\n10.0.0.2        10.0.0.1        QM_IDLE              1 ACTIVE');
              else if (lowerRaw.includes('crypto ipsec sa')) state.history.push('interface: Tunnel0\n    Crypto map tag: Tunnel0-head-0, local addr 10.0.0.1');
              else if (lowerRaw.includes('port-sec')) state.history.push('Secure Port  MaxSecureAddr  CurrentAddr  SecurityViolation  Security Action\n(Count)       (Count)        (Count)\n---------------------------------------------------------------------------');

              else state.history.push('% Incomplete command.');
          } else state.history.push('% Unknown command.');
      }
      // Config Mode
      else if (state.cliMode === 'config') {
          if (verb === 'interface' || verb === 'int') {
              const ifName = tokens[1];
              if (!state.interfaces[ifName]) state.interfaces[ifName] = { name: ifName, ip: '', mask: '', up: true };
              state.cliContext.push(ifName); state.cliMode = 'config-if';
          } else if (verb === 'hostname') { state.name = tokens[1]; }
          else if (verb === 'router') { if(t1 === 'ospf') state.cliMode = 'config-router'; if(t1 === 'bgp') state.cliMode = 'config-router'; }
          else if (verb === 'ip' && t1 === 'route') { if(tokens.length >= 5) state.routes.push({ destination: `${tokens[2]}/${tokens[3]}`, nextHop: tokens[4] }); }
          else if (verb === 'access-list') state.history.push('');
          else if (verb === 'line' && t1 === 'vty') state.history.push('');
      }
      // Config-If Mode
      else if (state.cliMode === 'config-if') {
          const ifName = state.cliContext[state.cliContext.length - 1];
          if (lowerRaw.startsWith('ip address')) {
              if (tokens.length < 4) state.history.push('% Incomplete command.');
              else { state.interfaces[ifName].ip = tokens[2]; state.interfaces[ifName].mask = tokens[3]; }
          } else if (lowerRaw.includes('no shut')) { state.interfaces[ifName].up = true; }
          else if (verb === 'shutdown') { state.interfaces[ifName].up = false; }
          else if (verb === 'description') { state.interfaces[ifName].description = tokens.slice(1).join(' '); }
      }
  };

  // --- JUNIPER PARSER (EXPANDED TO 50+ COMMANDS) ---
  const processJuniperCommand = (state: DeviceState, tokens: string[], raw: string) => {
      const verb = tokens[0].toLowerCase();
      const t1 = tokens[1] ? tokens[1].toLowerCase() : '';
      const t2 = tokens[2] ? tokens[2].toLowerCase() : '';

      if (state.cliMode === 'user') {
          if (verb === 'configure' || verb === 'edit') { state.history.push('Entering configuration mode'); state.cliMode = 'edit'; }
          else if (verb === 'request') {
              if (t1 === 'system' && t2 === 'reboot') state.history.push('Rebooting...');
              else if (t1 === 'system' && t2 === 'halt') state.history.push('Halting...');
          }
          else if (verb === 'monitor') {
              if (t1 === 'traffic') state.history.push('Monitoring traffic... (Press Ctrl+C to stop)');
          }
          else if (verb === 'ping') state.history.push('PING 8.8.8.8 (8.8.8.8): 56 data bytes\n64 bytes from 8.8.8.8: icmp_seq=0 ttl=118 time=12.345 ms');
          else if (verb === 'traceroute') state.history.push('traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 40 byte packets\n 1  10.0.0.2  2.123 ms');
          else if (verb === 'clear') {
              if(t1 === 'log') state.history.push('Logs cleared.');
              else state.history.push('Statistics cleared.');
          }
          else if (verb === 'show') {
              if (t1 === 'configuration') renderJuniperConfig(state);
              else if (raw.includes('int terse')) { state.history.push('Interface               Admin Link Proto    Local'); Object.values(state.interfaces).forEach((i:any) => state.history.push(`${i.name.padEnd(23)} ${i.up?'up':'down'}    ${i.up?'up':'down'}    inet     ${i.ip}`)); }
              else if (raw.includes('int extensive')) state.history.push('Physical interface: ge-0/0/0, Enabled, Physical link is Up\n  Link-level type: Ethernet, MTU: 1514, Speed: 1000mbps, BPDU Error: None, MAC-REWRITE Error: None, Loopback: Disabled\n  Source filtering: Disabled, Flow control: Enabled');
              else if (raw.includes('int')) state.history.push('Physical interface: ge-0/0/0, Enabled, Physical link is Up');
              
              else if (raw.includes('route sum')) state.history.push('Router ID: 192.168.1.1\nIPv4 Route Table: 12 destinations, 12 routes (12 active, 0 holddown, 0 hidden)');
              else if (raw.includes('route prot ospf')) state.history.push('ospf.0: 3 destinations, 3 routes (3 active, 0 holddown, 0 hidden)');
              else if (raw.includes('route prot bgp')) state.history.push('bgp.l3vpn.0: 0 destinations, 0 routes (0 active, 0 holddown, 0 hidden)');
              else if (raw.includes('route')) state.history.push('inet.0: 4 destinations\n10.0.0.0/24        *[Direct/0] 01:00:00\n                    > via ge-0/0/0.0');

              else if (raw.includes('arp')) { state.history.push('MAC Address       Address         Name                      Interface'); findNeighbors(state, 'ARP').forEach(n => state.history.push(n)); }
              else if (raw.includes('lldp nei')) { state.history.push('Local Interface    Parent Interface    Chassis Id          System Name'); findNeighbors(state, 'CDP').forEach(n => state.history.push(n)); }
              
              else if (raw.includes('system uptime')) state.history.push('Current time: 2024-05-15 14:30:00 UTC\nSystem booted: 5 days ago');
              else if (raw.includes('system stor')) state.history.push('Filesystem              Size       Used      Avail  Capacity   Mounted on\n/dev/gpt/junos          2.0G       1.2G       700M       63%   /');
              else if (raw.includes('system proc')) state.history.push('PID USERNAME  THR PRI NICE   SIZE    RES STATE   C   TIME    WCPU COMMAND\n1234 root        1  20    0   800M   500M select  0   5:00   0.00% rpd');
              else if (raw.includes('chassis hard')) state.history.push('Hardware inventory:\nItem             Version  Part number  Serial number     Description\nChassis                                VM6293482         vMX');
              else if (raw.includes('chassis route')) state.history.push('Routing Engine status:\n  Temperature                 30 degrees C / 86 degrees F');
              else if (raw.includes('chassis env')) state.history.push('Class Item                           Status     Measurement\nTemp  Routing Engine                 OK         30 degrees C / 86 degrees F');
              else if (raw.includes('chassis alarm')) state.history.push('No alarms currently active');
              
              else if (raw.includes('ospf nei')) state.history.push('Address          Interface              State     ID               Pri  Dead\n10.0.0.2         ge-0/0/0.0             Full      2.2.2.2          128  35');
              else if (raw.includes('ospf int')) state.history.push('Interface           State   Area            DR ID           BDR ID          Nbrs\nge-0/0/0.0          DR      0.0.0.0         192.168.1.1     0.0.0.0         1');
              else if (raw.includes('bgp sum')) state.history.push('Groups: 1 Peers: 1 Down peers: 0\nPeer                     AS      InPkt     OutPkt    OutQ   Flaps Last Up/Dwn State\n10.0.0.2              65001       100        100       0       0       1d 2h Establ');
              
              else if (raw.includes('sec pol')) state.history.push('From zone: TRUST, To zone: UNTRUST\n  Policy: allow-web, State: enabled\n    Action: permit');
              else if (raw.includes('sec zone')) state.history.push('Security zone: TRUST\n  Interfaces: ge-0/0/0.0\nSecurity zone: UNTRUST\n  Interfaces: ge-0/0/1.0');
              else if (raw.includes('sec flow')) state.history.push('Session ID: 100, Policy name: allow-web, Timeout: 1800, Valid\n  In: 192.168.10.10/4321 --> 8.8.8.8/80;tcp, Conn Tag: 0x0, If: ge-0/0/0.0');
              else if (raw.includes('sec nat')) state.history.push('Total Source rules: 1\nRule name: source-nat-rule, Rule-set: source-nat-set\n  Rule-Id: 1, Rule type: source, Action: source-nat');
              
              else if (raw.includes('log')) state.history.push('May 22 10:00:00 root: COMMIT_SUCCESS');
              else state.history.push('unknown command.');
          } else {
             state.history.push('unknown command.');
          }
      }
      else if (state.cliMode === 'edit') {
          if (!state.configBuffer) state.configBuffer = {};
          if (verb === 'exit') { state.history.push('Exiting configuration mode'); state.cliMode = 'user'; }
          else if (verb === 'set') {
              if (t1 === 'interfaces') {
                  const ifName = tokens[2];
                  if(raw.includes('address')) {
                     if(!state.configBuffer.interfaces) state.configBuffer.interfaces = {};
                     state.configBuffer.interfaces[ifName] = { ...(state.interfaces[ifName]||{name:ifName,up:true,mask:'',ip:''}), ip: tokens[tokens.indexOf('address')+1] };
                  }
              }
          }
          else if (verb === 'delete') state.history.push('Deleted.');
          else if (verb === 'commit') {
               if (state.configBuffer.interfaces) { Object.entries(state.configBuffer.interfaces).forEach(([k,v]:[string,any])=> { state.interfaces[k] = {...(state.interfaces[k]||{}), ...v}; }); }
               state.configBuffer = {};
               state.history.push('commit complete');
          }
      }
  };

  const renderJuniperConfig = (state: DeviceState) => {
      state.history.push('## Last changed: 2024-05-01 12:00:00 UTC');
      state.history.push('version 21.4R1;');
      Object.values(state.interfaces).forEach((iface: any) => {
         state.history.push(`interfaces {\n    ${iface.name} {\n        unit 0 {\n            family inet {\n                address ${iface.ip};\n            }\n        }\n    }\n}`);
      });
  };

  // --- FORTINET PARSER (EXPANDED TO 40+ COMMANDS) ---
  const processFortinetCommand = (state: DeviceState, tokens: string[], raw: string) => {
       const verb = tokens[0].toLowerCase();
       const t1 = tokens[1] ? tokens[1].toLowerCase() : '';
       
       if (state.cliContext.length === 0) {
           if (verb === 'config') {
               if (raw.includes('system interface')) state.cliContext.push('interface');
               else if (raw.includes('router static')) state.cliContext.push('router static');
               else if (raw.includes('firewall policy')) state.cliContext.push('policy');
               else if (raw.includes('router ospf')) state.cliContext.push('router ospf');
               else state.history.push('command parse error');
           } 
           else if (verb === 'execute') {
               if (t1 === 'ping') state.history.push(`PING ${tokens[2]} (56 data bytes)\n64 bytes from ${tokens[2]}: icmp_seq=0 ttl=255 time=0.9 ms`);
               else if (t1 === 'ssh') state.history.push('SSH connection failed.');
               else if (t1 === 'telnet') state.history.push('Telnet connection failed.');
               else if (raw.includes('ping-options')) state.history.push('Ping options: repeat count=5, data size=56');
               else if (t1 === 'reboot') state.history.push('Rebooting system...');
               else if (t1 === 'factoryreset') state.history.push('This operation will reset the system to factory default! Do you want to continue? (y/n)');
               else if (t1 === 'backup') state.history.push('Starting backup...');
               else state.history.push('command parse error');
           }
           else if (verb === 'diagnose') {
               if (raw.includes('sys session list')) state.history.push('session info: proto=6 proto_state=01 duration=120 state=may_dirty');
               else if (raw.includes('sys top')) state.history.push('Run Time:  1 days,  4 hours and 15 minutes\n0U, 0N, 0S, 100I; 2038T, 514F');
               else if (raw.includes('hardware deviceinfo nic')) state.history.push('Driver Name: virtio_net\nMAC Address: 00:09:0f:09:00:01\nLink: up\nSpeed: 10000');
               else if (raw.includes('debug enable')) state.history.push('Debug output enabled.');
               else if (raw.includes('debug flow trace')) state.history.push('Trace start.');
               else state.history.push('Unknown diagnose command.');
           }
           else if (verb === 'get') {
               if (raw.includes('sys status')) state.history.push('Version: FortiGate-VM64 v7.2.0\nFirmware Signature: signed\nAdmin domain config: disable');
               else if (raw.includes('sys perf status')) state.history.push('CPU states: 0% user 0% system 100% idle\nMemory: 2097152k total, 514216k used');
               else if (raw.includes('sys interface')) { state.history.push('Name    Mode        IP/Mask             Status'); Object.values(state.interfaces).forEach((i:any) => state.history.push(`${i.name.padEnd(7)} static      ${(i.ip||'0.0.0.0').padEnd(19)} ${i.up?'up':'down'}`)); }
               else if (raw.includes('sys arp')) { state.history.push('Address           Age(min)   Hardware Addr      Interface'); findNeighbors(state, 'ARP').forEach(n => state.history.push(n)); }
               else if (raw.includes('router info rout')) { state.history.push('S*      0.0.0.0/0 [10/0] via 10.0.0.1, port1'); Object.values(state.interfaces).forEach((i:any) => { if(i.ip) state.history.push(`C       ${i.ip}/32 is directly connected, ${i.name}`); }); }
               else if (raw.includes('router info ospf nei')) state.history.push('Neighbor ID     Pri   State           Dead Time   Address         Interface\n1.1.1.1         1     Full/DR         00:00:39    10.0.0.1        port1');
               else if (raw.includes('router info bgp sum')) state.history.push('BGP router identifier 2.2.2.2, local AS number 65001\nNeighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd\n10.0.0.1        4 65000      50      50        1    0    0 02:22:22        1');
               else if (raw.includes('hardware status')) state.history.push('Model name: FortiGate-VM64\nASIC version: 0000\nCPU: Intel(R) Xeon(R) CPU');
               else if (raw.includes('hardware cpu')) state.history.push('processor       : 0\nvendor_id       : GenuineIntel\ncpu family      : 6');
               else if (raw.includes('hardware memory')) state.history.push('MemTotal:        2052444 kB\nMemFree:         1398864 kB');
               else state.history.push('Command fail. Return code -1');
           } 
           else if (verb === 'show') {
                if (raw.includes('firewall policy')) { state.history.push('config firewall policy'); state.policies.forEach(p => { state.history.push(`    edit ${p.id}\n        set name "${p.name}"\n        set srcintf "${p.fromZone}"\n        set dstintf "${p.toZone}"\n        set action ${p.action}\n    next`); }); state.history.push('end'); }
                else if (raw.includes('vpn ipsec')) state.history.push('IPsec VPN tunnels:\nNo tunnels configured.');
                else if (raw.includes('system dns')) state.history.push('config system dns\n    set primary 8.8.8.8\n    set secondary 8.8.4.4\nend');
                else if (raw.includes('full-config')) state.history.push('config system global\n    set admin-sport 443\nend\n...');
                // Strict check: if no arguments, show config. If arguments present but not matched, error.
                else if (tokens.length === 1) { state.history.push('config system interface'); Object.values(state.interfaces).forEach(i => { state.history.push(`    edit "${i.name}"\n        set ip ${i.ip} ${i.mask}\n    next`); }); state.history.push('end'); }
                else { state.history.push('command parse error'); }
           }
           else {
               state.history.push('command parse error');
           }
       }
       else if (state.cliContext.length > 0) {
           if (verb === 'edit') { const port = tokens[1]; if (!state.interfaces[port]) state.interfaces[port] = { name: port, ip: '', mask: '', up: true }; state.cliContext.push(port); }
           else if (verb === 'set') {
               if (t1 === 'ip') { state.interfaces[state.cliContext[state.cliContext.length-1]].ip = tokens[2]; state.interfaces[state.cliContext[state.cliContext.length-1]].mask = tokens[3]; }
               else if (t1 === 'status') { state.interfaces[state.cliContext[state.cliContext.length-1]].up = (tokens[2] === 'up'); }
           }
           else if (verb === 'next') state.cliContext.pop();
           else if (verb === 'end') state.cliContext = [];
       }
  };

  // --- PALO ALTO PARSER (EXPANDED TO 40+ COMMANDS) ---
  const processPaloAltoCommand = (state: DeviceState, tokens: string[], raw: string) => {
      const verb = tokens[0].toLowerCase();
      const t1 = tokens[1] ? tokens[1].toLowerCase() : '';

      if (state.cliMode === 'user') {
          if (verb === 'configure') { state.history.push('Entering configuration mode'); state.cliMode = 'config'; } 
          else if (verb === 'request') {
              if(raw.includes('system restart')) state.history.push('Executing restart...');
              else if(raw.includes('shutdown')) state.history.push('Executing shutdown...');
          }
          else if (verb === 'test') {
              if(raw.includes('security-policy')) state.history.push('Access allowed by policy "Allow-Outbound" from TRUST to UNTRUST');
          }
          else if (verb === 'debug') {
              if(raw.includes('dataplane')) state.history.push('Dataplane packet diagnosis enabled.');
          }
          else if (verb === 'ping') state.history.push('PING host (8.8.8.8) 56(84) bytes of data.\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=4.20 ms');
          else if (verb === 'show') {
              if (raw.includes('interface all')) { Object.values(state.interfaces).forEach((i:any) => state.history.push(`name: ${i.name}, state: ${i.up?'up':'down'}, ip: ${i.ip}, zone: ${i.zone||'N/A'}`)); }
              else if (raw.includes('interface logical')) { state.history.push('total configured logical interfaces: 2\nname           id    vsys zone             forwarding-tag  ip-address\nethernet1/1    16    1    UNTRUST          0               203.0.113.2/30'); }
              else if (raw.includes('interface hardware')) { state.history.push('Port: ethernet1/1, Name: ethernet1/1, MAC: 00:50:56:00:00:01\nSpeed: 10000, Duplex: full, State: up'); }
              else if (raw.includes('routing route')) { state.history.push('VIRTUAL ROUTER: default (id 1)\ndestination     nexthop           metric flags      age   interface\n0.0.0.0/0       203.0.113.1       10     A S              ethernet1/1'); }
              else if (raw.includes('system info')) state.history.push('hostname: PA-VM\nip-address: 192.168.1.99\nuptime: 2 days, 4:02:12\nsw-version: 10.1.0\nmodel: PA-VM');
              else if (raw.includes('system state')) state.history.push('sys.s1.p1.limit: 100');
              else if (raw.includes('system resources')) state.history.push('load average: 0.05, 0.08, 0.02\nMem: 4G total, 1G used');
              else if (raw.includes('system statistics')) state.history.push('counter          value      rate\n---------------------------------\nflow_fwd_l3_mcast 0        0');
              
              else if (raw.includes('arp all')) { state.history.push('interface         ip-address      mac-address       port'); findNeighbors(state, 'ARP').forEach(n => state.history.push(n)); }
              else if (raw.includes('session all')) state.history.push('ID      Application    State    Type    Flag  Src[Sport]/Zone/Proto\n2423    dns            ACTIVE   FLOW    NS    192.168.10.10[4232]/TRUST/17');
              else if (raw.includes('session info')) state.history.push('Session statistics\n  Number of allocated sessions: 1');
              else if (raw.includes('session meter')) state.history.push('Session metering statistics\n  tps: 0');
              else if (raw.includes('user ip')) state.history.push('IP              Vsys   Type   User              IdleTimeout(s) MaxTimeout(s)\n192.168.1.50    vsys1  AD     domain\\alice      900            3600');
              
              else if (raw.includes('counter global')) state.history.push('Global counters:\nflow_fwd_l3_mcast 0');
              else if (raw.includes('jobs all')) state.history.push('Enqueued Dequeued ID      Type    Status  Result  Completed\n14:20:01 14:20:01 12      Commit  FIN     OK      14:20:15');
              else if (raw.includes('admins')) state.history.push('Admin     From            Role              Client\nadmin     192.168.10.10   superuser         Web');
              else if (raw.includes('high-avail')) state.history.push('High Availability is not enabled');
              
              else if (raw.includes('running security-policy')) state.history.push('"Allow-Outbound" {\n        from TRUST;\n        source any;\n        to UNTRUST;\n        destination any;\n        action allow;\n}');
              else if (raw.includes('running nat-policy')) state.history.push('No NAT policies configured.');
              else if (raw.includes('config running')) state.history.push('users {\n  admin {\n    password-hash ...;\n    permissions superuser;\n  }\n}');
              else if (raw.includes('config candidate')) state.history.push('Candidate config same as running.');
              
              else state.history.push('Invalid syntax.');
          }
          else {
              state.history.push('Invalid syntax.');
          }
      } else if (state.cliMode === 'config') {
          if (verb === 'exit') { state.history.push('Exiting configuration mode'); state.cliMode = 'user'; }
          else if (verb === 'set') {
              if (raw.includes('network interface ethernet')) {
                  const ipIndex = tokens.indexOf('ip');
                  const ethIndex = tokens.indexOf('ethernet');
                  if (ipIndex !== -1 && ethIndex !== -1 && tokens[ethIndex + 1]) {
                      const name = tokens[ethIndex + 1]; const ip = tokens[ipIndex + 1];
                      if (!state.interfaces[name]) state.interfaces[name] = { name: name, ip: '', mask: '', up: true };
                      state.interfaces[name].ip = ip; state.history.push('[OK]');
                  }
              }
              else if (raw.includes('network zone')) { state.history.push('[OK]'); }
          }
          else if (verb === 'commit') state.history.push('Configuration committed successfully');
          else if (verb === 'load') state.history.push('Config loaded from ' + tokens[3]);
      }
  };

  // --- HELP SYSTEM ---
  const showHelp = (state: DeviceState) => {
      state.history.push(`--- ${state.vendor} Available Commands (Partial List) ---`);
      const commands = getDeviceCommands(state.vendor);
      Object.entries(commands).forEach(([category, cmds]) => {
          state.history.push(`${category}: ${cmds.slice(0, 5).join(', ')} ...`);
      });
      state.history.push('(See "Lab Documentation" tab for full list)');
  };

  const updateDevice = (updatedState: DeviceState) => {
      setLabState(prev => ({ ...prev, [updatedState.id]: updatedState }));
  };

  // --- GUI ENGINE (SYNCED) ---
  const DeviceGui = () => {
      const [tab, setTab] = useState('dashboard');
      const themeColors = { Cisco: 'bg-blue-700', Juniper: 'bg-slate-800', Fortinet: 'bg-teal-700', 'Palo Alto': 'bg-slate-200 text-slate-800 border-b-2 border-yellow-500' };
      const headerClass = themeColors[activeDevice.vendor as keyof typeof themeColors] || 'bg-slate-700';

      return (
          <div className="flex flex-col h-full bg-slate-100 overflow-hidden font-sans">
              <div className={`${headerClass} ${activeDevice.vendor === 'Palo Alto' ? 'text-slate-800' : 'text-white'} px-4 py-3 flex justify-between items-center shadow-md z-10 shrink-0`}>
                  <div className="flex items-center space-x-3">
                      <Layout size={18} />
                      <span className="font-bold text-lg tracking-tight">{activeDevice.vendor} Management</span>
                  </div>
                  <div className="text-xs font-mono opacity-80">{activeDevice.name}</div>
              </div>
              <div className="flex flex-1 overflow-hidden">
                  <div className="w-16 md:w-48 bg-white border-r border-slate-200 flex flex-col text-sm shrink-0">
                      <button onClick={() => setTab('dashboard')} className={`p-3 text-left hover:bg-slate-50 flex items-center ${tab === 'dashboard' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600'}`}>
                          <Activity size={16} className="md:mr-2"/> <span className="hidden md:inline">Dashboard</span>
                      </button>
                      <button onClick={() => setTab('interfaces')} className={`p-3 text-left hover:bg-slate-50 flex items-center ${tab === 'interfaces' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600'}`}>
                          <Settings size={16} className="md:mr-2"/> <span className="hidden md:inline">Interfaces</span>
                      </button>
                  </div>
                  <div className="flex-1 p-4 md:p-6 overflow-y-auto min-h-0">
                      {tab === 'dashboard' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Device Status</h3>
                                  <div className="space-y-3">
                                      <div className="flex justify-between text-sm"><span>Hostname</span> <span className="font-bold">{activeDevice.name}</span></div>
                                      <div className="flex justify-between text-sm"><span>Model</span> <span className="font-bold">{activeDevice.type}</span></div>
                                      <div className="flex justify-between text-sm"><span>OS Version</span> <span className="font-bold">vLatest</span></div>
                                  </div>
                              </div>
                              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Stats</h3>
                                   <div className="flex items-center justify-between mb-2">
                                       <span className="text-sm">Active Interfaces</span>
                                       <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">{Object.values(activeDevice.interfaces).filter(i => i.up).length}</span>
                                   </div>
                              </div>
                          </div>
                      )}
                      {tab === 'interfaces' && (
                          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                               <table className="w-full text-sm text-left min-w-[500px]">
                                   <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                       <tr><th className="p-4">Interface</th><th className="p-4">IP Address</th><th className="p-4">Mask</th><th className="p-4">Status</th></tr>
                                   </thead>
                                   <tbody>
                                       {Object.values(activeDevice.interfaces).map(iface => (
                                           <tr key={iface.name} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                               <td className="p-4 font-mono font-medium text-slate-700">{iface.name}</td>
                                               <td className="p-4">
                                                   <input 
                                                       className="border border-slate-300 rounded px-2 py-1 w-32 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
                                                       value={iface.ip} 
                                                       onChange={(e) => { 
                                                           const newVal = e.target.value;
                                                           // Deep copy to ensure state immutability for History/Undo
                                                           const u = { 
                                                               ...activeDevice,
                                                               interfaces: {
                                                                   ...activeDevice.interfaces,
                                                                   [iface.name]: { ...activeDevice.interfaces[iface.name], ip: newVal }
                                                               },
                                                               history: [...activeDevice.history, `GUI: Changed ${iface.name} IP to ${newVal}`]
                                                           };
                                                           updateDevice(u); 
                                                       }} 
                                                   />
                                               </td>
                                               <td className="p-4 text-slate-500">
                                                   <input 
                                                       className="border border-slate-300 rounded px-2 py-1 w-24 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
                                                       value={iface.mask || ''} 
                                                       onChange={(e) => { 
                                                            const newVal = e.target.value;
                                                            const u = { 
                                                               ...activeDevice,
                                                               interfaces: {
                                                                   ...activeDevice.interfaces,
                                                                   [iface.name]: { ...activeDevice.interfaces[iface.name], mask: newVal }
                                                               }
                                                            };
                                                            updateDevice(u); 
                                                       }} 
                                                    />
                                               </td>
                                               <td className="p-4">
                                                   <button 
                                                       onClick={() => { 
                                                            const u = { 
                                                               ...activeDevice,
                                                               interfaces: {
                                                                   ...activeDevice.interfaces,
                                                                   [iface.name]: { ...activeDevice.interfaces[iface.name], up: !iface.up }
                                                               },
                                                               history: [...activeDevice.history, `GUI: ${!iface.up ? 'Enabled' : 'Disabled'} ${iface.name}`]
                                                            };
                                                            updateDevice(u); 
                                                       }} 
                                                       className={`px-3 py-1 rounded-full text-xs font-bold ${iface.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                                    >
                                                        {iface.up ? 'UP' : 'DOWN'}
                                                    </button>
                                               </td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  const DocumentationView = () => {
      const commands = getDeviceCommands(activeDevice.vendor);
      return (
        <div className="flex-1 bg-slate-50 overflow-y-auto p-8 font-sans min-h-0">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center space-x-3 mb-4"><FileText className="text-blue-600" /><h3 className="text-xl font-bold text-slate-800">Lab Instance SOW Documentation</h3></div>
                    <h4 className="font-bold text-slate-700 mt-6 mb-2">Initial Configuration Dump</h4>
                    <pre className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-96">{session.documentation.initialConfig}</pre>
                    <h4 className="font-bold text-slate-700 mt-8 mb-2">Packet Flow Trace</h4>
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg text-slate-700 leading-relaxed whitespace-pre-line">{session.documentation.packetFlow}</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <div className="flex items-center space-x-3 mb-6"><List className="text-indigo-600" /><h3 className="text-xl font-bold text-slate-800">Supported CLI Commands ({activeDevice.vendor})</h3></div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {Object.entries(commands).map(([category, cmds]) => (
                             <div key={category}>
                                 <h4 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-3">{category}</h4>
                                 <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-1">
                                     {cmds.map(cmd => (
                                         <div key={cmd} className="font-mono text-xs text-slate-700 border-b border-slate-200 last:border-0 pb-1 mb-1 last:pb-0 last:mb-0">
                                             {cmd}
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            </div>
        </div>
      );
  };

  return (
    <div className="flex flex-col h-[85vh] md:h-[calc(100vh-7rem)] w-full bg-slate-950 text-white rounded-xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700 shrink-0">
            <span className="font-bold text-slate-200 flex items-center"><Terminal size={16} className="mr-2 text-blue-400"/> {session.title}</span>
            <button onClick={onExit} className="text-xs bg-slate-700 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors">Exit Simulation</button>
        </div>
        <TopologyView />
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            <div className="w-full md:w-16 bg-slate-900 border-r border-slate-800 flex flex-row md:flex-col items-center py-2 md:py-4 space-x-4 md:space-x-0 md:space-y-4 justify-center md:justify-start shrink-0">
                 <button onClick={() => setViewMode('CLI')} className={`p-3 rounded-xl transition-all ${viewMode === 'CLI' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`} title="CLI Console"><Terminal size={20} /></button>
                 <button onClick={() => setViewMode('GUI')} className={`p-3 rounded-xl transition-all ${viewMode === 'GUI' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`} title="Web Interface"><Monitor size={20} /></button>
                 <button onClick={() => setViewMode('DOCS')} className={`p-3 rounded-xl transition-all ${viewMode === 'DOCS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`} title="Lab Documentation"><FileText size={20} /></button>
                 <div className="flex-1 hidden md:block"></div>
                 <button onClick={() => handleCliCommand('?')} className="p-3 text-slate-500 hover:text-white"><HelpCircle size={20}/></button>
            </div>
            <div className="flex-1 relative flex flex-col overflow-hidden min-h-0">
                {viewMode === 'CLI' ? (
                    <div className="flex-1 bg-[#0f172a] font-mono p-4 overflow-y-auto text-sm min-h-0" onClick={focusCli}>
                        {activeDevice.history.map((line, i) => (<div key={i} className="whitespace-pre-wrap break-all text-slate-300 leading-tight mb-1">{line}</div>))}
                        <div className="flex items-center text-slate-100 mt-2">
                            <span className="mr-2 opacity-80 whitespace-pre">{getPrompt(activeDevice)}</span>
                            <input ref={cliInputRef} className="flex-1 bg-transparent border-none outline-none text-white" value={cliInput} onChange={(e) => setCliInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleCliCommand(cliInput); if (e.key === 'Tab') e.preventDefault(); }} autoFocus spellCheck={false} autoComplete="off"/>
                        </div>
                        <div ref={bottomRef} />
                    </div>
                ) : viewMode === 'GUI' ? <DeviceGui /> : <DocumentationView />}
            </div>
        </div>
    </div>
  );
};

export default VirtualLab;
