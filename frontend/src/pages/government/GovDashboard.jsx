// src/pages/government/GovDashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { dashboardStats } from '../../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Plus, Cpu, ArrowRight, ChevronRight, TrendingUp, Activity } from 'lucide-react';

const sectorData = [
  { name: 'Water', value: 3, fill: '#0d9488' },
  { name: 'Urban', value: 5, fill: '#06b6d4' },
  { name: 'Health', value: 4, fill: '#6366f1' },
  { name: 'Agri', value: 6, fill: '#22c55e' },
  { name: 'Infra', value: 3, fill: '#f97316' },
  { name: 'GovTech', value: 4, fill: '#a855f7' },
];

const appTrendData = [
  { month: 'Oct', applications: 4 },
  { month: 'Nov', applications: 7 },
  { month: 'Dec', applications: 9 },
  { month: 'Jan', applications: 12 },
  { month: 'Feb', applications: 15 },
  { month: 'Mar', applications: 11 },
  { month: 'Apr', applications: 18 },
  { month: 'May', applications: 22 },
];

const pilotPerformanceData = [
  { name: 'Waste Mgmt', target: 30, actual: 28 },
  { name: 'GramSeva', target: 50, actual: 63 },
  { name: 'AquaWatch', target: 95, actual: 87 },
];

const procurementData = [
  { name: 'Active', value: 2, fill: '#0d9488' },
  { name: 'Pending', value: 1, fill: '#f97316' },
  { name: 'Completed', value: 3, fill: '#22c55e' },
];

const kpiCards = [
  { label: 'OPEN CHALLENGES', value: 6, sub: 'awaiting proposals', color: 'orange', dot: 'orange' },
  { label: 'APPLICATIONS', value: 12, sub: 'total submissions', color: 'teal', dot: 'teal' },
  { label: 'ACTIVE PILOTS', value: 3, sub: 'in field testing', color: 'blue', dot: 'blue' },
  { label: 'PROCUREMENTS', value: 2, sub: 'contracted', color: 'purple', dot: 'purple' },
  { label: 'SCALING LIVE', value: 2, sub: 'deployments', color: 'green', dot: 'green' },
];

const CUSTOM_TOOLTIP_STYLE = {
  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
  borderRadius: 8, fontSize: 12, color: 'var(--text-primary)',
};

export default function GovDashboard() {
  const navigate = useNavigate();
  const { user } = useApp();
  const stats = dashboardStats.government;

  return (
    <div className="page-enter">
      {/* Hero Dashboard Card */}
      <div className="gov-hero-banner" style={{
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-teal)',
      }}>
        {/* Background network effect */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%',
          backgroundImage: 'radial-gradient(circle at center, rgba(13,148,136,0.08) 0%, transparent 70%)',
          backgroundSize: '40px 40px',
        }} />

        <div className="gov-hero-content">
          {/* Left Column: Marketplace tag, Heading, Paragraph, Buttons, Metrics */}
          <div className="gov-hero-left">
            <span style={{
              display: 'inline-block',
              background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.3)',
              borderRadius: 'var(--radius-full)', padding: '4px 12px',
              fontSize: 11, fontWeight: 600, color: 'var(--teal-400)',
              letterSpacing: '0.06em', marginBottom: 16,
            }}>
              ● TWO-SIDED INNOVATION MARKETPLACE
            </span>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 3vw, 40px)',
              fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 12,
            }}>
              From problem statements<br />to scaled public impact.
            </h1>

            <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.6, marginBottom: 28 }}>
              Government departments publish structured challenges. Startups get transparent scoring, pilot sandbox, and a clear path to procurement — with every decision auditable.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/gov/challenges')}>
                Browse Challenges <ArrowRight size={16} />
              </button>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/gov/challenges/create')}>
                <Plus size={16} /> Create Challenge
              </button>
              <button
                className="btn btn-lg"
                style={{ background: 'linear-gradient(135deg, #0d9488, #06b6d4)', color: '#ffffff', boxShadow: '0 2px 16px rgba(13,148,136,0.35)' }}
                onClick={() => navigate('/gov/matching')}
              >
                <Cpu size={16} /> Run Matching Engine
              </button>
            </div>

            {/* Live Metrics */}
            <div className="gov-metrics-grid" style={{ maxWidth: 720 }}>
              {[
                { label: 'AVG. MATCH TIME', value: stats.avgMatchTime },
                { label: 'PILOT SUCCESS RATE', value: stats.pilotSuccessRate },
                { label: 'TIME TO CONTRACT', value: stats.timeToContract },
                { label: 'BENEFICIARIES REACHED', value: stats.beneficiariesReached },
              ].map(m => (
                <div key={m.label} style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: 16 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Central decorative dot matrix */}
          <div className="gov-central-dots" />

          {/* Dedicated Right Half: Centers the Emblem in this half, positioned cleanly from the top */}
          <div className="gov-hero-right-half">
            {/* Top-right subtle dot matrix matching reference */}
            <div className="gov-top-right-dots" />

            {/* Ashoka Chakra background watermark */}
            <svg className="gov-watermark-chakra" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="4" />
              <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="18" fill="currentColor" opacity="0.3" />
              <circle cx="100" cy="100" r="18" stroke="currentColor" strokeWidth="2" />
              <circle cx="100" cy="100" r="8" fill="currentColor" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1="100"
                  y1="100"
                  x2={+(100 + 82 * Math.cos((i * 15 * Math.PI) / 180)).toFixed(2)}
                  y2={+(100 + 82 * Math.sin((i * 15 * Math.PI) / 180)).toFixed(2)}
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              ))}
              {Array.from({ length: 24 }).map((_, i) => (
                <circle
                  key={`dot-${i}`}
                  cx={+(100 + 87 * Math.cos(((i * 15 + 7.5) * Math.PI) / 180)).toFixed(2)}
                  cy={+(100 + 87 * Math.sin(((i * 15 + 7.5) * Math.PI) / 180)).toFixed(2)}
                  r="2"
                  fill="currentColor"
                />
              ))}
            </svg>

            {/* Official State Emblem of India - Prominent Big Size from Top */}
            <div className="gov-emblem-wrapper">
              <div className="gov-emblem-ambient-glow" />
              <div className="gov-emblem-beam" />
              <img
                src="/government-emblem.svg"
                alt="State Emblem of India"
                className="gov-emblem-img"
                onError={(e) => {
                  e.currentTarget.src = '/government-emblem.png';
                }}
              />
            </div>
            <div className="gov-emblem-title-hi">भारत सरकार</div>
            <div className="gov-emblem-title-en">Government of India</div>
            <div className="gov-emblem-tagline">
              INNOVATION &bull; TRANSPARENCY &bull; IMPACT
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        {kpiCards.map(card => (
          <div key={card.label} className={`kpi-card ${card.color}`}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <span className={`kpi-dot ${card.dot}`} />
              <span className="card-title" style={{ margin: 0 }}>{card.label}</span>
            </div>
            <div className="card-value">{card.value}</div>
            <div className="card-sub">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Sector Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>Challenges by Sector</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Distribution of active challenges</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sectorData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,31,60,0.07)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {sectorData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Application Trend */}
        <div className="card">
          <div className="card-header">
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>Application Trend</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 8 months submissions</div>
            </div>
            <Activity size={18} style={{ color: 'var(--teal-400)' }} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={appTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,31,60,0.07)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="applications" stroke="#0d9488" strokeWidth={2} fill="url(#appGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid-2">
        {/* Pilot Performance */}
        <div className="card">
          <div className="card-header">
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>Pilot Performance</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Target vs Actual KPI metrics</div>
            </div>
            <TrendingUp size={18} style={{ color: 'var(--green-400)' }} />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={pilotPerformanceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,31,60,0.07)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
              <Bar dataKey="target" fill="rgba(10,31,60,0.12)" radius={[3, 3, 0, 0]} name="Target" />
              <Bar dataKey="actual" fill="#0d9488" radius={[3, 3, 0, 0]} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>Quick Actions</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Review pending applications', count: 5, path: '/gov/evaluation', color: 'var(--amber-300)' },
              { label: 'Approve pilot milestone reports', count: 2, path: '/gov/pilots', color: 'var(--blue-400)' },
              { label: 'View procurement contracts', count: 2, path: '/gov/procurement', color: 'var(--purple-400)' },
              { label: 'Scale-up recommendations ready', count: 1, path: '/gov/scaleup', color: 'var(--green-400)' },
              { label: 'Run AI matching engine', count: null, path: '/gov/matching', color: 'var(--teal-400)' },
            ].map(action => (
              <div
                key={action.label}
                onClick={() => navigate(action.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  background: 'rgba(10,31,60,0.04)', borderRadius: 'var(--radius-md)',
                  cursor: 'pointer', transition: 'all var(--transition-fast)',
                  border: '1px solid transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,31,60,0.06)'; e.currentTarget.style.borderColor = 'rgba(10,31,60,0.10)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10,31,60,0.04)'; e.currentTarget.style.borderColor = 'transparent'; }}
              >
                {action.count !== null && (
                  <span style={{
                    minWidth: 24, height: 24, borderRadius: '50%',
                    background: `${action.color}25`, border: `1px solid ${action.color}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: action.color,
                  }}>{action.count}</span>
                )}
                <span style={{ fontSize: 13.5, color: 'var(--text-primary)', flex: 1 }}>{action.label}</span>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: '12px', background: 'rgba(10,31,60,0.03)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--teal-600)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--teal-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>DID YOU KNOW?</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
              Pilots with ≥85 match score are <strong style={{ color: 'var(--text-primary)' }}>3.2x more likely</strong> to reach procurement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
