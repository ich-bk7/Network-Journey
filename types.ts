

export enum Difficulty {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert',
}

export enum ConfigType {
  CLI = 'CLI',
  GUI = 'GUI',
}

export type TopicCategory = 
  | 'Network Fundamentals' 
  | 'Physical Layer & Cabling'
  | 'L2 Switching & Bridging' 
  | 'L3 Routing & Architecture' 
  | 'Network Security' 
  | 'IP Services' 
  | 'Wireless & Mobility'
  | 'WAN Technologies'
  | 'Automation & SDN'
  | 'Cloud Networking';

export interface Topic {
  id: string;
  title: string;
  category: TopicCategory;
  difficulty: Difficulty;
  description: string;
  content: string; // Markdown
  tags: string[];
}

export interface Vendor {
  id: string;
  name: string;
  logo: string;
  description: string;
  primaryCli: string;
}

export interface VendorGuide {
  id: string;
  vendorId: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  sections: {
    title: string;
    cliCommands: string;
    guiSteps: string[];
    guiContext?: 'interface' | 'routing' | 'policy' | 'system'; 
  }[];
}

export interface Certification {
  id: string;
  vendorId: string;
  name: string;
  level: 'Entry' | 'Associate' | 'Professional' | 'Expert';
  description: string;
  costInr: number;
  examCode: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// --- VIRTUAL LAB TYPES (V2 - Full Stack) ---

export type DeviceType = 'AccessPoint' | 'Switch' | 'Router' | 'Firewall' | 'Cloud';
export type VendorName = 'Cisco' | 'Juniper' | 'Fortinet' | 'Palo Alto' | 'Aruba' | 'Extreme' | 'Internet';

export interface InterfaceConfig {
  name: string;
  ip: string;
  mask: string;
  up: boolean;
  vlan?: number;
  zone?: string; // For firewalls
  description?: string;
}

export interface RouteConfig {
  destination: string; // 0.0.0.0/0
  nextHop: string;
  interface?: string;
}

export interface PolicyConfig {
  id: number;
  name: string;
  fromZone: string;
  toZone: string;
  action: 'allow' | 'deny';
  srcAddr: string;
  dstAddr: string;
}

export interface DeviceState {
  id: string;
  name: string;
  type: DeviceType;
  vendor: VendorName;
  cliMode: string; // 'user', 'priv', 'config', 'edit'
  cliContext: string[]; // ['interfaces', 'ge-0/0/0']
  interfaces: Record<string, InterfaceConfig>;
  routes: RouteConfig[];
  policies: PolicyConfig[]; // Firewall policies
  vlans: Record<number, string>; // ID -> Name
  history: string[]; // CLI History
  configBuffer?: Partial<DeviceState>; // For Juniper 'candidate config'
}

export interface TopologyNode {
  deviceId: string;
  label: string;
  icon: DeviceType;
  x: number; // For visualization
  y: number;
}

export interface LabDocumentation {
  initialConfig: string;
  packetFlow: string;
}

export interface LabSession {
  id: string;
  title: string;
  description: string;
  vendor: VendorName | 'Hybrid';
  difficulty: Difficulty;
  devices: Record<string, DeviceState>; // The state of the entire lab
  topology: TopologyNode[]; // Visual Layout
  objectives: string[]; // Checklist
  documentation: LabDocumentation; // SOW Requirement
}

// --- LEGACY TYPES FOR VIRTUAL TERMINAL ---

export interface TerminalInterface {
  name: string;
  ip: string;
  mask?: string;
  up: boolean;
  securityZone?: string;
}

export interface TerminalState {
  hostname: string;
  mode: string;
  context: string;
  vendorContext?: string[];
  history: string[];
  interfaces: Record<string, TerminalInterface>;
  candidateConfig?: Partial<TerminalState>;
}

export interface LabScenario {
  id: string;
  title: string;
  vendor: VendorName;
  deviceType: string;
  initialState: TerminalState;
  validationRules: (state: TerminalState) => boolean;
}