

import { Certification, Difficulty, Topic, Vendor, VendorGuide, LabSession, DeviceState } from "./types";

export const VENDORS: Vendor[] = [
  { id: 'cisco', name: 'Cisco Systems', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg', description: 'The enterprise standard. ISR/ASR Routers, Catalyst/Nexus Switches, and Wireless.', primaryCli: 'IOS/IOS-XE' },
  { id: 'juniper', name: 'Juniper Networks', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Juniper_Networks_logo.svg/1200px-Juniper_Networks_logo.svg.png', description: 'Service Provider & AI-Native Enterprise. MX Routers, EX/QFX Switches, SRX Firewalls.', primaryCli: 'Junos OS' },
  { id: 'fortinet', name: 'Fortinet', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Fortinet_logo.svg', description: 'Security-driven networking. FortiGate Next-Gen Firewalls, FortiSwitch, and SD-WAN.', primaryCli: 'FortiOS' },
  { id: 'paloalto', name: 'Palo Alto Networks', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Palo_Alto_Networks_logo.svg/2560px-Palo_Alto_Networks_logo.svg.png', description: 'Leader in Cybersecurity. PA-Series NGFW and Prisma Cloud.', primaryCli: 'PAN-OS' },
  { id: 'aruba', name: 'Aruba (HPE)', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Aruba_Networks_logo.svg/2560px-Aruba_Networks_logo.svg.png', description: 'Edge-to-Cloud security and connectivity. Aruba CX Switches and Instant APs.', primaryCli: 'ArubaOS-CX' },
  { id: 'extreme', name: 'Extreme Networks', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Extreme_Networks_logo.svg', description: 'Cloud-driven networking. ExtremeSwitching and ExtremeCloud IQ.', primaryCli: 'EXOS/VOSS' },
  { id: 'aws', name: 'AWS Networking', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', description: 'Cloud Fundamentals. VPC, Direct Connect, Transit Gateway.', primaryCli: 'AWS CLI' }
];

export const THEORY_TOPICS: Topic[] = [
  // --- FUNDAMENTALS ---
  {
    id: 'fnd-osi', title: 'The OSI Model: A Comprehensive Deep Dive', category: 'Network Fundamentals', difficulty: Difficulty.Beginner,
    description: 'The 7-layer framework that defines all networking communication.', tags: ['OSI', 'Theory', 'Layers'],
    content: `### Introduction to the Open Systems Interconnection (OSI) Model
The OSI model is a conceptual framework used to understand and standardize how different computer systems communicate over a network. It splits communication into seven abstract layers, from physical cabling up to the software application.

### Layer 1: The Physical Layer
This layer conveys the bit stream - electrical impulse, light or radio signal — through the network at the electrical and mechanical level. It provides the hardware means of sending and receiving data on a carrier.
*   **PDU (Protocol Data Unit)**: Bit.
*   **Hardware**: Ethernet Cables (Cat5e, Cat6), Fiber Optic Cables (Single-mode, Multi-mode), Network Interface Cards (NICs), Hubs, Repeaters.
*   **Functions**:
    *   **Encoding**: How 0s and 1s are represented (e.g., +5V is a 1, 0V is a 0).
    *   **Physical Topology**: Mesh, Star, Bus, Ring.
    *   **Transmission Mode**: Simplex (One way), Half-Duplex (Walkie-talkie), Full-Duplex (Phone call).
*   **Troubleshooting**: "Is the cable plugged in?" "Is the light on the port green?"

### Layer 2: The Data Link Layer
At this layer, data packets are encoded and decoded into bits. It furnishes transmission protocol knowledge and management and handles errors in the physical layer, flow control and frame synchronization.
*   **PDU**: Frame.
*   **Addressing**: MAC Address (Media Access Control). This is a 48-bit hex address burned into the NIC (e.g., \`00:1A:2B:3C:4D:5E\`).
*   **Sublayers**:
    1.  **MAC (Media Access Control)**: Controls how a computer on the network gains access to the data and permission to transmit it.
    2.  **LLC (Logical Link Control)**: Controls frame synchronization, flow control, and error checking.
*   **Hardware**: Switches, Bridges.
*   **Protocols**: Ethernet (802.3), PPP, HDLC, Frame Relay, CDP/LLDP.

### Layer 3: The Network Layer
This layer provides switching and routing technologies, creating logical paths, known as virtual circuits, for transmitting data from node to node. Routing and forwarding are functions of this layer, as well as addressing, internetworking, error handling, congestion control and packet sequencing.
*   **PDU**: Packet.
*   **Addressing**: IP Address (Logical addressing, e.g., \`192.168.1.1\`).
*   **Functions**:
    *   **Logical Addressing**: Identifies devices across different networks.
    *   **Routing**: Determining the best path to a destination network.
    *   **Fragmentation**: Breaking down packets to fit the MTU (Maximum Transmission Unit) of the medium.
*   **Hardware**: Routers, Layer 3 Switches.
*   **Protocols**: IPv4, IPv6, ICMP, OSPF, EIGRP, BGP, IPsec.

### Layer 4: The Transport Layer
This layer provides transparent transfer of data between end systems, or hosts, and is responsible for end-to-end error recovery and flow control. It ensures complete data transfer.
*   **PDU**: Segment (TCP) or Datagram (UDP).
*   **Addressing**: Port Numbers (e.g., HTTP uses Port 80, HTTPS uses 443).
*   **Functions**:
    *   **Segmentation**: Breaking data from Layer 5 into manageable chunks.
    *   **Flow Control**: Windowing (Managing data rate so receiver isn't overwhelmed).
    *   **Error Correction**: Retransmission of lost segments (TCP only).
*   **Protocols**: TCP (Transmission Control Protocol), UDP (User Datagram Protocol).

### Layer 5: The Session Layer
This layer establishes, manages and terminates connections between applications. The session layer sets up, coordinates, and terminates conversations, exchanges, and dialogues between the applications at each end.
*   **Functions**: Authentication, Permissions, Session Restoration (checkpoints).
*   **Examples**: SQL Session management, RPC (Remote Procedure Call).

### Layer 6: The Presentation Layer
This layer provides independence from differences in data representation (e.g., encryption) by translating from application to network format, and vice versa. It works to transform data into the form that the application layer can accept.
*   **Functions**:
    *   **Translation**: ASCII to EBCDIC.
    *   **Encryption/Decryption**: SSL/TLS.
    *   **Compression**: ZIP, JPEG, MPEG.

### Layer 7: The Application Layer
This layer supports application and end-user processes. Communication partners are identified, quality of service is identified, user authentication and privacy are considered, and any constraints on data syntax are identified.
*   **Functions**: File transfer, Email, Remote Login.
*   **Protocols**: HTTP, HTTPS, FTP, SMTP, SSH, Telnet, DNS, DHCP.`
  },
  {
      id: 'fnd-topologies', title: 'Network Topologies: Architectures & Analysis', category: 'Network Fundamentals', difficulty: Difficulty.Beginner,
      description: 'Geometric arrangement of links and nodes: Mesh, Star, Bus, Ring, and Hybrid.', tags: ['Topology', 'Design', 'Cabling'],
      content: `### Network Topology Overview
Topology refers to the way in which a network is laid out physically. Two or more devices connect to a link; two or more links form a topology. The choice of topology impacts performance, cost, and reliability.

### 1. Mesh Topology
In a fully connected mesh topology, every device has a dedicated point-to-point link to every other device.
*   **Formula**: For *n* nodes, we need *n(n-1)/2* physical links.
*   **Advantages**:
    *   **Robustness**: If one link fails, it does not affect the entire system.
    *   **Privacy/Security**: Dedicated lines mean no shared traffic.
    *   **Fault Identification**: Easy to isolate breaks.
*   **Disadvantages**:
    *   **Cost**: Extremely expensive due to cabling and I/O ports required.
    *   **Installation**: Complex wiring in large networks.
*   **Use Case**: Core backbone of ISP networks, partial mesh in WANs.

### 2. Star Topology
Each device has a dedicated point-to-point link only to a central controller, usually called a **Hub** or **Switch**. Devices do not directly link to one another.
*   **Mechanism**: If Device A wants to send to Device B, it sends to the Hub, which relays it to B.
*   **Advantages**:
    *   **Cost**: Less cabling than Mesh.
    *   **Installation**: Easy to add new nodes.
    *   **Robustness**: If one link fails, only that node is down.
*   **Disadvantages**:
    *   **Single Point of Failure**: If the Hub/Switch fails, the whole network goes down.
*   **Use Case**: Modern Ethernet LANs (most common).

### 3. Bus Topology
A multipoint configuration. One long cable (the backbone) acts as a shared communication path that connects all devices in a network via tap lines and drop lines.
*   **Mechanism**: A signal transmitted travels the entire length of the cable. Terminators at ends absorb the signal to prevent reflection.
*   **Advantages**:
    *   **Ease of Installation**: Minimal cabling.
*   **Disadvantages**:
    *   **Fault Isolation**: Difficult to find a break.
    *   **Fragility**: A break in the main bus cable stops all transmission.
    *   **Signal Reflection**: Improper termination causes noise.
*   **Use Case**: Early Ethernet (10Base2, 10Base5). Rare today.

### 4. Ring Topology
Each device has a dedicated point-to-point connection with only the two devices on either side of it. A signal is passed along the ring in one direction, from device to device, until it reaches its destination.
*   **Mechanism**: Often uses a "Token" passing protocol.
*   **Advantages**:
    *   **Orderly**: Equal access to resources (Token).
*   **Disadvantages**:
    *   **Unidirectional Traffic**: A break in the ring can disable the entire network (unless dual-ring is used).
*   **Use Case**: IBM Token Ring, FDDI (Fiber Distributed Data Interface).

### 5. Hybrid Topology
A combination of two or more different topologies.
*   **Example**: A "Star-Bus" network where multiple Star networks are connected via a Bus backbone.
*   **Tree Topology**: A variation of Star. Nodes in a tree are linked to a central hub that controls the traffic to the network. However, not every device plugs directly into the central hub; some connect to secondary hubs.`
  },
  {
      id: 'phys-media', title: 'Transmission Media: Guided vs Unguided', category: 'Physical Layer & Cabling', difficulty: Difficulty.Beginner,
      description: 'Twisted Pair, Coaxial, Fiber Optic, and Wireless transmission physics.', tags: ['Cabling', 'Fiber', 'Wireless', 'Physics'],
      content: `### Transmission Media Classes
Transmission media is the physical path between transmitter and receiver. It is broadly classified into **Guided** (Wired) and **Unguided** (Wireless).

### 1. Guided Media (Wired)
Waves are guided along a solid medium.

#### A. Twisted Pair Cable
Consists of two conductors (normally copper), each with its own plastic insulation, twisted together.
*   **Why Twist?** To reduce **Crosstalk** and Electromagnetic Interference (EMI). One wire carries the signal, the other carries the inverse; noise affects both equally and is cancelled out at the receiver.
*   **Types**:
    *   **UTP (Unshielded Twisted Pair)**: Common in LANs (Cat5e, Cat6). Cheap, flexible.
    *   **STP (Shielded Twisted Pair)**: Has metal foil casing. Better noise immunity, more expensive.
*   **Connectors**: RJ-45.

#### B. Coaxial Cable
Carries signals of higher frequency ranges than twisted pair.
*   **Structure**: Inner conductor (copper core) -> Insulating material -> Outer conductor (shield/braid) -> Plastic cover.
*   **Categories**:
    *   **RG-59**: Video (CCTV).
    *   **RG-58**: Thin Ethernet (10Base2).
    *   **RG-11**: Thick Ethernet.
*   **Connectors**: BNC, T-Connectors.

#### C. Fiber Optic Cable
Transmits signals in the form of light (photons) rather than electricity. Based on the principle of **Total Internal Reflection**.
*   **Structure**: Core (Glass/Plastic) -> Cladding (Different density glass) -> Buffer Coating -> Jacket.
*   **Modes**:
    *   **Multimode**: Wider core. Multiple beams of light bounce around. High dispersion. Good for short distances (LANs). Source: LED.
    *   **Single-mode**: Tiny core. Single direct beam. Low dispersion. Good for long distances (ISP Backbones). Source: Laser.
*   **Advantages**: Immunity to EMI, massive bandwidth, low attenuation, lightweight.
*   **Disadvantages**: Expensive, difficult to splice/install, unidirectional (needs two strands for full duplex).

### 2. Unguided Media (Wireless)
Transport electromagnetic waves without using a physical conductor.

#### A. Radio Waves (3 kHz - 1 GHz)
*   **Propagation**: Omnidirectional.
*   **Use**: FM Radio, Television.

#### B. Microwaves (1 GHz - 300 GHz)
*   **Propagation**: Unidirectional (Line-of-Sight). Requires aligned antennas.
*   **Use**: Satellite communication, Point-to-Point WAN links, Cellular phones.

#### C. Infrared (300 GHz - 400 THz)
*   **Characteristics**: Cannot penetrate walls. Short range.
*   **Use**: TV Remotes, IrDA ports.`
  },
  {
    id: 'phys-mux-switch', title: 'Multiplexing & Switching Techniques', category: 'Physical Layer & Cabling', difficulty: Difficulty.Intermediate,
    description: 'FDM, TDM, WDM and Circuit vs Packet Switching.', tags: ['Multiplexing', 'Switching'],
    content: `### Multiplexing
Multiplexing is the set of techniques that allows the simultaneous transmission of multiple signals across a single data link.
*   **Goal**: Efficiency. Use the full bandwidth of the medium.

#### 1. Frequency Division Multiplexing (FDM)
*   **Analog** technique.
*   Bandwidth is divided into logical frequency channels.
*   **Guard Bands**: Unused strips of frequency to separate channels and prevent interference.
*   **Example**: FM Radio, Cable TV.

#### 2. Time Division Multiplexing (TDM)
*   **Digital** technique.
*   The entire bandwidth is used, but time is divided into slots. Each user gets the full channel for a tiny slice of time.
*   **Synchronous TDM**: Time slots are pre-assigned. If a user has no data, the slot is wasted.
*   **Statistical TDM**: Slots are allocated dynamically on demand. More efficient.

#### 3. Wavelength Division Multiplexing (WDM)
*   Used in **Fiber Optics**.
*   Different data streams are transmitted at different colors (wavelengths) of light down the same fiber strand.
*   **DWDM (Dense WDM)**: Can carry massive amounts of data (Terabits) by packing wavelengths very close together.

### Switching
A network is a set of connected switches. Switching is how data moves from input port to output port.

#### 1. Circuit Switching
*   **Phase 1**: Setup. A dedicated physical path is established before data moves.
*   **Phase 2**: Data Transfer. Continuous flow.
*   **Phase 3**: Teardown.
*   **Pros**: Guaranteed performance, no delay once started.
*   **Cons**: Inefficient (resources reserved even if silent).
*   **Example**: Old Telephone Network (PSTN).

#### 2. Packet Switching
Data is broken into packets. No dedicated path is reserved. Bandwidth is shared.

*   **Datagram Approach**:
    *   Each packet is treated independently.
    *   Packets may take different routes and arrive out of order.
    *   Robust but has latency/jitter.
    *   **Example**: The Internet (IP).

*   **Virtual Circuit Approach**:
    *   A logical path is setup, but physical resources are not strictly reserved like Circuit Switching.
    *   All packets follow the same path.
    *   **Example**: Frame Relay, ATM, MPLS.`
  },
  {
      id: 'l2-error-flow', title: 'Data Link Control: Error & Flow', category: 'L2 Switching & Bridging', difficulty: Difficulty.Intermediate,
      description: 'Framing, CRC, Checksums, and Sliding Window protocols.', tags: ['DLC', 'Error Correction', 'Flow Control'],
      content: `### Framing
The Data Link layer packs bits into frames.
*   **Character Count**: Header specifies number of characters. (Risk: If count is corrupted, sync is lost).
*   **Byte Stuffing**: Uses special flag bytes (e.g., 0x7E) to mark start/end. If the flag appears in data, an escape byte is added.
*   **Bit Stuffing**: Uses a pattern like 01111110. If sender sees five 1s in data, it inserts a 0 to prevent fake flags.

### Error Detection
How do we know if a bit flipped?
1.  **Parity Check**: Add 1 bit. Ensure total number of 1s is even (or odd). Detects single bit errors.
2.  **CRC (Cyclic Redundancy Check)**:
    *   Based on binary division.
    *   The data is treated as a polynomial.
    *   Divisor is a standard generator polynomial (e.g., CRC-32).
    *   The Remainder is appended to the frame.
    *   Receiver divides by same generator. If remainder is 0, frame is good.
3.  **Checksum**: Used in TCP/IP. Sums the data segments (1s complement arithmetic) and sends the complement of the sum.

### Error Correction
1.  **Hamming Code**: Adds redundant bits to specific positions (powers of 2). Can detect and *correct* single bit errors by identifying the position of the error.

### Flow Control
Prevents a fast sender from drowning a slow receiver.
1.  **Stop-and-Wait**:
    *   Sender sends Frame 0. Waits for ACK 0.
    *   If ACK doesn't arrive (timeout), retransmit.
    *   Inefficient for long distance (high propagation delay).
2.  **Sliding Window (Go-Back-N)**:
    *   Sender can have up to *N* unacknowledged frames in flight.
    *   If Frame 2 is lost, Receiver discards 3, 4, 5... and requests 2.
    *   Sender must go back and resend 2 and everything after.
3.  **Selective Repeat**:
    *   Receiver keeps 3, 4, 5 (buffered) and only requests 2.
    *   Sender only resends 2.
    *   More complex logic but efficient bandwidth usage.`
  },
  {
      id: 'l2-mac-sublayer', title: 'MAC Sublayer: ALOHA to CSMA/CD', category: 'L2 Switching & Bridging', difficulty: Difficulty.Advanced,
      description: 'How multiple devices share a single medium.', tags: ['MAC', 'CSMA', 'Ethernet'],
      content: `### The Multiple Access Problem
When nodes share a single link (like a bus or wireless airwaves), we need a protocol to determine who talks when to avoid collisions.

### 1. ALOHA (The Grandfather)
Developed at University of Hawaii for radio.
*   **Pure ALOHA**:
    *   Send whenever you have data.
    *   If collision (no ACK), wait a random time and resend.
    *   **Efficiency**: Very low (18.4% max throughput).
*   **Slotted ALOHA**:
    *   Time is divided into slots.
    *   You can only start sending at the beginning of a slot.
    *   Reduces collision window by half.
    *   **Efficiency**: Double of pure (36.8%).

### 2. CSMA (Carrier Sense Multiple Access)
"Listen before you talk."
*   **1-persistent**: Listen. If idle, transmit immediately with prob 1. (Aggressive).
*   **Non-persistent**: Listen. If busy, wait random time, then listen again. (Polite).
*   **p-persistent**: Listen. If idle, transmit with prob *p*, else wait.

### 3. CSMA/CD (Collision Detection)
Used in **Wired Ethernet** (Half-Duplex).
*   **Process**:
    1.  Listen. If idle, transmit.
    2.  While transmitting, monitor the line.
    3.  If signal energy spikes (collision), STOP transmitting immediately.
    4.  Send a **Jam Signal** (48 bits) to ensure everyone knows collision occurred.
    5.  Run **Binary Exponential Backoff** algorithm to determine wait time.

### 4. CSMA/CA (Collision Avoidance)
Used in **Wi-Fi (802.11)**.
*   We cannot detect collisions easily in wireless (hidden node problem).
*   **Process**:
    1.  Listen. If idle for DIFS time, send **RTS (Request to Send)**.
    2.  Receiver replies with **CTS (Clear to Send)**.
    3.  Sender sends data.
    4.  Receiver sends ACK.
*   RTS/CTS reserves the medium, warning other nodes to stay silent.`
  },
  {
    id: 'fnd-subnet', title: 'Subnetting Masterclass: From Binary to FLSM/VLSM', category: 'Network Fundamentals', difficulty: Difficulty.Intermediate,
    description: 'Master the art of IP addressing and subnet calculation.', tags: ['IP', 'Math', 'Subnetting'],
    content: `### Why do we Subnet?
Subnetting involves borrowing bits from the host portion of an IP address to create more network sub-divisions.
*   **Performance**: Reduces broadcast domains. A broadcast sent by one host is only received by hosts in that subnet, not the entire network.
*   **Security**: Departments (HR, Engineering) can be isolated.
*   **Address Conservation**: Using IPv4 efficiently.

### IP Address Structure (IPv4)
An IPv4 address is 32 bits long, divided into 4 octets (8 bits each).
*   Example: \`192.168.1.1\`
*   Binary: \`11000000.10101000.00000001.00000001\`

### The Subnet Mask
The mask tells the device which part of the IP is the **Network** and which part is the **Host**.
*   **/24** = \`255.255.255.0\` = \`11111111.11111111.11111111.00000000\`
*   First 24 bits are Network. Last 8 bits are Host.

### The "Magic Number" Method for Calculation
To quickly find subnet ranges without converting everything to binary:
1.  **Identify the Interesting Octet**: The octet where the subnet mask is not 0 or 255.
    *   Example: \`255.255.255.192\` (/26). The interesting octet is the 4th one (192).
2.  **Calculate the Block Size**: \`256 - Interesting Octet\`.
    *   \`256 - 192 = 64\`.
3.  **Determine the Subnets**: Start at 0 and count by the block size.
    *   Subnet 1: \`0\`
    *   Subnet 2: \`64\`
    *   Subnet 3: \`128\`
    *   Subnet 4: \`192\`
4.  **Determine Broadcast Addresses**: One less than the next subnet ID.
    *   Broadcast 1: \`63\`
    *   Broadcast 2: \`127\`

### VLSM (Variable Length Subnet Masking)
FLSM (Fixed Length) uses the same mask for all subnets (e.g., everyone gets a /24). This is wasteful.
VLSM allows different masks for different subnets based on need.
*   **Scenario**:
    *   Marketing needs 50 hosts -> Use /26 (64 hosts).
    *   WAN Link needs 2 hosts -> Use /30 (4 IPs, 2 usable).
*   **Process**: Always allocate the largest subnets first!
    1.  Assign /26 for Marketing.
    2.  Assign /30 for WAN from the remaining space.

### CIDR Reference Chart
*   **/32**: 1 IP (Host route)
*   **/30**: 4 IPs (2 Usable) - P2P Links
*   **/29**: 8 IPs (6 Usable)
*   **/28**: 16 IPs (14 Usable)
*   **/27**: 32 IPs (30 Usable)
*   **/26**: 64 IPs (62 Usable)
*   **/25**: 128 IPs (126 Usable)
*   **/24**: 256 IPs (254 Usable) - Standard LAN`
  },
  {
      id: 'l3-routing-algos', title: 'Routing Algorithms: Distance Vector vs Link State', category: 'L3 Routing & Architecture', difficulty: Difficulty.Advanced,
      description: 'The math behind RIP, OSPF, and how routers find paths.', tags: ['Routing', 'Algorithms', 'Dijkstra', 'Bellman-Ford'],
      content: `### The Routing Problem
A network is a graph. Routers are nodes; links are edges with "costs" (bandwidth, delay, hop count). The goal: Find the lowest cost path from Node A to Node B.

### 1. Distance Vector Routing (Bellman-Ford)
Used by **RIP** (Routing Information Protocol) and **IGRP**.
*   **Philosophy**: "Tell your neighbors everything you know about the world."
*   **Process**:
    1.  Each router maintains a table: {Destination, Cost, NextHop}.
    2.  Periodically send this entire table to direct neighbors.
    3.  Neighbor compares: "My neighbor can reach Net X in 3 hops. I am 1 hop from neighbor. So I can reach Net X in 4 hops."
    4.  If 4 < my current best, update table.
*   **Count-to-Infinity Problem**:
    *   If Link A-B fails, they might bounce updates back and forth incrementally (2, 3, 4, ... 16) believing the old path still exists.
    *   **Fixes**: Split Horizon (don't send info back to where you got it), Route Poisoning (set metric to 16/Infinity immediately).

### 2. Link State Routing (Dijkstra)
Used by **OSPF** and **IS-IS**.
*   **Philosophy**: "Tell everyone about your neighbors."
*   **Process**:
    1.  **Hello**: Discover neighbors.
    2.  **LSA (Link State Advertisement)**: Create a packet saying "I am connected to A and B with cost 10".
    3.  **Flooding**: Send this LSA to *everyone* in the network (not just neighbors).
    4.  **LSDB (Database)**: Every router builds an identical map of the entire network graph.
    5.  **SPF Algorithm (Dijkstra)**: Each router runs the math locally to calculate the Shortest Path Tree from *itself* to every destination.
*   **Pros**: Fast convergence, no loops, knows full topology.
*   **Cons**: CPU/Memory intensive.

### 3. Path Vector Routing
Used by **BGP** (Border Gateway Protocol).
*   Similar to Distance Vector but carries the full path (AS Path) to prevent loops.
*   Policy-based (select path based on business rules, not just speed).`
  },
  {
    id: 'l2-vlan-deep', title: 'VLANs and Trunks: Deep Dive', category: 'L2 Switching & Bridging', difficulty: Difficulty.Beginner,
    description: 'Virtual Local Area Networks and 802.1Q tagging.', tags: ['Switching', 'VLAN'],
    content: `### What is a VLAN?
A VLAN (Virtual LAN) logically groups devices together, regardless of their physical location on the switch. It splits a single physical switch into multiple logical switches.
*   **Broadcast Domain**: Each VLAN is its own broadcast domain. Traffic from VLAN 10 cannot reach VLAN 20 without a Router (Layer 3).

### Frame Tagging (802.1Q)
How does a switch know which packet belongs to which VLAN when sending data to another switch? It tags it.
*   **Standard Ethernet Frame**: [Dest MAC][Src MAC][Type][Data][FCS]
*   **802.1Q Frame**: [Dest MAC][Src MAC][**Tag 4 Bytes**][Type][Data][FCS]

#### The 4-Byte Tag
1.  **TPID (Tag Protocol ID)**: 0x8100. Identifies the frame as 802.1Q tagged.
2.  **PRI (Priority)**: 3 bits. Used for CoS (Class of Service) / QoS. Voice gets priority 5.
3.  **CFI (Canonical Format Indicator)**: 1 bit. Used for Token Ring compatibility (rarely used now).
4.  **VID (VLAN ID)**: 12 bits. The VLAN Number (1-4094).

### Access Ports vs Trunk Ports
*   **Access Port**: Connects to end devices (PCs, Printers). Sends **Untagged** frames. The switch adds the tag when entering, and strips it when exiting to the PC.
*   **Trunk Port**: Connects switches to switches (or routers/servers). Sends **Tagged** frames so the receiving device knows which VLAN the traffic belongs to.

### The Native VLAN
A safety mechanism for backward compatibility.
*   Traffic for the **Native VLAN** (Default: VLAN 1) traverses the trunk **UNTAGGED**.
*   **Security Risk**: VLAN Hopping attacks can exploit the native VLAN.
*   **Best Practice**: Change the Native VLAN to an unused ID (e.g., 999) on all trunk links.

### Voice VLAN
A feature to support VoIP phones. A phone typically has a PC connected to it.
*   The Port sends traffic for the Phone tagged (e.g., VLAN 50).
*   The Port sends traffic for the PC untagged (e.g., VLAN 10).
*   Ideally configured as a "Multi-VLAN Access Port".`
  },
  {
      id: 'l4-tcp-udp-deep', title: 'Transport Layer: TCP vs UDP Deep Dive', category: 'IP Services', difficulty: Difficulty.Intermediate,
      description: 'The engines of the internet. Headers, handshakes, and flow control.', tags: ['TCP', 'UDP', 'Transport'],
      content: `### User Datagram Protocol (UDP)
*   **Connectionless**: "Fire and forget." No handshake.
*   **Unreliable**: No ACKs. If a packet is lost, it's gone.
*   **Header (8 Bytes)**:
    *   Source Port (16 bits) | Dest Port (16 bits)
    *   Length (16 bits)      | Checksum (16 bits)
*   **Use Cases**: DNS, VoIP, Video Streaming, DHCP. (Speed > Reliability).

### Transmission Control Protocol (TCP)
*   **Connection-Oriented**: Establishes a virtual circuit.
*   **Reliable**: Guarantees delivery, order, and error check.

#### The TCP Header (20-60 Bytes)
1.  **Source/Dest Port**: Addressing applications.
2.  **Sequence Number**: Tracks byte order.
3.  **Ack Number**: Next expected byte.
4.  **Flags**:
    *   **SYN**: Synchronize (Start connection).
    *   **ACK**: Acknowledge.
    *   **FIN**: Finish (End connection).
    *   **RST**: Reset (Abort).
    *   **PSH**: Push (Don't buffer).
5.  **Window Size**: How much data can I receive right now?

#### Three-Way Handshake (Connection Setup)
1.  **SYN**: Client sends "Let's talk, I start at Seq 100".
2.  **SYN-ACK**: Server sends "Okay, I start at Seq 500. I expect 101 next".
3.  **ACK**: Client sends "Roger that, I expect 501 next".
*   Connection is ESTABLISHED.

#### TCP Congestion Control
How does TCP prevent network collapse?
*   **Slow Start**: Start sending small amounts. Exponentially increase window size for every successful ACK.
*   **Congestion Avoidance**: If packet loss occurs (timeout), drop transmission rate drastically (usually to half or 1 MSS) and ramp up linearly.
*   **Leaky Bucket Algorithm**: Enforces constant output rate regardless of input burstiness.
*   **Token Bucket Algorithm**: Allows burstiness up to a limit (tokens accumulated).`
  },
  {
      id: 'sec-crypto', title: 'Cryptography & Network Security', category: 'Network Security', difficulty: Difficulty.Advanced,
      description: 'Encryption types, Digital Signatures, and PKI.', tags: ['Security', 'Encryption', 'RSA'],
      content: `### Goals of Security (CIA Triad)
1.  **Confidentiality**: Only authorized users can read data (Encryption).
2.  **Integrity**: Data has not been altered (Hashing).
3.  **Availability**: Data is accessible when needed (DDoS protection).

### Symmetric Encryption (Private Key)
The same key is used to Encrypt and Decrypt.
*   **Analogy**: A door key. You need a copy to lock it and unlock it.
*   **Algorithms**: DES (Old), 3DES, **AES** (Standard, 128/256 bit).
*   **Pros**: Fast. Good for bulk data.
*   **Cons**: Key Exchange. How do I get the key to you securely without someone stealing it?

### Asymmetric Encryption (Public Key)
Two keys are used: **Public** and **Private**.
*   **Logic**:
    *   Encrypt with Public Key -> Only Private Key can Decrypt. (Confidentiality).
    *   Encrypt with Private Key -> Public Key can Decrypt. (Authentication/Signature).
*   **Algorithms**: **RSA**, Elliptic Curve (ECC), Diffie-Hellman.
*   **Pros**: Solves Key Exchange.
*   **Cons**: Slow. CPU intensive.

### Digital Signatures
Ensures Integrity and Non-Repudiation.
1.  Sender takes a **Hash** (MD5/SHA) of the message.
2.  Sender encrypts the Hash with their **Private Key**.
3.  Receiver decrypts signature with Sender's **Public Key**.
4.  Receiver calculates their own hash of the message.
5.  If hashes match, the message is authentic and from the sender.

### Application: HTTPS (SSL/TLS)
Uses both!
1.  **Handshake**: Uses Asymmetric (RSA) to verify identity (Certificate) and securely exchange a "Session Key".
2.  **Data Transfer**: Uses Symmetric (AES) with the Session Key to encrypt the actual web traffic (because it's faster).`
  },
  {
      id: 'app-protocols', title: 'Application Layer Protocols: DNS, HTTP, SMTP', category: 'IP Services', difficulty: Difficulty.Intermediate,
      description: 'How the web and email actually work.', tags: ['DNS', 'HTTP', 'Email'],
      content: `### Domain Name System (DNS)
The phonebook of the internet. Translates \`google.com\` to \`142.250.1.1\`.
*   **Hierarchy**:
    *   **Root (.)**: Top of the tree.
    *   **TLD (Top Level Domain)**: .com, .org, .edu.
    *   **Authoritative**: The server that actually holds the record for a specific domain.
*   **Recursive Query**: Client asks server: "Find this for me." Server does the legwork.
*   **Iterative Query**: Server tells client: "I don't know, ask this guy."

### HyperText Transfer Protocol (HTTP)
*   **Request**: Method (GET/POST) + URL + Headers.
*   **Response**: Status Code (200 OK, 404 Not Found, 500 Error) + Body.
*   **Stateless**: Server forgets the client after the response. Cookies are used to maintain state (sessions).

### Electronic Mail (SMTP, POP3, IMAP)
*   **SMTP (Simple Mail Transfer Protocol)**: PUSH protocol. Used to send mail from Client to Server, and between Servers.
*   **POP3 (Post Office Protocol)**: PULL. Downloads email to client and deletes from server (usually).
*   **IMAP (Internet Message Access Protocol)**: PULL. Syncs email. Mail stays on server. Folders are synced.`
  },
  {
    id: 'l3-ospf-deep', title: 'OSPF Areas and LSA Types', category: 'L3 Routing & Architecture', difficulty: Difficulty.Expert,
    description: 'Detailed breakdown of Link-State architecture.', tags: ['OSPF', 'LSA'],
    content: `### OSPF Hierarchy
OSPF uses a two-tier hierarchy to scale.
*   **Area 0 (Backbone Area)**: All other areas must connect to this.
*   **Regular Areas (Non-backbone)**: Connected to Area 0. Prevents LSDB from becoming too huge.

### Router Roles
*   **Internal Router**: All interfaces in one area.
*   **ABR (Area Border Router)**: Interfaces in multiple areas (Must touch Area 0). Generates LSA Type 3.
*   **ASBR (Autonomous System Boundary Router)**: Connects OSPF to another protocol (e.g., BGP or Static). Generates LSA Type 5.

### LSA Types (Link State Advertisements)
The building blocks of the LSDB.
1.  **Type 1 (Router LSA)**: "I am Router A, I have these neighbors." Flooded within an area only.
2.  **Type 2 (Network LSA)**: Generated by the DR (Designated Router). Lists all routers on a shared segment (Ethernet). Flooded within an area.
3.  **Type 3 (Summary LSA)**: Generated by ABR. "I know how to reach Network X in another area." Flooded to other areas.
4.  **Type 4 (ASBR Summary)**: Generated by ABR. "Here is how you reach the ASBR."
5.  **Type 5 (External LSA)**: Generated by ASBR. "Here is a route redistributed from outside OSPF." Flooded everywhere.
7.  **Type 7 (NSSA External)**: Similar to Type 5, but for "Not-So-Stubby Areas" that don't allow Type 5s.

### OSPF Network Types
*   **Broadcast**: Default on Ethernet. Elects DR/BDR. Hello timer 10s.
*   **Point-to-Point**: Default on Serial/PPP. No DR/BDR. Faster convergence.
*   **Non-Broadcast (NBMA)**: Frame Relay. Neighbors must be statically defined.`
  },
  {
      id: 'l2-arp', title: 'ARP (Address Resolution Protocol)', category: 'Network Fundamentals', difficulty: Difficulty.Beginner,
      description: 'Mapping IP addresses to MAC addresses.', tags: ['ARP', 'Layer 2', 'Addressing'],
      content: `### What is ARP?
ARP is the glue between Layer 2 (MAC) and Layer 3 (IP). When a device knows the IP of a destination but not the MAC, it broadcasts an ARP Request.

### The ARP Process
1.  **Request**: Host A (192.168.1.10) wants to talk to Host B (192.168.1.20).
2.  Host A checks its **ARP Table**. If empty, it broadcasts: "Who has 192.168.1.20? Tell 192.168.1.10".
    *   Dest MAC: \`FFFF.FFFF.FFFF\` (Broadcast)
3.  **Reply**: Host B hears the broadcast. It replies directly to Host A: "I am 192.168.1.20, my MAC is BB:BB:BB...".
4.  **Caching**: Host A saves this mapping in its ARP Cache.`
  }
];

export const VENDOR_GUIDES: VendorGuide[] = [
  {
    id: 'cisco-ios', vendorId: 'cisco', title: 'Cisco IOS/IOS-XE Router & Switch',
    difficulty: Difficulty.Intermediate, description: 'Standard CLI for ISR, CSR, and Catalyst.',
    sections: [
      {
        title: 'Initial Config & SSH',
        cliCommands: `enable\nconf t\nhostname R1\nip domain-name lab.local\ncrypto key generate rsa modulus 2048\nusername admin priv 15 secret cisco\nline vty 0 4\ntransport input ssh\nlogin local`,
        guiSteps: ['GUI not typically used for basic CLI initialization. Use Console.'],
        guiContext: 'system'
      },
      {
        title: 'ROAS (Router on a Stick)',
        cliCommands: `interface g0/0.10\nencapsulation dot1q 10\nip address 192.168.10.1 255.255.255.0\ninterface g0/0.20\nencapsulation dot1q 20\nip address 192.168.20.1 255.255.255.0\ninterface g0/0\nno shut`,
        guiSteps: ['N/A for CLI focused devices.'],
        guiContext: 'interface'
      },
      {
        title: 'Essential Commands Reference',
        cliCommands: `! 1. show running-config
!    Displays the complete current configuration that is active in the device's memory (RAM).
show running-config

! 2. show startup-config
!    Displays the configuration file stored in non-volatile memory (NVRAM).
show startup-config

! 3. show ip interface brief
!    Provides a quick, one-line summary of all interfaces, status, and IP.
show ip interface brief

! 4. show interface <interface>
!    Displays detailed statistics, operational status, and Layer 2/3 info.
show interface GigabitEthernet0/0

! 5. show ip route
!    Displays the device's complete routing table (FIB).
show ip route

! 6. show version
!    Displays system hardware, software version, hostname, and uptime.
show version

! 7. show clock
!    Displays the current system date and time.
show clock

! 8. show history
!    Lists the most recently executed commands.
show history

! 9. ping <ip_address>
!    Sends ICMP echo requests to verify basic Layer 3 connectivity.
ping 8.8.8.8

! 10. traceroute <ip_address>
!    Traces the path (hop-by-hop) to a destination.
traceroute 8.8.8.8

! 11. show ospf neighbor
!    Displays the status of OSPF adjacencies.
show ospf neighbor

! 12. show bgp summary
!    Displays a summary of BGP session status.
show bgp summary

! 13. show vrrp interface <int>
!    Displays VRRP status and configuration.
show vrrp interface GigabitEthernet0/1

! 14. clear counters <interface>
!    Resets input/output packet and byte counters.
clear counters GigabitEthernet0/1`,
        guiSteps: ['Most validation is done via CLI.', 'Use "Monitor" tab for Interface graphs.'],
        guiContext: 'system'
      }
    ]
  },
  {
      id: 'juniper-junos', vendorId: 'juniper', title: 'Juniper Junos OS',
      difficulty: Difficulty.Intermediate, description: 'CLI for MX Routers, EX Switches, and SRX Firewalls.',
      sections: [
          {
              title: 'Essential Commands Reference',
              cliCommands: `# 1. show configuration
#    Displays the current committed configuration.
show configuration

# 2. show interfaces terse
#    Concise summary of interfaces and IPs.
show interfaces terse

# 3. show interfaces
#    Detailed statistics and counters.
show interfaces

# 4. show route
#    Displays the forwarding/routing table.
show route

# 5. show version
#    Displays Junos OS version and hardware details.
show version

# 6. show system uptime
#    Displays total operating time since reboot.
show system uptime

# 7. show cli history
#    Displays command history.
show cli history

# 8. ping <ip_address>
#    Tests Layer 3 reachability.
ping 8.8.8.8

# 9. traceroute <ip_address>
#    Traces route to destination.
traceroute 8.8.8.8

# 10. show ospf neighbor
#    Displays OSPF neighbor status.
show ospf neighbor

# 11. show bgp summary
#    Displays BGP session status.
show bgp summary

# 12. show vrrp interface <interface>
#    Displays VRRP status.
show vrrp interface ge-0/0/0

# 13. show log messages
#    Displays system logs and events.
show log messages

# 14. clear interface statistics <interface>
#    Clears operational counters.
clear interface statistics ge-0/0/0`,
              guiSteps: ['Navigate to Monitor > Interfaces', 'Navigate to Monitor > Routing'],
              guiContext: 'system'
          }
      ]
  },
  {
      id: 'fortinet-fgt', vendorId: 'fortinet', title: 'FortiGate Firewall',
      difficulty: Difficulty.Intermediate, description: 'FortiOS interface and policy configuration.',
      sections: [
          {
              title: 'Interface Config',
              cliCommands: `config system interface\n edit port1\n  set mode static\n  set ip 192.168.1.99 255.255.255.0\n  set allowaccess http https ssh ping\n next\nend`,
              guiSteps: ['Network > Interfaces', 'Double Click port1', 'Set Addressing Mode to Manual', 'Enter IP/Netmask', 'Enable HTTPS, SSH, PING'],
              guiContext: 'interface'
          }
      ]
  },
  {
      id: 'palo-panos', vendorId: 'paloalto', title: 'Palo Alto NGFW',
      difficulty: Difficulty.Advanced, description: 'PAN-OS Zone and Policy Management.',
      sections: [
          {
              title: 'Zone & Interface',
              cliCommands: `configure\nset network interface ethernet ethernet1/1 layer3 ip 10.0.0.1/24\nset network zone trust layer3 ethernet1/1\ncommit`,
              guiSteps: ['Network > Interfaces > Ethernet1/1', 'Interface Type: Layer3', 'IPv4 Tab: Add IP', 'Network > Zones', 'Add "Trust" Zone, add eth1/1'],
              guiContext: 'interface'
          }
      ]
  }
];

// --- LAB SESSIONS (V3 - SOW HYBRID INSTANCES) ---

const createDevice = (id: string, name: string, type: 'Router'|'Switch'|'Firewall'|'AccessPoint'|'Cloud', vendor: 'Cisco'|'Juniper'|'Fortinet'|'Palo Alto'|'Aruba'|'Extreme'|'Internet', initialConfig?: Partial<DeviceState>): DeviceState => ({
    id, name, type, vendor,
    cliMode: 'user', cliContext: [],
    interfaces: initialConfig?.interfaces || {},
    routes: initialConfig?.routes || [], 
    policies: initialConfig?.policies || [], 
    vlans: initialConfig?.vlans || {},
    history: initialConfig?.history || [`Welcome to ${name} (${vendor})`]
});

export const LAB_SESSIONS: LabSession[] = [
  {
    id: 'lab-instance-a',
    title: 'Instance A: Cisco Core + Fortinet Edge',
    description: 'Hybrid SOW Topology. Cisco Switching/Routing providing L3 Gateway, connecting to FortiGate for NAT/Security.',
    difficulty: Difficulty.Intermediate,
    vendor: 'Hybrid',
    devices: {
        'dev-client': createDevice('dev-client', 'Client-VLAN10', 'AccessPoint', 'Cisco', {
             interfaces: { 'eth0': { name: 'eth0', ip: '192.168.10.10', mask: '255.255.255.0', up: true } },
             history: ['PC Terminal', 'IP: 192.168.10.10', 'Gateway: 192.168.10.1']
        }),
        'dev-sw': createDevice('dev-sw', 'Core-SW', 'Switch', 'Cisco', {
            interfaces: { 
                'Vlan10': { name: 'Vlan10', ip: '192.168.10.1', mask: '255.255.255.0', up: true, description: 'GW-Client' },
                'Gi0/1': { name: 'Gi0/1', ip: '', mask: '', up: true, description: 'Downlink' },
                'Gi0/2': { name: 'Gi0/2', ip: '192.168.20.1', mask: '255.255.255.252', up: true, description: 'Uplink-Rtr' } // Routed Link
            },
            routes: [{ destination: '0.0.0.0/0', nextHop: '192.168.20.2' }]
        }),
        'dev-rtr': createDevice('dev-rtr', 'Edge-Rtr', 'Router', 'Cisco', {
            interfaces: {
                'Gi0/0': { name: 'Gi0/0', ip: '192.168.20.2', mask: '255.255.255.252', up: true, description: 'Downlink-SW' },
                'Gi0/1': { name: 'Gi0/1', ip: '10.0.0.1', mask: '255.255.255.252', up: true, description: 'Uplink-FW' }
            },
            routes: [
                { destination: '192.168.10.0/24', nextHop: '192.168.20.1', interface: 'Gi0/0' },
                { destination: '0.0.0.0/0', nextHop: '10.0.0.2', interface: 'Gi0/1' }
            ]
        }),
        'dev-fw': createDevice('dev-fw', 'FortiGate', 'Firewall', 'Fortinet', {
            interfaces: {
                'port2': { name: 'port2', ip: '10.0.0.2', mask: '255.255.255.252', up: true, zone: 'LAN' },
                'port1': { name: 'port1', ip: '203.0.113.2', mask: '255.255.255.252', up: true, zone: 'WAN' }
            },
            routes: [{ destination: '192.168.0.0/16', nextHop: '10.0.0.1' }, { destination: '0.0.0.0/0', nextHop: '203.0.113.1' }],
            policies: [{ id: 1, name: 'LAN_TO_WAN', fromZone: 'port2', toZone: 'port1', action: 'allow', srcAddr: 'all', dstAddr: 'all' }]
        }),
        'dev-isp': createDevice('dev-isp', 'ISP-Cloud', 'Cloud', 'Internet', {
             interfaces: { 'eth0': { name: 'eth0', ip: '203.0.113.1', mask: '255.255.255.252', up: true } },
             history: ['ISP Provider Gateway']
        })
    },
    topology: [
        { deviceId: 'dev-client', label: 'Client', icon: 'AccessPoint', x: 50, y: 150 },
        { deviceId: 'dev-sw', label: 'Cisco SW', icon: 'Switch', x: 250, y: 150 },
        { deviceId: 'dev-rtr', label: 'Cisco Rtr', icon: 'Router', x: 450, y: 150 },
        { deviceId: 'dev-fw', label: 'FortiGate', icon: 'Firewall', x: 650, y: 150 },
        { deviceId: 'dev-isp', label: 'ISP', icon: 'Cloud', x: 850, y: 150 }
    ],
    objectives: [
        'Verify Client (192.168.10.10) Gateway Reachability',
        'Check Cisco Switch Routing Table (0.0.0.0/0 via Router)',
        'Verify FortiGate NAT Policy LAN_TO_WAN'
    ],
    documentation: {
        initialConfig: `
! Cisco Switch
interface Vlan10
 ip address 192.168.10.1 255.255.255.0
!
interface Gi0/2
 no switchport
 ip address 192.168.20.1 255.255.255.252
!
ip route 0.0.0.0 0.0.0.0 192.168.20.2

! Cisco Router
interface Gi0/0
 ip address 192.168.20.2 255.255.255.252
!
interface Gi0/1
 ip address 10.0.0.1 255.255.255.252
!
ip route 0.0.0.0 0.0.0.0 10.0.0.2

! FortiGate
config system interface
 edit port1
  set ip 203.0.113.2 255.255.255.252
 next
 edit port2
  set ip 10.0.0.2 255.255.255.252
 next
end
        `,
        packetFlow: `
1. Client (192.168.10.10) sends packet to 8.8.8.8.
2. Switch receives on Access Port. Lookups Routing Table. Matches 0.0.0.0/0 via 192.168.20.2.
3. Switch forwards to Router via Gi0/2.
4. Router receives on Gi0/0. Lookups Routing Table. Matches 0.0.0.0/0 via 10.0.0.2.
5. Router forwards to FortiGate via Gi0/1.
6. FortiGate receives on Port2. Matches Policy "LAN_TO_WAN".
7. FortiGate performs Source NAT (Overload) to 203.0.113.2.
8. FortiGate forwards to ISP.
        `
    }
  },
  {
    id: 'lab-instance-b',
    title: 'Instance B: Cisco Core + Palo Alto Edge',
    description: 'Hybrid SOW Topology. Cisco Core with Palo Alto NGFW for perimeter security.',
    difficulty: Difficulty.Advanced,
    vendor: 'Hybrid',
    devices: {
        'dev-client': createDevice('dev-client', 'Client-VLAN10', 'AccessPoint', 'Cisco', { interfaces: { 'eth0': { name: 'eth0', ip: '192.168.10.10', mask: '255.255.255.0', up: true } } }),
        'dev-sw': createDevice('dev-sw', 'Core-SW', 'Switch', 'Cisco', {
            interfaces: { 
                'Vlan10': { name: 'Vlan10', ip: '192.168.10.1', mask: '255.255.255.0', up: true },
                'Gi0/2': { name: 'Gi0/2', ip: '192.168.20.1', mask: '255.255.255.252', up: true }
            },
            routes: [{ destination: '0.0.0.0/0', nextHop: '192.168.20.2' }]
        }),
        'dev-rtr': createDevice('dev-rtr', 'Edge-Rtr', 'Router', 'Cisco', {
            interfaces: {
                'Gi0/0': { name: 'Gi0/0', ip: '192.168.20.2', mask: '255.255.255.252', up: true },
                'Gi0/1': { name: 'Gi0/1', ip: '10.0.0.1', mask: '255.255.255.252', up: true }
            },
            routes: [{ destination: '0.0.0.0/0', nextHop: '10.0.0.2' }]
        }),
        'dev-fw': createDevice('dev-fw', 'PA-Firewall', 'Firewall', 'Palo Alto', {
            interfaces: {
                'ethernet1/2': { name: 'ethernet1/2', ip: '10.0.0.2', mask: '255.255.255.252', up: true, zone: 'TRUST' },
                'ethernet1/1': { name: 'ethernet1/1', ip: '203.0.113.2', mask: '255.255.255.252', up: true, zone: 'UNTRUST' }
            },
            routes: [{ destination: '0.0.0.0/0', nextHop: '203.0.113.1' }],
            policies: [{ id: 1, name: 'Allow-Outbound', fromZone: 'TRUST', toZone: 'UNTRUST', action: 'allow', srcAddr: 'any', dstAddr: 'any' }]
        }),
        'dev-isp': createDevice('dev-isp', 'ISP-Cloud', 'Cloud', 'Internet', { interfaces: { 'eth0': { name: 'eth0', ip: '203.0.113.1', mask: '255.255.255.252', up: true } } })
    },
    topology: [
        { deviceId: 'dev-client', label: 'Client', icon: 'AccessPoint', x: 50, y: 150 },
        { deviceId: 'dev-sw', label: 'Cisco SW', icon: 'Switch', x: 250, y: 150 },
        { deviceId: 'dev-rtr', label: 'Cisco Rtr', icon: 'Router', x: 450, y: 150 },
        { deviceId: 'dev-fw', label: 'Palo Alto', icon: 'Firewall', x: 650, y: 150 },
        { deviceId: 'dev-isp', label: 'ISP', icon: 'Cloud', x: 850, y: 150 }
    ],
    objectives: ['Check Palo Alto Zone Configuration', 'Verify Routing on Cisco Router'],
    documentation: {
        initialConfig: `... See Instance A for Cisco details ... \n\n! Palo Alto\nset network interface ethernet ethernet1/2 layer3 ip 10.0.0.2/30\nset network interface ethernet ethernet1/1 layer3 ip 203.0.113.2/30`,
        packetFlow: `Packet traverses Cisco Core similar to Instance A. At Palo Alto:\n1. Ingress Eth1/2 (Trust).\n2. Route Lookup > 0.0.0.0/0 via Eth1/1.\n3. Security Policy "Allow-Outbound" Checked.\n4. NAT Applied.\n5. Egress Eth1/1.`
    }
  },
  {
    id: 'lab-instance-c',
    title: 'Instance C: Juniper Core + Fortinet Edge',
    description: 'Hybrid SOW Topology. Juniper EX/MX Core with FortiGate.',
    difficulty: Difficulty.Advanced,
    vendor: 'Hybrid',
    devices: {
        'dev-client': createDevice('dev-client', 'Client', 'AccessPoint', 'Juniper', { interfaces: { 'eth0': { name: 'eth0', ip: '192.168.10.10', mask: '255.255.255.0', up: true } } }),
        'dev-sw': createDevice('dev-sw', 'EX-Switch', 'Switch', 'Juniper', {
             interfaces: { 
                 'irb.10': { name: 'irb.10', ip: '192.168.10.1', mask: '255.255.255.0', up: true },
                 'ge-0/0/1': { name: 'ge-0/0/1', ip: '192.168.20.1', mask: '255.255.255.252', up: true }
             },
             routes: [{ destination: '0.0.0.0/0', nextHop: '192.168.20.2' }]
        }),
        'dev-rtr': createDevice('dev-rtr', 'MX-Router', 'Router', 'Juniper', {
             interfaces: {
                 'ge-0/0/0': { name: 'ge-0/0/0', ip: '192.168.20.2', mask: '255.255.255.252', up: true },
                 'ge-0/0/1': { name: 'ge-0/0/1', ip: '10.0.0.1', mask: '255.255.255.252', up: true }
             },
             routes: [{ destination: '0.0.0.0/0', nextHop: '10.0.0.2' }]
        }),
        'dev-fw': createDevice('dev-fw', 'FortiGate', 'Firewall', 'Fortinet', {
            interfaces: {
                'port2': { name: 'port2', ip: '10.0.0.2', mask: '255.255.255.252', up: true, zone: 'LAN' },
                'port1': { name: 'port1', ip: '203.0.113.2', mask: '255.255.255.252', up: true, zone: 'WAN' }
            },
            routes: [{ destination: '0.0.0.0/0', nextHop: '203.0.113.1' }]
        }),
        'dev-isp': createDevice('dev-isp', 'ISP', 'Cloud', 'Internet', { interfaces: { 'eth0': { name: 'eth0', ip: '203.0.113.1', mask: '255.255.255.252', up: true } } })
    },
    topology: [
        { deviceId: 'dev-client', label: 'Client', icon: 'AccessPoint', x: 50, y: 150 },
        { deviceId: 'dev-sw', label: 'Juniper EX', icon: 'Switch', x: 250, y: 150 },
        { deviceId: 'dev-rtr', label: 'Juniper MX', icon: 'Router', x: 450, y: 150 },
        { deviceId: 'dev-fw', label: 'FortiGate', icon: 'Firewall', x: 650, y: 150 },
        { deviceId: 'dev-isp', label: 'ISP', icon: 'Cloud', x: 850, y: 150 }
    ],
    objectives: ['Verify Junos Static Routes', 'Check FortiOS Interfaces'],
    documentation: {
        initialConfig: `! Juniper EX\nset interfaces irb unit 10 family inet address 192.168.10.1/24\nset routing-options static route 0.0.0.0/0 next-hop 192.168.20.2\n\n! Juniper MX\nset interfaces ge-0/0/0 unit 0 family inet address 192.168.20.2/30`,
        packetFlow: `Packet traverses Juniper Core. IRB.10 routes to MX ge-0/0/0. MX routes to FortiGate Port2.`
    }
  },
  {
    id: 'lab-instance-d',
    title: 'Instance D: Juniper Core + Palo Alto Edge',
    description: 'Hybrid SOW Topology. Juniper Core with Palo Alto NGFW.',
    difficulty: Difficulty.Advanced,
    vendor: 'Hybrid',
    devices: {
        'dev-client': createDevice('dev-client', 'Client', 'AccessPoint', 'Juniper', { interfaces: { 'eth0': { name: 'eth0', ip: '192.168.10.10', mask: '255.255.255.0', up: true } } }),
        'dev-sw': createDevice('dev-sw', 'EX-Switch', 'Switch', 'Juniper', {
             interfaces: { 'irb.10': { name: 'irb.10', ip: '192.168.10.1', mask: '255.255.255.0', up: true }, 'ge-0/0/1': { name: 'ge-0/0/1', ip: '192.168.20.1', mask: '255.255.255.252', up: true } },
             routes: [{ destination: '0.0.0.0/0', nextHop: '192.168.20.2' }]
        }),
        'dev-rtr': createDevice('dev-rtr', 'MX-Router', 'Router', 'Juniper', {
             interfaces: { 'ge-0/0/0': { name: 'ge-0/0/0', ip: '192.168.20.2', mask: '255.255.255.252', up: true }, 'ge-0/0/1': { name: 'ge-0/0/1', ip: '10.0.0.1', mask: '255.255.255.252', up: true } },
             routes: [{ destination: '0.0.0.0/0', nextHop: '10.0.0.2' }]
        }),
        'dev-fw': createDevice('dev-fw', 'PA-Firewall', 'Firewall', 'Palo Alto', {
            interfaces: { 'ethernet1/2': { name: 'ethernet1/2', ip: '10.0.0.2', mask: '255.255.255.252', up: true, zone: 'TRUST' }, 'ethernet1/1': { name: 'ethernet1/1', ip: '203.0.113.2', mask: '255.255.255.252', up: true, zone: 'UNTRUST' } },
            routes: [{ destination: '0.0.0.0/0', nextHop: '203.0.113.1' }]
        }),
        'dev-isp': createDevice('dev-isp', 'ISP', 'Cloud', 'Internet', { interfaces: { 'eth0': { name: 'eth0', ip: '203.0.113.1', mask: '255.255.255.252', up: true } } })
    },
    topology: [
        { deviceId: 'dev-client', label: 'Client', icon: 'AccessPoint', x: 50, y: 150 },
        { deviceId: 'dev-sw', label: 'Juniper EX', icon: 'Switch', x: 250, y: 150 },
        { deviceId: 'dev-rtr', label: 'Juniper MX', icon: 'Router', x: 450, y: 150 },
        { deviceId: 'dev-fw', label: 'Palo Alto', icon: 'Firewall', x: 650, y: 150 },
        { deviceId: 'dev-isp', label: 'ISP', icon: 'Cloud', x: 850, y: 150 }
    ],
    objectives: ['Verify Junos to PAN-OS connectivity', 'Check Default Route on MX'],
    documentation: {
        initialConfig: `... See Instance C for Juniper and Instance B for Palo Alto details ...`,
        packetFlow: `Combined flow of Juniper Switching/Routing logic and Palo Alto Zone-based Security logic.`
    }
  }
];

export const CERTIFICATIONS: Certification[] = [
  { id: 'ccna', vendorId: 'cisco', name: 'Cisco CCNA', level: 'Associate', description: '200-301. The gold standard.', costInr: 25500, examCode: '200-301' },
  { id: 'encor', vendorId: 'cisco', name: 'Cisco CCNP ENCOR', level: 'Professional', description: '350-401. Core Enterprise.', costInr: 34000, examCode: '350-401' },
  { id: 'jncia', vendorId: 'juniper', name: 'JNCIA-Junos', level: 'Associate', description: 'Juniper entry-level.', costInr: 16500, examCode: 'JN0-104' },
  { id: 'jncis-sec', vendorId: 'juniper', name: 'JNCIS-SEC', level: 'Professional', description: 'Security Specialist.', costInr: 24000, examCode: 'JN0-335' },
  { id: 'nse4', vendorId: 'fortinet', name: 'Fortinet NSE 4', level: 'Professional', description: 'FortiGate Security.', costInr: 33000, examCode: 'NSE4' },
  { id: 'pcnse', vendorId: 'paloalto', name: 'Palo Alto PCNSE', level: 'Professional', description: 'Network Security Engineer.', costInr: 14500, examCode: 'PCNSE' },
  { id: 'acsa', vendorId: 'aruba', name: 'Aruba ACSA', level: 'Associate', description: 'Campus Switching.', costInr: 19000, examCode: 'HPE6-A72' },
  { id: 'ecs', vendorId: 'extreme', name: 'Extreme Certified Specialist', level: 'Associate', description: 'Campus EXOS Switching.', costInr: 18000, examCode: 'ECS-Switching' },
  { id: 'aws-saa', vendorId: 'aws', name: 'AWS Solutions Arch.', level: 'Associate', description: 'Cloud Fundamentals.', costInr: 13000, examCode: 'SAA-C03' },
];
