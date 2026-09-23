// src/pages/government/EvaluationPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApplications, mockChallenges, mockStartups } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { CheckCircle, XCircle, MessageSquare, ChevronDown, ChevronUp, Star, Award } from 'lucide-react';

const scoreKeys = [
  { key: 'innovation', label: 'Innovation', color: '#6366f1' },
  { key: 'technical', label: 'Technical', color: '#0d9488' },
  { key: 'scalability', label: 'Scalability', color: '#06b6d4' },
  { key: 'team', label: 'Team', color: '#a855f7' },
  { key: 'financial', label: 'Financial', color: '#22c55e' },
  { key: 'cost', label: 'Cost Effectiveness', color: '#f97316' },
  { key: 'security', label: 'Security', color: '#fbbf24' },
  { key: 'implementation', label: 'Implementation', color: '#60a5fa' },
];

function ScoreRing({ score, size = 80, color = '#0d9488' }) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(10,31,60,0.10)" strokeWidth={6} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: size * 0.22, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * 0.12, color: 'var(--text-muted)', lineHeight: 1 }}>/100</span>
      </div>
    </div>
  );
}

export default function EvaluationPage() {
  const navigate = useNavigate();
  const { showNotification } = useApp();
  const [expanded, setExpanded] = useState(null);
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState({});
  const [statuses, setStatuses] = useState({});

  const applications = (mockApplications || []).filter(Boolean).map(app => ({
    ...app,
    challenge: (mockChallenges || []).find(c => c?.id === app.challengeId),
    startup: (mockStartups || []).find(s => s?.id === app.startupId),
  }));

  const getStatus = (app) => statuses[app.id] || app.status;
  const getScore = (app) => scores[app.id] || app.overallScore;

  const handleAction = (appId, action) => {
    setStatuses(s => ({ ...s, [appId]: action }));
    const msgs = {
      Shortlisted: 'Application shortlisted! Startup notified.',
      Rejected: 'Application rejected.',
      'Info Requested': 'Information request sent to startup.',
    };
    showNotification(msgs[action] || 'Action completed.');
  };

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">Evaluation</h1>
          <p className="section-subtitle">Review and score startup applications</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>Applications: </span>
            <strong style={{ color: 'var(--text-primary)' }}>{applications.length}</strong>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>Shortlisted: </span>
            <strong style={{ color: 'var(--green-400)' }}>{applications.filter(a => getStatus(a) === 'Shortlisted').length}</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {applications.map(app => {
          const isExpanded = expanded === app.id;
          const overallScore = getScore(app);
          const status = getStatus(app);
          const scoreColor = overallScore >= 85 ? '#22c55e' : overallScore >= 70 ? '#fbbf24' : '#ef4444';

          return (
            <div
              key={app.id}
              className="card"
              style={{ padding: 0, overflow: 'hidden' }}
            >
              {/* Header Row */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', cursor: 'pointer' }}
                onClick={() => setExpanded(isExpanded ? null : app.id)}
              >
                {/* Startup Info */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="avatar" style={{ background: '#6366f1', width: 44, height: 44, fontSize: 15, flexShrink: 0 }}>
                    {app.startupName?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{app.startupName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {app.challenge?.title?.slice(0, 50)}... · Submitted {app.submittedDate}
                    </div>
                  </div>
                </div>

                {/* Score */}
                {overallScore && (
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: scoreColor }}>{overallScore}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Overall Score</div>
                  </div>
                )}

                {/* Status */}
                <span className={`badge badge-${(status || 'Pending').toLowerCase().replace(' ', '')}`}>{status || 'Pending'}</span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAction(app.id, 'Shortlisted')}
                    disabled={status === 'Shortlisted'}
                    style={{ opacity: status === 'Shortlisted' ? 0.5 : 1 }}
                  >
                    <CheckCircle size={13} /> Shortlist
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleAction(app.id, 'Rejected')}
                    disabled={status === 'Rejected'}
                    style={{ opacity: status === 'Rejected' ? 0.5 : 1 }}
                  >
                    <XCircle size={13} /> Reject
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleAction(app.id, 'Info Requested')}
                  >
                    <MessageSquare size={13} />
                  </button>
                </div>

                {isExpanded ? <ChevronUp size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border-color)', padding: '24px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
                    {/* Left: Score Ring + Startup Info */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                        <ScoreRing score={overallScore || 0} size={100} color={scoreColor} />
                      </div>

                      <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Startup Details</h4>
                        {app.startup && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {[
                              ['Industry', app.startup.industry],
                              ['Location', app.startup.location],
                              ['Stage', app.startup.stage],
                              ['Funding', app.startup.fundingRaised],
                              ['Govt Projects', app.startup.govtProjects],
                              ['Team Size', app.startup.teamSize],
                            ].map(([k, v]) => (
                              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                                <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Scores + Solution */}
                    <div>
                      <h4 style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Evaluation Scores</h4>

                      {app.scores && (
                        <div style={{ marginBottom: 20 }}>
                          {scoreKeys.map(({ key, label, color }) => (
                            <div key={key} className="score-bar-row">
                              <span className="score-bar-label">{label}</span>
                              <div style={{ flex: 1 }}>
                                <div className="progress-bar">
                                  <div className="progress-bar-fill" style={{ width: `${app.scores[key] || 0}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)` }} />
                                </div>
                              </div>
                              <span className="score-bar-value" style={{ color }}>{app.scores[key] || '—'}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="divider" />

                      <h4 style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Proposed Solution</h4>
                      <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                        {app.proposedSolution}
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                        {[
                          ['Pilot Budget', app.pilotBudget],
                          ['Duration', app.pilotDuration],
                          ['Team', app.totalTeam],
                        ].map(([k, v]) => (
                          <div key={k} style={{ background: 'rgba(10,31,60,0.04)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{k}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
                          </div>
                        ))}
                      </div>

                      {/* Comment */}
                      <div className="form-group">
                        <label className="form-label">Add Evaluation Comment</label>
                        <textarea
                          className="form-textarea"
                          style={{ minHeight: 70 }}
                          placeholder="Add your evaluation notes or comments..."
                          value={comments[app.id] || ''}
                          onChange={e => setComments(c => ({ ...c, [app.id]: e.target.value }))}
                        />
                      </div>

                      {/* Existing Comments */}
                      {app.evaluationComments?.length > 0 && (
                        <div>
                          {app.evaluationComments.map((ec, idx) => (
                            <div key={idx} style={{ background: 'rgba(10,31,60,0.04)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 8 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal-400)', marginBottom: 4 }}>{ec.author} · {ec.date}</div>
                              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{ec.comment}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
