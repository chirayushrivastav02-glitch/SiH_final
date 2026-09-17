// src/components/InnovationHeatmap.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import {
  MapPin, Layers, Plus, Minus, RotateCcw,
  Heart, Bus, Leaf, Sun, GraduationCap, ShieldAlert,
  ArrowRight, Sparkles, Filter, Calendar, BarChart2, ChevronDown,
  Building2
} from 'lucide-react';

import indiaDistrictSvgData from '../data/indiaDistrictSvgData.json';
import { mockChallenges } from '../data/mockData';

// 10 Key Problem Hubs mapped to exact GIS coordinates in indiaDistrictSvgData
const districtData = [
  {
    id: 'maharashtra-mumbai',
    districtKey: 'maharashtra-greater-bombay',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    region: 'Western India',
    heatLevel: 'high',
    demandBadge: 'High Demand',
    totalProblems: 142,
    totalBudget: '₹ 520 Cr',
    qualifiedStartups: 45,
    unmatchedChallenges: 31,
    mapCoords: { x: 135.6, y: 397.8 },
    heatColor: '#ef4444', // High Demand Red Heat
    categories: [
      { name: 'Healthcare', count: 42, percent: 30, color: '#ec4899' },
      { name: 'Infrastructure', count: 38, percent: 27, color: '#3b82f6' },
      { name: 'Transport', count: 28, percent: 20, color: '#06b6d4' },
      { name: 'Environment', count: 20, percent: 14, color: '#10b981' },
      { name: 'Education', count: 14, percent: 9, color: '#eab308' },
    ],
    problemsDetail: [
      { tag: 'Health', text: 'AI-Powered Water Quality Monitoring', color: '#ec4899' },
      { tag: 'Infra', text: 'Smart Solid Waste Management System', color: '#3b82f6' },
      { tag: 'Trans', text: 'Monorail Automated Signaling AI', color: '#06b6d4' },
      { tag: 'Env', text: 'Marine Plastic Skimmer Grid', color: '#10b981' },
    ],
    topChallenges: [
      { id: 'CH-2024-001', title: mockChallenges[0]?.title || 'AI-Powered Water Quality Monitoring', category: 'Water & Sanitation', budget: '₹ 4.5 Cr', icon: Heart, iconColor: '#ec4899', iconBg: 'rgba(236,72,153,0.15)' },
      { id: 'CH-2024-002', title: mockChallenges[1]?.title || 'Smart Solid Waste Management System', category: 'Urban Development', budget: '₹ 8.2 Cr', icon: Building2, iconColor: '#3b82f6', iconBg: 'rgba(59,130,246,0.15)' },
      { id: 'c8', title: 'Flood Warning & Pumping Control', category: 'Environment', budget: '₹ 4.2 Cr', icon: ShieldAlert, iconColor: '#ef4444', iconBg: 'rgba(239,68,68,0.15)' },
    ]
  },
  {
    id: 'karnataka-bengaluru',
    districtKey: 'karnataka-bangalore-urban',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    region: 'Southern India',
    heatLevel: 'high',
    demandBadge: 'High Demand',
    totalProblems: 127,
    totalBudget: '₹ 450 Cr',
    qualifiedStartups: 34,
    unmatchedChallenges: 28,
    mapCoords: { x: 215.6, y: 516.3 },
    heatColor: '#f97316', // High Demand Orange Heat
    categories: [
      { name: 'Healthcare', count: 42, percent: 33, color: '#ec4899' },
      { name: 'Infrastructure', count: 28, percent: 22, color: '#3b82f6' },
      { name: 'Transport', count: 18, percent: 14, color: '#06b6d4' },
      { name: 'Environment', count: 12, percent: 9, color: '#10b981' },
      { name: 'Education', count: 10, percent: 8, color: '#eab308' },
      { name: 'Others', count: 17, percent: 14, color: '#8b5cf6' },
    ],
    problemsDetail: [
      { tag: 'Infra', text: 'Urban Water Supply Network', color: '#3b82f6' },
      { tag: 'Health', text: 'Digital Health Monitoring', color: '#ec4899' },
      { tag: 'Edu', text: 'AI Curriculum Gaps', color: '#eab308' },
      { tag: 'Health', text: 'Distal Health Monitoring', color: '#ec4899' },
    ],
    topChallenges: [
      { id: 'c1', title: 'AI-based early disease detection', category: 'Healthcare', budget: '₹ 20 Cr', icon: Heart, iconColor: '#ec4899', iconBg: 'rgba(236,72,153,0.15)' },
      { id: 'c2', title: 'Smart traffic management system', category: 'Transport', budget: '₹ 30 Cr', icon: Bus, iconColor: '#06b6d4', iconBg: 'rgba(6,182,212,0.15)' },
      { id: 'c3', title: 'Urban waste management', category: 'Environment', budget: '₹ 35 Cr', icon: Leaf, iconColor: '#10b981', iconBg: 'rgba(16,185,129,0.15)' },
    ]
  },
  {
    id: 'delhi-ncr',
    districtKey: 'delhi-delhi',
    district: 'New Delhi',
    state: 'Delhi NCR',
    region: 'Northern India',
    heatLevel: 'high',
    demandBadge: 'High Demand',
    totalProblems: 115,
    totalBudget: '₹ 380 Cr',
    qualifiedStartups: 50,
    unmatchedChallenges: 19,
    mapCoords: { x: 207.1, y: 214.4 },
    heatColor: '#ef4444', // High Demand Red Heat
    categories: [
      { name: 'Environment', count: 45, percent: 39, color: '#10b981' },
      { name: 'Healthcare', count: 30, percent: 26, color: '#ec4899' },
      { name: 'Transport', count: 20, percent: 17, color: '#06b6d4' },
      { name: 'Infrastructure', count: 12, percent: 10, color: '#3b82f6' },
      { name: 'Education', count: 8, percent: 8, color: '#eab308' },
    ],
    problemsDetail: [
      { tag: 'Env', text: 'AQI Mitigation & Smog Towers', color: '#10b981' },
      { tag: 'Health', text: 'Air Quality Emergency Alerts', color: '#ec4899' },
      { tag: 'Trans', text: 'EV Fleet Charging Grid', color: '#06b6d4' },
    ],
    topChallenges: [
      { id: 'c9', title: 'Stubble Burning Satellite Detection AI', category: 'Environment', budget: '₹ 50 Cr', icon: Leaf, iconColor: '#10b981', iconBg: 'rgba(16,185,129,0.15)' },
      { id: 'c10', title: 'Smart EV Charging Network Dispatch', category: 'Transport', budget: '₹ 32 Cr', icon: Bus, iconColor: '#06b6d4', iconBg: 'rgba(6,182,212,0.15)' },
    ]
  },
  {
    id: 'up-lucknow',
    districtKey: 'uttar-pradesh-lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    region: 'Northern India',
    heatLevel: 'high',
    demandBadge: 'High Demand',
    totalProblems: 110,
    totalBudget: '₹ 410 Cr',
    qualifiedStartups: 22,
    unmatchedChallenges: 35,
    mapCoords: { x: 272.7, y: 249.2 },
    heatColor: '#f97316',
    categories: [
      { name: 'Healthcare', count: 40, percent: 36, color: '#ec4899' },
      { name: 'Education', count: 35, percent: 32, color: '#eab308' },
      { name: 'Infrastructure', count: 20, percent: 18, color: '#3b82f6' },
      { name: 'Transport', count: 15, percent: 14, color: '#06b6d4' },
    ],
    problemsDetail: [
      { tag: 'Health', text: 'Rural Primary Health Center AI', color: '#ec4899' },
      { tag: 'Edu', text: 'Digital Learning Devices for Schools', color: '#eab308' },
    ],
    topChallenges: [
      { id: 'c15', title: 'AI Diagnostics for Tele-Health Clinics', category: 'Healthcare', budget: '₹ 34 Cr', icon: Heart, iconColor: '#ec4899', iconBg: 'rgba(236,72,153,0.15)' },
    ]
  },
  {
    id: 'westbengal-kolkata',
    districtKey: 'west-bengal-kolkata',
    district: 'Kolkata',
    state: 'West Bengal',
    region: 'Eastern India',
    heatLevel: 'high',
    demandBadge: 'High Demand',
    totalProblems: 104,
    totalBudget: '₹ 330 Cr',
    qualifiedStartups: 24,
    unmatchedChallenges: 20,
    mapCoords: { x: 401.6, y: 331.3 }, // Exact Kolkata GIS location inside West Bengal!
    heatColor: '#f59e0b',
    categories: [
      { name: 'Infrastructure', count: 38, percent: 37, color: '#3b82f6' },
      { name: 'Environment', count: 30, percent: 29, color: '#10b981' },
      { name: 'Healthcare', count: 22, percent: 21, color: '#ec4899' },
      { name: 'Others', count: 14, percent: 13, color: '#8b5cf6' },
    ],
    problemsDetail: [
      { tag: 'Infra', text: 'Heritage Structure Moisture IoT', color: '#3b82f6' },
      { tag: 'Env', text: 'Sundarbans Coastal Alert System', color: '#10b981' },
    ],
    topChallenges: [
      { id: 'c13', title: 'River Embankment Erosion Early Warning', category: 'Environment', budget: '₹ 27 Cr', icon: ShieldAlert, iconColor: '#ef4444', iconBg: 'rgba(239,68,68,0.15)' },
    ]
  },
  {
    id: 'telangana-hyderabad',
    districtKey: 'andhra-pradesh-hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    region: 'Central/Southern India',
    heatLevel: 'high',
    demandBadge: 'High Demand',
    totalProblems: 98,
    totalBudget: '₹ 360 Cr',
    qualifiedStartups: 40,
    unmatchedChallenges: 21,
    mapCoords: { x: 230.8, y: 430.8 },
    heatColor: '#f59e0b',
    categories: [
      { name: 'Healthcare', count: 38, percent: 39, color: '#ec4899' },
      { name: 'Education', count: 25, percent: 25, color: '#eab308' },
      { name: 'Infrastructure', count: 20, percent: 20, color: '#3b82f6' },
      { name: 'Environment', count: 15, percent: 16, color: '#10b981' },
    ],
    problemsDetail: [
      { tag: 'Health', text: 'Genomic Health Diagnostics', color: '#ec4899' },
      { tag: 'Edu', text: 'Govt School Coding Labs', color: '#eab308' },
    ],
    topChallenges: [
      { id: 'c12', title: 'AI Diagnostics for District Hospitals', category: 'Healthcare', budget: '₹ 38 Cr', icon: Heart, iconColor: '#ec4899', iconBg: 'rgba(236,72,153,0.15)' },
    ]
  },
  {
    id: 'jk-srinagar',
    districtKey: 'jammu-and-kashmir-srinagar',
    district: 'Srinagar',
    state: 'Jammu & Kashmir',
    region: 'Northern India',
    heatLevel: 'medium',
    demandBadge: 'Moderate Demand',
    totalProblems: 92,
    totalBudget: '₹ 310 Cr',
    qualifiedStartups: 20,
    unmatchedChallenges: 25,
    mapCoords: { x: 194.2, y: 90.0 },
    heatColor: '#10b981',
    categories: [
      { name: 'Infrastructure', count: 35, percent: 38, color: '#3b82f6' },
      { name: 'Tourism & Env', count: 25, percent: 27, color: '#10b981' },
      { name: 'Healthcare', count: 18, percent: 20, color: '#ec4899' },
      { name: 'Education', count: 14, percent: 15, color: '#eab308' },
    ],
    problemsDetail: [
      { tag: 'Infra', text: 'Snowmelt Monitoring & Avalanche AI', color: '#3b82f6' },
      { tag: 'Env', text: 'Dal Lake Water Quality Sensors', color: '#10b981' },
    ],
    topChallenges: [
      { id: 'c-jk', title: 'Dal Lake Eco-monitoring & Cleanliness IoT', category: 'Environment', budget: '₹ 28 Cr', icon: Leaf, iconColor: '#10b981', iconBg: 'rgba(16,185,129,0.15)' }
    ]
  },
  {
    id: 'gujarat-ahmedabad',
    districtKey: 'gujarat-ahmadabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    region: 'Western India',
    heatLevel: 'medium',
    demandBadge: 'Moderate Demand',
    totalProblems: 88,
    totalBudget: '₹ 310 Cr',
    qualifiedStartups: 29,
    unmatchedChallenges: 14,
    mapCoords: { x: 123.3, y: 327.5 },
    heatColor: '#10b981',
    categories: [
      { name: 'Transport', count: 32, percent: 36, color: '#06b6d4' },
      { name: 'Infrastructure', count: 28, percent: 32, color: '#3b82f6' },
      { name: 'Healthcare', count: 18, percent: 20, color: '#ec4899' },
      { name: 'Education', count: 10, percent: 12, color: '#eab308' },
    ],
    problemsDetail: [
      { tag: 'Trans', text: 'BRTS Automated Traffic Light Sync', color: '#06b6d4' },
      { tag: 'Infra', text: 'Industrial Waste Water Tracking', color: '#3b82f6' },
    ],
    topChallenges: [
      { id: 'c14', title: 'Industrial Effluent Discharge Monitor', category: 'Environment', budget: '₹ 25 Cr', icon: Leaf, iconColor: '#10b981', iconBg: 'rgba(16,185,129,0.15)' },
    ]
  },
  {
    id: 'assam-guwahati',
    districtKey: 'assam-kamrup',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    region: 'Northeastern India',
    heatLevel: 'medium',
    demandBadge: 'Moderate Demand',
    totalProblems: 88,
    totalBudget: '₹ 260 Cr',
    qualifiedStartups: 18,
    unmatchedChallenges: 24,
    mapCoords: { x: 457.8, y: 262.0 },
    heatColor: '#06b6d4',
    categories: [
      { name: 'Environment', count: 35, percent: 40, color: '#10b981' },
      { name: 'Infrastructure', count: 28, percent: 32, color: '#3b82f6' },
      { name: 'Healthcare', count: 15, percent: 17, color: '#ec4899' },
      { name: 'Education', count: 10, percent: 11, color: '#eab308' },
    ],
    problemsDetail: [
      { tag: 'Env', text: 'Brahmaputra Flood Level Sensors', color: '#10b981' },
    ],
    topChallenges: [
      { id: 'c16', title: 'Brahmaputra Flood Risk AI Analytics', category: 'Environment', budget: '₹ 22 Cr', icon: ShieldAlert, iconColor: '#ef4444', iconBg: 'rgba(239,68,68,0.15)' }
    ]
  },
  {
    id: 'tamilnadu-chennai',
    districtKey: 'tamil-nadu-chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    region: 'Southern India',
    heatLevel: 'medium',
    demandBadge: 'Moderate Demand',
    totalProblems: 84,
    totalBudget: '₹ 290 Cr',
    qualifiedStartups: 26,
    unmatchedChallenges: 15,
    mapCoords: { x: 261.5, y: 514.3 },
    heatColor: '#06b6d4',
    categories: [
      { name: 'Infrastructure', count: 30, percent: 36, color: '#3b82f6' },
      { name: 'Healthcare', count: 24, percent: 28, color: '#ec4899' },
      { name: 'Transport', count: 15, percent: 18, color: '#06b6d4' },
      { name: 'Education', count: 15, percent: 18, color: '#eab308' },
    ],
    problemsDetail: [
      { tag: 'Infra', text: 'Desalination Plant IoT Control', color: '#3b82f6' },
      { tag: 'Health', text: 'Tele-medicine Rural Clinics', color: '#ec4899' },
    ],
    topChallenges: [
      { id: 'c11', title: 'Submersible Coastal Drain Sensors', category: 'Infrastructure', budget: '₹ 22 Cr', icon: Building2, iconColor: '#3b82f6', iconBg: 'rgba(59,130,246,0.15)' },
    ]
  }
];

// District with the absolute most problems (default on initial render)
const topCityMostProblems = districtData.reduce((prev, curr) => (prev.totalProblems > curr.totalProblems) ? prev : curr);

export default function InnovationHeatmap() {
  const navigate = useNavigate();
  // Selected state starts at the state with the MOST problems
  const [selectedState, setSelectedState] = useState(topCityMostProblems.state);
  const [hoveredState, setHoveredState] = useState(null);

  const [viewBy, setViewBy] = useState('Problem Demand');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [timePeriod, setTimePeriod] = useState('Last 2 Years');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [is3DView, setIs3DView] = useState(true);

  const normalizeStateName = (name) => {
    if (!name) return '';
    return name.replace('&', 'and').toLowerCase().trim();
  };

  // Aggregate problems per state
  const stateTotals = useMemo(() => {
    const totals = {};
    districtData.forEach(d => {
      const norm = normalizeStateName(d.state);
      totals[norm] = (totals[norm] || 0) + d.totalProblems;
    });
    return totals;
  }, []);

  const maxStateProblems = useMemo(() => {
    let max = 0;
    Object.values(stateTotals).forEach(v => { if (v > max) max = v; });
    return max;
  }, [stateTotals]);

  // Pre-calculate grouped state boundary SVG paths for bright state-border outline hierarchy
  const stateBoundaries = useMemo(() => {
    const map = {};
    indiaDistrictSvgData.districts.forEach(d => {
      if (!map[d.state]) map[d.state] = [];
      map[d.state].push(d.path);
    });
    return Object.entries(map).map(([stateName, paths]) => ({
      state: stateName,
      combinedPath: paths.join(' ')
    }));
  }, []);

  // Pre-calculate districtData lookups for O(1) matching during render
  const districtMap = useMemo(() => {
    const map = new Map();
    indiaDistrictSvgData.districts.forEach(dist => {
      const activeDistInfo = districtData.find(d => d.districtKey === dist.id || dist.id.includes(d.district.toLowerCase().replace(' ', '-')));
      map.set(dist.id, activeDistInfo);
    });
    return map;
  }, []);

  // Pre-render the 3D base layers which don't depend on hover states
  const threeDBaseLayers = useMemo(() => {
    if (!is3DView) return null;
    return (
      <g pointerEvents="none">
        <g transform="translate(8, 22)" fill="var(--hm-3d-base1)" opacity="0.95">
          {stateBoundaries.map((sb, idx) => (
            <path key={`3d-base-shadow-${idx}`} d={sb.combinedPath} />
          ))}
        </g>
        <g transform="translate(6, 16)" fill="var(--hm-3d-base2)" opacity="0.9">
          {stateBoundaries.map((sb, idx) => (
            <path key={`3d-base-w1-${idx}`} d={sb.combinedPath} />
          ))}
        </g>
        <g transform="translate(4, 11)" fill="var(--hm-3d-base3)" opacity="0.85">
          {stateBoundaries.map((sb, idx) => (
            <path key={`3d-base-w2-${idx}`} d={sb.combinedPath} />
          ))}
        </g>
        <g transform="translate(2, 6)" fill="var(--hm-3d-base4)" opacity="0.8">
          {stateBoundaries.map((sb, idx) => (
            <path key={`3d-base-w3-${idx}`} d={sb.combinedPath} />
          ))}
        </g>
      </g>
    );
  }, [is3DView, stateBoundaries]);


  // Active district for details panel:
  const activeDistrict = districtData.find(d => d.state === (hoveredState || selectedState)) || topCityMostProblems;
  const maxProblems = topCityMostProblems.totalProblems; // 142

  return (
    <section className="innovation-heatmap-section" style={{
      padding: '56px 32px',
      background: 'var(--hm-bg)',
      borderTop: '1px solid var(--hm-border)',
      borderBottom: '1px solid var(--hm-border)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Glow Ambiance */}
      <div style={{
        position: 'absolute', top: -80, left: '15%', width: 600, height: 600,
        background: 'var(--hm-glow)',
        pointerEvents: 'none', filter: 'blur(50px)'
      }} />

      <div style={{ maxWidth: 1360, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Top Header & Filter Controls Bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 28, flexWrap: 'wrap', gap: 20
        }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 8
            }}>
              Explore • Analyze • Innovate
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 800,
              color: 'var(--hm-text-main)',
              lineHeight: 1.1,
              margin: 0
            }}>
              Innovation <span style={{
                background: 'linear-gradient(135deg, #a855f7, #6366f1, #38bdf8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Intelligence Map</span>
            </h2>
            <p style={{
              color: '#94a3b8', fontSize: 14, marginTop: 8, maxWidth: 640, lineHeight: 1.5
            }}>
              Discover where government problems are most needed, where startups can make an impact, and where innovation gaps exist — across India.
            </p>
          </div>

          {/* 3 Top Selector Controls */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* View By */}
            <div style={{
              background: 'var(--hm-panel)', border: '1px solid var(--hm-border)',
              borderRadius: 'var(--radius-lg)', padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer'
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8'
              }}>
                <BarChart2 size={16} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>View By</span>
                <select
                  value={viewBy}
                  onChange={e => setViewBy(e.target.value)}
                  style={{
                    background: 'transparent', border: 'none', color: 'var(--hm-text-main)',
                    fontSize: 13, fontWeight: 700, outline: 'none', cursor: 'pointer', paddingRight: 4
                  }}
                >
                  <option value="Problem Demand" style={{ background: 'var(--hm-panel)' }}>Problem Demand</option>
                  <option value="Total Budget" style={{ background: 'var(--hm-panel)' }}>Total Budget</option>
                  <option value="Qualified Startups" style={{ background: 'var(--hm-panel)' }}>Qualified Startups</option>
                </select>
              </div>
              <ChevronDown size={14} style={{ color: '#64748b' }} />
            </div>

            {/* Category */}
            <div style={{
              background: 'var(--hm-panel)', border: '1px solid var(--hm-border)',
              borderRadius: 'var(--radius-lg)', padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer'
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'rgba(6,182,212,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee'
              }}>
                <Filter size={16} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>Category</span>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  style={{
                    background: 'transparent', border: 'none', color: 'var(--hm-text-main)',
                    fontSize: 13, fontWeight: 700, outline: 'none', cursor: 'pointer'
                  }}
                >
                  <option value="All Categories" style={{ background: 'var(--hm-panel)' }}>All Categories</option>
                  <option value="Healthcare" style={{ background: 'var(--hm-panel)' }}>Healthcare</option>
                  <option value="Infrastructure" style={{ background: 'var(--hm-panel)' }}>Infrastructure</option>
                  <option value="Transport" style={{ background: 'var(--hm-panel)' }}>Transport</option>
                  <option value="Environment" style={{ background: 'var(--hm-panel)' }}>Environment</option>
                  <option value="Education" style={{ background: 'var(--hm-panel)' }}>Education</option>
                </select>
              </div>
              <ChevronDown size={14} style={{ color: '#64748b' }} />
            </div>

            {/* Time Period */}
            <div style={{
              background: 'var(--hm-panel)', border: '1px solid var(--hm-border)',
              borderRadius: 'var(--radius-lg)', padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer'
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'rgba(168,85,247,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc'
              }}>
                <Calendar size={16} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>Time Period</span>
                <select
                  value={timePeriod}
                  onChange={e => setTimePeriod(e.target.value)}
                  style={{
                    background: 'transparent', border: 'none', color: 'var(--hm-text-main)',
                    fontSize: 13, fontWeight: 700, outline: 'none', cursor: 'pointer'
                  }}
                >
                  <option value="Last 2 Years" style={{ background: 'var(--hm-panel)' }}>Last 2 Years</option>
                  <option value="Last 1 Year" style={{ background: 'var(--hm-panel)' }}>Last 1 Year</option>
                  <option value="All Time" style={{ background: 'var(--hm-panel)' }}>All Time</option>
                </select>
              </div>
              <ChevronDown size={14} style={{ color: '#64748b' }} />
            </div>

          </div>
        </div>


        {/* Main 2-Column Grid: Official Real 3D India Map (Left) + Side Panel (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
          gap: 24,
          alignItems: 'stretch'
        }}>
          
          {/* LEFT: 3D INDIA VECTOR MAP CANVAS (594 Real Administrative Districts!) */}
          <div style={{
            background: 'var(--hm-map-bg)',
            border: '1px solid var(--hm-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            minHeight: 620,
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            overflow: 'hidden'
          }}>
            
            {/* Zoom Controls */}
            <div style={{
              position: 'absolute', top: 20, left: 20, zIndex: 10,
              display: 'flex', flexDirection: 'column', gap: 4,
              background: 'var(--hm-glass-bg)',
              border: '1px solid var(--hm-border)',
              borderRadius: 'var(--radius-md)', padding: 4, backdropFilter: 'blur(8px)'
            }}>
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.5))}
                title="Zoom In"
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: 6, cursor: 'pointer', borderRadius: 4 }}
                onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
                title="Zoom Out"
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: 6, cursor: 'pointer', borderRadius: 4 }}
                onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >
                <Minus size={16} />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                title="Reset View"
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: 6, cursor: 'pointer', borderRadius: 4 }}
                onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIs3DView(prev => !prev)}
                title={is3DView ? "Switch to Flat 2D View" : "Switch to 3D Perspective View"}
                style={{
                  background: is3DView ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  border: is3DView ? '1px solid #38bdf8' : 'none',
                  color: is3DView ? '#38bdf8' : '#94a3b8',
                  padding: '4px 8px', cursor: 'pointer', borderRadius: 4,
                  display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700
                }}
              >
                <Layers size={14} />
                <span>{is3DView ? '3D ON' : '2D'}</span>
              </button>
            </div>

            {/* OFFICIAL HIGH-PRECISION 594 DISTRICT INDIA MAP SVG */}
            <div style={{
              width: '100%', height: '100%', minHeight: 490, position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: `${is3DView ? 'perspective(900px) rotateX(24deg) rotateZ(-3deg) scale(0.92)' : 'perspective(none) rotateX(0deg) rotateZ(0deg) scale(1)'} scale(${zoomLevel})`, transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)', transformOrigin: 'center center', transformStyle: 'preserve-3d'
            }}>
              
              <svg viewBox={indiaDistrictSvgData.viewBox} style={{ width: '100%', maxHeight: 520, filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.9))' }}>
                <defs>
                  {/* Clip Path combining all 594 district polygons so heat stays 100% inside India */}
                  <clipPath id="officialIndiaDistrictClip">
                    {indiaDistrictSvgData.districts.map((dist, idx) => (
                      <path key={`clip-${idx}`} d={dist.path} />
                    ))}
                  </clipPath>

                  {/* Heatmap blur filter */}
                  <filter id="officialThermalBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="22" />
                  </filter>

                  {/* 3D Extrusion Shadow Filter */}
                  <filter id="official3DShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#000000" floodOpacity="0.9" /><feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.2" />
                  </filter>
                </defs>

                {/* Water Body Names */}
                <text x="40" y="420" fill="var(--hm-text-muted)" fontSize="12" fontWeight="700" letterSpacing="0.1em">ARABIAN SEA</text>
                <text x="460" y="520" fill="var(--hm-text-muted)" fontSize="12" fontWeight="700" letterSpacing="0.1em">BAY OF BENGAL</text>
                <text x="240" y="670" fill="var(--hm-text-muted)" fontSize="12" fontWeight="700" letterSpacing="0.1em">INDIAN OCEAN</text>

                {/* 3D ISOMETRIC EXTENSION: Physical 20px cliff slab only rendered in 3D mode */}
                {threeDBaseLayers}

                {/* MAIN MAP TERRAIN: ALL 594 REAL ADMINISTRATIVE DISTRICT POLYGONS OF INDIA!
                    - Visible White District Boundary Lines (`stroke="rgba(255,255,255,0.4)"`, `strokeWidth="0.8"`)
                    - Districts with active government problems rendered in dark navy `#0c2242`
                    - Districts with NO active government problems rendered in neutral slate `#071526`
                */}
                <g filter="url(#official3DShadow)">
                  {stateBoundaries.map((sb, idx) => {
                    const total = stateTotals[normalizeStateName(sb.state)] || 0;
                    const hasProblems = total > 0;

                    const isStateHovered = hoveredState === sb.state;
                    const isStateSelected = selectedState === sb.state;
                    const isPopupActive = isStateHovered || isStateSelected;

                    const defaultEmptyColor = getComputedStyle(document.documentElement).getPropertyValue('--hm-district-empty').trim() || '#e2e8f0';
                    let fillColor = defaultEmptyColor;
                    
                    if (hasProblems) {
                      const ratio = total / (maxStateProblems || 1);
                      if (ratio < 0.25) fillColor = '#06b6d4'; // Cyan for low
                      else if (ratio < 0.5) fillColor = '#10b981'; // Green for med-low
                      else if (ratio < 0.75) fillColor = '#f59e0b'; // Yellow/Orange for med-high
                      else fillColor = '#ef4444'; // Red for high
                      
                      // Darken slightly if hovered/selected for feedback
                      if (isPopupActive) {
                        if (fillColor === '#06b6d4') fillColor = '#0891b2';
                        else if (fillColor === '#10b981') fillColor = '#059669';
                        else if (fillColor === '#f59e0b') fillColor = '#d97706';
                        else if (fillColor === '#ef4444') fillColor = '#dc2626';
                      }
                    }

                    return (
                      <path
                        key={`state-${idx}`}
                        d={sb.combinedPath}
                        fill={fillColor}
                        stroke="none"
                        strokeWidth="0"
                        strokeLinejoin="round"
                        style={{ transition: 'all 0.2s ease', cursor: hasProblems ? 'pointer' : 'default' }}
                        onMouseEnter={() => setHoveredState(sb.state)}
                        onMouseLeave={() => setHoveredState(null)}
                        onClick={() => setSelectedState(sb.state)}
                      >
                        <title>{sb.state}</title>
                      </path>
                    );
                  })}
                </g>

                {/* STATE BORDER OVERLAY LAYER */}
                <g pointerEvents="none">
                  {stateBoundaries.map((sb, idx) => (
                    <path
                      key={`state-border-${idx}`}
                      d={sb.combinedPath}
                      fill="none"
                      stroke="var(--hm-border)"
                      strokeWidth="1.2"
                      strokeOpacity="0.8"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  ))}
                </g>

                {/* Removed Dynamic Thermal Heatmap Circles per user request */}

                {/* EXACT DISTRICT-LEVEL HOTSPOT PINS & NODES */}
                {districtData.map(d => {
                  const isHovered = hoveredState === d.state;
                  const isSelected = selectedState === d.state;
                  const pinColor = d.heatColor;

                  // Is this pin active (popped up)? Only when hovered or selected!
                  const isActivePin = isHovered || isSelected;

                  return (
                    <g
                      key={`pin-${d.id}`}
                      transform={`translate(${d.mapCoords.x}, ${d.mapCoords.y})`}
                      onMouseEnter={() => setHoveredState(d.state)}
                      onMouseLeave={() => setHoveredState(null)}
                      onClick={() => setSelectedState(d.state)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* District Dot on Map */}
                      <circle
                        r={isActivePin ? 10 : 5}
                        fill={pinColor}
                        stroke="#ffffff"
                        strokeWidth={isActivePin ? 2 : 1}
                        opacity={isActivePin ? 1 : 0.85}
                        style={{ filter: `drop-shadow(0 0 8px ${pinColor})`, transition: 'all 0.2s ease' }}
                      />

                      {/* POPPED UP TEARDROP PIN (Appears over district when hovered or selected!) */}
                      {isActivePin && (
                        <g transform="translate(0, -4)" style={{
                            transform: is3DView ? 'rotateX(-24deg) translateZ(12px)' : 'none',
                            transformOrigin: '0 0',
                            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}>
                          <path
                            d="M 0 0 C -7 -10 -10 -15 -10 -20 C -10 -26 -5 -30 0 -30 C 5 -30 10 -26 10 -20 C 10 -15 7 -10 0 0 Z"
                            fill={pinColor}
                            stroke="#ffffff"
                            strokeWidth="2"
                            style={{ filter: `drop-shadow(0 6px 12px ${pinColor}90)` }}
                          />
                          <circle cx="0" cy="-20" r="3.5" fill="#ffffff" />
                        </g>
                      )}

                      {/* Pulsing Outer Ring when Hovered */}
                      {isHovered && (
                        <circle r="16" fill="none" stroke={pinColor} strokeWidth="2" opacity="0.8">
                          <animate attributeName="r" values="8;22;8" dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* HOVER GLASS POPUP CARD OVER DISTRICT MAP — ONLY SHOWN WHEN HOVERED OR SELECTED! */}
                {(hoveredState || selectedState) && (() => {
                  const activePopupState = hoveredState || selectedState;
                  const stateDistricts = districtData.filter(d => normalizeStateName(d.state) === normalizeStateName(activePopupState));
                  if (stateDistricts.length === 0) return null;
                  
                  const hoveredDist = {
                    ...stateDistricts[0],
                    totalProblems: stateDistricts.reduce((sum, d) => sum + d.totalProblems, 0),
                    problemsDetail: stateDistricts.flatMap(d => d.problemsDetail),
                    district: stateDistricts.map(d => d.district).join(', ')
                  };

                  return (
                    <g
                      transform={`translate(${Math.min(Math.max(hoveredDist.mapCoords.x - 120, 20), 340)}, ${Math.max(hoveredDist.mapCoords.y - 215, 20)})`}
                      style={{ transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)', pointerEvents: 'none' }}
                    >
                      <foreignObject width="265" height="205">
                        <div style={{
                          background: 'var(--hm-glass-bg)',
                          border: `1px solid ${hoveredDist.heatColor}`,
                          borderRadius: 'var(--radius-lg)',
                          padding: '14px 16px',
                          boxShadow: `0 16px 40px rgba(0,0,0,0.85), 0 0 24px ${hoveredDist.heatColor}40`,
                          backdropFilter: 'blur(12px)',
                          color: 'var(--hm-text-main)',
                          fontFamily: 'var(--font-primary)'
                        }}>
                          {/* Popup Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 10 }}>
                            <div>
                              <div style={{ fontSize: 10, color: hoveredDist.heatColor, fontWeight: 700, letterSpacing: '0.04em' }}>
                                {hoveredDist.state} • {hoveredDist.region}
                              </div>
                              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--hm-text-main)', marginTop: 2 }}>
                                {hoveredDist.district}
                              </div>
                            </div>
                            <span style={{
                              background: `${hoveredDist.heatColor}25`,
                              border: `1px solid ${hoveredDist.heatColor}`,
                              color: '#ffffff',
                              borderRadius: 'var(--radius-full)', padding: '2px 8px', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap'
                            }}>
                              {hoveredDist.demandBadge}
                            </span>
                          </div>

                          {/* Problems Detail Snippet */}
                          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>Problems Detail</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                            {hoveredDist.problemsDetail.slice(0, 3).map((p, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#cbd5e1' }}>
                                <span style={{
                                  display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                                  background: p.color, boxShadow: `0 0 6px ${p.color}`
                                }} />
                                <span style={{ color: p.color, fontWeight: 700 }}>[{p.tag}]</span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 155 }}>{p.text}</span>
                              </div>
                            ))}
                          </div>

                          {/* Bottom Metric Pill */}
                          <div style={{
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 'var(--radius-md)', padding: '6px 10px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}>
                            <span style={{ fontSize: 11, color: '#94a3b8' }}>Total District Problems</span>
                            <span style={{ fontSize: 13, fontWeight: 800, color: hoveredDist.heatColor }}>{hoveredDist.totalProblems}</span>
                          </div>
                        </div>
                      </foreignObject>
                    </g>
                  );
                })()}

              </svg>
            </div>

            {/* Bottom Controls Bar on Map Canvas */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: 16, zIndex: 10, flexWrap: 'wrap', gap: 12
            }}>
              {/* Heat Legend */}
              <div style={{
                background: 'var(--hm-panel-inner)',
                border: '1px solid var(--hm-border)',
                borderRadius: 'var(--radius-lg)', padding: '10px 16px',
                display: 'flex', flexDirection: 'column', gap: 6
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Problem Demand (Heat Level)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>low</span>
                  <div style={{
                    width: 130, height: 8, borderRadius: 4,
                    background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%)'
                  }} />
                  <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>high</span>
                </div>
              </div>

              {/* Total Problems Pill */}
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'var(--hm-panel-inner)',
                  border: '1px solid var(--hm-border)',
                  borderRadius: 'var(--radius-lg)', padding: '10px 18px',
                  display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                  color: 'var(--hm-text-main)', transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#38bdf8'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hm-border)'}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: 'rgba(56,189,248,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8'
                }}>
                  <MapPin size={15} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Problems (India)</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--hm-text-main)' }}>12,482</span>
                </div>
                <ArrowRight size={14} style={{ color: '#64748b' }} />
              </button>
            </div>

          </div>


          {/* RIGHT: SIDE DASHBOARD PANEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Active District Card Header */}
            <div style={{
              background: 'var(--hm-panel)',
              border: '1px solid var(--hm-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              position: 'relative'
            }}>
              {/* Header Top Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-md)', padding: '4px 10px',
                    fontSize: 11, fontWeight: 700, color: '#e2e8f0'
                  }}>
                    {hoveredState === activeDistrict.state ? 'Hovering' : activeDistrict.state}
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>
                    {activeDistrict.state} — {activeDistrict.region}
                  </div>
                </div>
                <span style={{
                  background: `${activeDistrict.heatColor}25`,
                  color: '#ffffff',
                  border: `1px solid ${activeDistrict.heatColor}`,
                  borderRadius: 'var(--radius-full)', padding: '3px 12px', fontSize: 11, fontWeight: 700
                }}>
                  ● {activeDistrict.demandBadge}
                </span>
              </div>

              {/* District Name */}
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
                color: 'var(--hm-text-main)', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 10
              }}>
                {activeDistrict.district}
              </h3>

              {/* 4 Stat Cards Horizontal Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                
                {/* Stat 1: Total Problems */}
                <div style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: '10px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#94a3b8' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ec4899' }} /> Problems
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
                    {activeDistrict.totalProblems}
                  </div>
                </div>

                {/* Stat 2: Total Budget */}
                <div style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: '10px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#94a3b8' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6' }} /> Budget
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
                    {activeDistrict.totalBudget}
                  </div>
                </div>

                {/* Stat 3: Qualified Startups */}
                <div style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: '10px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#94a3b8' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Startups
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
                    {activeDistrict.qualifiedStartups}
                  </div>
                </div>

                {/* Stat 4: Unmatched Challenges */}
                <div style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: '10px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#94a3b8' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} /> Unmatched
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
                    {activeDistrict.unmatchedChallenges}
                  </div>
                </div>

              </div>
            </div>


            {/* Problems by Category (Donut Chart & Legend) */}
            <div style={{
              background: 'var(--hm-panel)',
              border: '1px solid var(--hm-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px'
            }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: '0 0 16px' }}>
                Problems by Category
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16, alignItems: 'center' }}>
                {/* Recharts Donut */}
                <div style={{ height: 130, position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activeDistrict.categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={58}
                        paddingAngle={3}
                        dataKey="count"
                      >
                        {activeDistrict.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(val, name) => [`${val} problems`, name]}
                        contentStyle={{ background: 'var(--hm-glass-bg)', borderRadius: 8, border: '1px solid var(--hm-border)', color: 'var(--hm-text-main)', fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
                  }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--hm-text-main)', lineHeight: 1 }}>
                      {activeDistrict.totalProblems}
                    </span>
                    <span style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', marginTop: 2 }}>TOTAL</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {activeDistrict.categories.map(cat => (
                    <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                        <span style={{ color: '#94a3b8' }}>{cat.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ color: 'var(--hm-text-main)', fontWeight: 700 }}>{cat.count}</span>
                        <span style={{ color: '#64748b', width: 32, textAlign: 'right' }}>{cat.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>


            {/* Top Government Challenges */}
            <div style={{
              background: 'var(--hm-panel)',
              border: '1px solid var(--hm-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--hm-text-main)', margin: 0 }}>
                  Top Government Challenges
                </h4>
                <button
                  onClick={() => navigate('/login')}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  View All →
                </button>
              </div>

              {/* Challenge cards list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {activeDistrict.topChallenges.map(c => {
                  const Icon = c.icon;
                  return (
                    <div
                      key={c.id}
                      style={{
                        background: 'var(--hm-panel-inner)',
                        border: '1px solid var(--hm-border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        gap: 12,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Icon size={18} style={{ color: c.iconColor }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--hm-text-main)', lineHeight: 1.3 }}>
                            {c.title}
                          </div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                            <span style={{ fontSize: 10, color: '#60a5fa', background: 'rgba(96,165,250,0.12)', padding: '1px 6px', borderRadius: 4 }}>
                              {c.category}
                            </span>
                            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                              {c.budget}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Propose Solution Button */}
                      <button
                        onClick={() => navigate('/login?role=startup')}
                        style={{
                          background: 'var(--hm-btn-bg)',
                          border: '1px solid var(--hm-btn-border)',
                          borderRadius: 'var(--radius-full)',
                          color: 'var(--hm-text-main)',
                          padding: '6px 14px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#0d9488';
                          e.currentTarget.style.color = '#ffffff';
                          e.currentTarget.style.borderColor = '#0d9488';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'var(--hm-btn-bg)';
                          e.currentTarget.style.color = 'var(--hm-text-main)';
                          e.currentTarget.style.borderColor = 'var(--hm-btn-border)';
                        }}
                      >
                        💡 Propose Solution
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Explore Matching Startups Button */}
              <button
                onClick={() => navigate('/login?role=startup')}
                style={{
                  marginTop: 16,
                  width: '100%',
                  justify: 'center',
                  padding: '12px',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: '#ffffff',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                🚀 Explore Matching Startups <ChevronDown size={14} />
              </button>
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .innovation-heatmap-section > div > div[style*="grid-template-columns: minmax"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
