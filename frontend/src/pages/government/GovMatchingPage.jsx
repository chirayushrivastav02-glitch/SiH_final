import React, { useState, useEffect } from 'react';
import { Crown, MapPin, CheckCircle2, AlertTriangle, ArrowRight, ChevronLeft, ChevronRight, Search, ArrowDownUp } from 'lucide-react';
import { challengesAPI, matchingAPI } from '../../services/api';

export default function GovMatchingPage() {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const fetchedChallenges = await challengesAPI.getAll();
        setChallenges(fetchedChallenges);
        if (fetchedChallenges.length > 0) {
          setSelectedChallengeId(fetchedChallenges[0].id);
        }
      } catch (err) {
        setError('Failed to load challenges.');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedChallengeId) return;
    
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setCurrentPage(1);
        const matches = await matchingAPI.getMatchesForChallenge(selectedChallengeId);
        setStartups(matches);
        if (matches.length > 0) {
          setSelectedStartup(matches[0]);
        } else {
          setSelectedStartup(null);
        }
      } catch (err) {
        console.error("Match error:", err);
        setError('Unable to load matching results: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMatches();
  }, [selectedChallengeId]);

  const selectedChallenge = challenges.find(c => c.id === selectedChallengeId);

  const ProgressBar = ({ label, percentage, value }) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontWeight: '500', color: 'var(--text-primary)' }}>
        <span>{label} ({percentage}%)</span>
        <span style={{ fontWeight: '700' }}>{value}</span>
      </div>
      <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: '#10b981', borderRadius: '4px' }} />
      </div>
    </div>
  );

  const getRankColor = (rank) => {
    if (rank === 1) return '#eab308'; // Gold
    if (rank === 2) return 'var(--text-muted)'; // Silver
    if (rank === 3) return '#b45309'; // Bronze
    return 'transparent';
  };

  return (
    <div className="page-enter" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100%', padding: '0' }}>
      
      {/* Header Area */}
      <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#3b82f6', fontWeight: '500' }}>AI Matching</span>
              <span>›</span>
              <span>Challenge Analysis</span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              Best Matched <span style={{ color: '#3b82f6' }}>Startups</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>
              Ranked results based on AI analysis of eligibility, relevance and capability.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
            {selectedChallenge && (
              <select 
                value={selectedChallengeId}
                onChange={(e) => setSelectedChallengeId(e.target.value)}
                style={{ 
                  padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', 
                  backgroundColor: 'var(--bg-primary)', fontWeight: '500', color: 'var(--text-primary)',
                  outline: 'none', cursor: 'pointer', maxWidth: '350px'
                }}
              >
                {challenges.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            )}
            {!isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '6px 16px', borderRadius: '99px', fontWeight: '600', fontSize: '14px' }}>
                <CheckCircle2 size={16} />
                <span>{startups.length} Eligible Startups</span>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
              <ArrowDownUp size={14} color="#3b82f6" />
              Overall Score
            </button>
            <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Technology</button>
            <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Sector</button>
            <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Location</button>
            <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Experience</button>
          </div>
          
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search startups..." 
              style={{ padding: '8px 12px 8px 36px', borderRadius: '99px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none', width: '220px' }}
            />
          </div>
        </div>
      </div>

      <div className="matching-layout" style={{ padding: '32px' }}>
        
        {/* LEFT COLUMN: TABLE */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflowX: 'auto', overflowY: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ minWidth: '768px' }}>
          
          {isLoading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Analyzing startup applications...</div>
          ) : error ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#ef4444' }}>{error}</div>
          ) : startups.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>No startups have applied for this problem statement yet.</div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 2fr 100px 100px 100px 100px 40px', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                <div>RANK</div>
                <div>STARTUP</div>
                <div style={{ textAlign: 'center' }}>OVERALL</div>
                <div style={{ textAlign: 'center' }}>TECHNOLOGY</div>
                <div style={{ textAlign: 'center' }}>SEMANTIC</div>
                <div style={{ textAlign: 'center' }}>SECTOR</div>
                <div></div>
              </div>

              <div>
                {startups.map((s) => (
                  <div 
                    key={s.startupId}
                    onClick={() => setSelectedStartup(s)}
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '60px 2fr 100px 100px 100px 100px 40px', 
                      padding: '16px 24px', 
                      borderBottom: '1px solid var(--border-color)',
                      alignItems: 'center',
                      cursor: 'pointer',
                      backgroundColor: selectedStartup?.startupId === s.startupId ? 'var(--bg-primary)' : 'var(--bg-card)',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: 'var(--text-primary)', fontSize: '15px' }}>
                      {String(s.rank).padStart(2, '0')}
                      {s.rank <= 3 && <Crown size={16} fill={getRankColor(s.rank)} color={getRankColor(s.rank)} />}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>
                        {s.logo}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#2563eb', fontSize: '14px', marginBottom: '2px' }}>{s.startupName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={10} />
                          {s.location}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '4px 12px', borderRadius: '99px', fontWeight: '700', fontSize: '14px' }}>
                        {s.overallScore.toFixed(1)}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '14px' }}>{s.technologyScore}</div>
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '14px' }}>{s.problemSimilarityScore}</div>
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '14px' }}>{s.sectorScore}</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--border-color)' }}>
                      <ChevronRight size={18} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '14px' }}>
                <div>Showing 1-{startups.length} of {startups.length} eligible startups</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button style={{ padding: '6px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--bg-card)', color: 'var(--text-muted)', cursor: 'not-allowed' }}><ChevronLeft size={16} /></button>
                  <button style={{ width: '32px', height: '32px', border: 'none', borderRadius: '6px', background: '#3b82f6', color: 'var(--bg-card)', fontWeight: '600' }}>1</button>
                  <button style={{ padding: '6px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--bg-card)', color: 'var(--text-muted)', cursor: 'not-allowed' }}><ChevronRight size={16} /></button>
                </div>
              </div>
            </>
          )}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS PANEL */}
        {selectedStartup && (
          <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', alignSelf: 'start', position: 'sticky', top: '24px' }}>
            
            {/* Header info */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>SELECTED STARTUP</span>
                <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: '700' }}>
                  #{selectedStartup.rank} Rank
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '20px' }}>
                    {selectedStartup.logo}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{selectedStartup.startupName}</h2>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {selectedStartup.startupId} | {selectedStartup.location}
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#059669', lineHeight: '1' }}>{selectedStartup.overallScore.toFixed(1)}</div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#10b981', marginTop: '4px' }}>Overall Match</div>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--border-color)', margin: '0 24px' }} />

            {/* Score Breakdown */}
            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '16px' }}>DETAILED SCORE BREAKDOWN</h3>
              
              <ProgressBar label="Technology fit" percentage="30" value={selectedStartup.technologyScore} />
              <ProgressBar label="Problem similarity" percentage="20" value={selectedStartup.problemSimilarityScore} />
              <ProgressBar label="Experience fit" percentage="15" value={selectedStartup.experienceScore} />
              <ProgressBar label="Sector fit" percentage="10" value={selectedStartup.sectorScore} />
              <ProgressBar label="Team fit" percentage="10" value={selectedStartup.teamScore} />
              <ProgressBar label="Scalability fit" percentage="5" value={selectedStartup.scalabilityScore} />
              <ProgressBar label="Revenue fit" percentage="5" value={selectedStartup.revenueScore} />
              <ProgressBar label="Location fit" percentage="5" value={selectedStartup.locationScore} />
            </div>

            <div style={{ height: '1px', background: 'var(--border-color)', margin: '0 24px' }} />

            {/* Why it matches */}
            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '12px' }}>WHY IT MATCHES</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedStartup.whyMatches.map((reason, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #d1fae5', borderRadius: '99px', fontSize: '13px', color: '#059669', fontWeight: '500' }}>
                    <CheckCircle2 size={14} />
                    {reason}
                  </div>
                ))}
              </div>
            </div>

            {/* Watch Points */}
            <div style={{ padding: '0 24px 24px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '12px' }}>WATCH POINTS</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedStartup.watchPoints.length > 0 ? (
                  selectedStartup.watchPoints.map((point, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #fde68a', borderRadius: '99px', fontSize: '13px', color: '#d97706', fontWeight: '500' }}>
                      <AlertTriangle size={14} />
                      {point}
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No significant watch points identified.</div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div style={{ padding: '24px', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
              <button style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'var(--bg-card)', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                View Full Profile <ArrowRight size={18} />
              </button>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
