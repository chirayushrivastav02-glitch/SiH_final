// src/pages/startup/StartupDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { dashboardAPI, challengesAPI } from '../../services/api';
import { mockApplications, mockMatchingData, mockPilots, mockStartups } from '../../data/mockData';
import {
  Store, FileText, Star, Beaker, CreditCard, TrendingUp,
  ChevronRight, Sparkles, Clock,
} from 'lucide-react';

const MY_STARTUP_ID = 'ST-003';

const statusBadge = {
  Submitted: 'badge-submitted',
  Screening: 'badge-screening',
  Evaluation: 'badge-evaluation',
  Shortlisted: 'badge-shortlisted',
  Pilot: 'badge-pilot',
  Rejected: 'badge-rejected',
};

export default function StartupDashboard() {
  const navigate = useNavigate();
  const { user, proposals } = useApp();
  const [stats, setStats] = useState(null);
  const [openChallenges, setOpenChallenges] = useState([]);

  useEffect(() => {
    let alive = true;
    dashboardAPI.getStats('startup').then(s => { if (alive) setStats(s); }).catch(() => {});
    challengesAPI.getAll({ status: 'Published' }).then(c => { if (alive) setOpenChallenges(c); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const myStartup = mockStartups.find(s => s.id === MY_STARTUP_ID);
  const myApplications = [...proposals, ...mockApplications.filter(a => a.startupId === MY_STARTUP_ID)];
  const myPilot = mockPilots.find(p => p.startupId === MY_STARTUP_ID) || mockPilots[0];
  const recommendations = mockMatchingData.slice(0, 3);

  const kpis = [
    { key: 'openChallenges', label: 'Open Challenges', value: stats?.openChallenges ?? openChallenges.length, icon: Store, cls: 'teal', path: '/startup/marketplace' },
    { key: 'myApplications', label: 'My Applications', value: myApplications.length, icon: FileText, cls: 'blue', path: '/startup/applications' },
    { key: 'shortlisted', label: 'Shortlisted', value: stats?.shortlisted ?? 1, icon: Star, cls: 'green', path: '/startup/applications' },
    { key: 'activePilots', label: 'Active Pilots', value: stats?.activePilots ?? 1, icon: Beaker, cls: 'purple', path: '/startup/pilots' },
    { key: 'pendingPayments', label: 'Pending Payments', value: stats?.pendingPayments ?? 1, icon: CreditCard, cls: 'amber', path: '/startup/payments' },
    { key: 'scaleupOpportunities', label: 'Scale-up Options', value: stats?.scaleupOpportunities ?? 1, icon: TrendingUp, cls: 'orange', path: '/startup/scaleup' },
  ];

  return (
    <div className="page-enter" data-testid="startup-dashboard-page">
      <div className="section-header">
        <div>
          <h1 className="section-title" data-testid="startup-dashboard-title">
            Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="section-subtitle">
            {user?.company || myStartup?.name} — your innovation procurement pipeline at a glance
          </p>
        </div>
        <div className="section-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/startup/applications')} data-testid="dashboard-track-applications-button">
            <FileText size={16} /> Track Applications
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/startup/marketplace')} data-testid="dashboard-browse-challenges-button">
            <Store size={16} /> Browse Challenges
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" data-testid="startup-kpi-grid">
        {kpis.map(({ key, label, value, icon: Icon, cls, path }) => (
          <div
            key={key}
            className={`kpi-card ${cls}`}
            onClick={() => navigate(path)}
            style={{ cursor: 'pointer' }}
            data-testid={`startup-kpi-${key}`}
          >
            <div className="card-header">
              <span className="card-title">{label}</span>
              <Icon size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="card-value">{value}</div>
            <div className="card-sub">View details <ChevronRight size={12} /></div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: 24 }}>
        {/* Recommended */}
        <div className="card" data-testid="startup-recommended-card">
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: 15 }}>
              <Sparkles size={14} style={{ color: 'var(--indigo-400)', marginRight: 6 }} />
              AI Recommended Challenges
            </h3>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/startup/marketplace')} data-testid="recommended-view-all-button">
              View all
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            {recommendations.map(m => (
              <div
                key={m.challengeId}
                onClick={() => navigate(`/startup/marketplace/${m.challengeId}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                  padding: '12px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)', background: 'var(--surface-alt)',
                }}
                data-testid={`recommended-item-${m.challengeId}`}
              >
                <div className={`match-score ${m.overallScore >= 90 ? 'high' : 'medium'}`}>{m.overallScore}%</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{m.challengeTitle}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    <code style={{ color: 'var(--teal-400)' }}>{m.challengeId}</code> · technical fit {m.breakdown.technicalFit}%
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}
          </div>
        </div>

        {/* My applications */}
        <div className="card" data-testid="startup-applications-card">
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: 15 }}>My Recent Applications</h3>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/startup/applications')} data-testid="applications-view-all-button">
              Track status
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            {myApplications.length === 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No applications yet — browse the marketplace to apply.</p>
            )}
            {myApplications.slice(0, 4).map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <code style={{ fontSize: 11.5, color: 'var(--teal-400)' }}>{a.id}</code>
                <span style={{ flex: 1, fontSize: 12.5, color: 'var(--text-secondary)' }}>{a.challengeId}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> {a.submittedDate}
                </span>
                <span className={`badge ${statusBadge[a.status] || ''}`}>{a.status}</span>
              </div>
            ))}
          </div>

          <div className="divider" />
          <div className="card-title" style={{ marginBottom: 8 }}>Active Pilot Progress</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{myPilot.challengeTitle}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 8 }}>{myPilot.department} · {myPilot.budget}</div>
          <div className="progress-bar">
            <div className="progress-bar-fill teal" style={{ width: `${myPilot.progress}%` }} />
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6 }}>{myPilot.progress}% complete</div>
        </div>
      </div>

      {/* Open challenges strip */}
      <div className="section-header" style={{ marginTop: 28 }}>
        <div>
          <h2 className="section-title" style={{ fontSize: 20 }}>Newly Published Challenges</h2>
          <p className="section-subtitle">Open for applications right now</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
        {openChallenges.slice(0, 3).map(c => (
          <div
            key={c.id}
            className="challenge-card"
            onClick={() => navigate(`/startup/marketplace/${c.id}`)}
            data-testid={`dashboard-challenge-card-${c.id}`}
          >
            <div className="challenge-card-header">
              <div>
                <code style={{ fontSize: 11, color: 'var(--teal-400)' }}>{c.id}</code>
                <div className="challenge-card-title" style={{ marginTop: 4 }}>{c.title}</div>
              </div>
              <span className="badge badge-published">{c.status}</span>
            </div>
            <div className="challenge-card-meta">
              <span className="challenge-meta-item">💰 {c.budget}</span>
              <span className="challenge-meta-item">📅 {c.deadline}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tag teal">{c.sector}</span>
              {c.tags.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        ))}
        {openChallenges.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Challenge feed unavailable right now.</p>
        )}
      </div>
    </div>
  );
}
