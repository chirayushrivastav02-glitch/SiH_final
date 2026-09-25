import { useState, useEffect } from 'react';
import { 
  ClipboardCheck, Target, Trophy, BarChart2, 
  ArrowUp, ArrowDown, ChevronRight, Droplet, Monitor, Trash2, PlusCircle, FileText
} from 'lucide-react';
import { matchingAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function MatchingPage() {
  const { user } = useApp();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        // We use user?.id if available, otherwise fallback handles it in api.js
        const data = await matchingAPI.getStartupDashboard(user?.id);
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching matching dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user?.id]);

  if (loading) {
    return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading your matching insights...</div>;
  }

  if (!dashboardData) return null;

  const tabs = ['Overview', 'My Applications', 'Recommendations', 'Insights'];

  const getIconForSector = (sector) => {
    switch (sector?.toLowerCase()) {
      case 'water': return <Droplet size={18} />;
      case 'tech': return <Monitor size={18} />;
      case 'waste': return <Trash2 size={18} />;
      case 'health': return <PlusCircle size={18} />;
      default: return <FileText size={18} />;
    }
  };

  return (
    <div className="page-enter" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
          <span>AI Matching</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Overview</span>
        </div>
        
        <h1 className="section-title" style={{ fontSize: '28px', color: 'var(--text-primary)', marginBottom: '8px' }}>AI Matching Engine</h1>
        <p className="section-subtitle" style={{ color: 'var(--text-muted)' }}>Intelligent matching between government challenges and qualified startups.</p>
        
        {/* TABS */}
        <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border-color)', marginTop: '24px' }}>
          {tabs.map(tab => (
            <div 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{ 
                paddingBottom: '12px', 
                cursor: 'pointer',
                fontWeight: activeTab === tab ? '600' : '500',
                color: activeTab === tab ? 'var(--teal-600)' : 'var(--text-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--teal-500)' : '2px solid transparent',
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {activeTab === 'Overview' && (
        <>
          {/* 4 SUMMARY CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '16px', marginBottom: '24px' }}>
            
            {/* Card 1: Profile Readiness */}
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px' }}>
                  <ClipboardCheck size={24} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>Profile Readiness</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)' }}>{dashboardData.profileReadiness}%</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#10b981', fontWeight: '500', marginBottom: '16px' }}>
                <ArrowUp size={14} /> 12% from last month
              </div>
              <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                <div style={{ width: `${dashboardData.profileReadiness}%`, background: '#10b981', height: '100%', borderRadius: '4px' }} />
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', flex: 1 }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '13px', marginBottom: '4px' }}>Your profile is strong!</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Add 2 certifications to improve eligibility.</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>

            {/* Card 2: Total Challenges Applied */}
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '8px' }}>
                  <Target size={24} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>Total Challenges Applied</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)' }}>{dashboardData.totalApplied}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#8b5cf6', fontWeight: '500', marginBottom: '16px' }}>
                <ArrowUp size={14} /> 2 new this month
              </div>
              <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                <div style={{ width: '100%', background: '#c4b5fd', height: '100%', borderRadius: '4px' }} />
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', flex: 1 }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '13px', marginBottom: '4px' }}>Explore more opportunities</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Apply to new challenges matching your domain.</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>

            {/* Card 3: High Match Opportunities */}
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px' }}>
                  <Trophy size={24} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>High Match Opportunities</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)' }}>{dashboardData.highMatchOpportunities}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#10b981', fontWeight: '500', marginBottom: '16px' }}>
                &lt; Score &gt; 80
              </div>
              <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                <div style={{ width: '80%', background: '#6ee7b7', height: '100%', borderRadius: '4px' }} />
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', flex: 1 }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '13px', marginBottom: '4px' }}>Great potential</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>3 challenges have excellent match scores.</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>

            {/* Card 4: Average Match Score */}
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', background: 'rgba(14, 165, 233, 0.05)', border: '1px solid #bae6fd', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ padding: '10px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', borderRadius: '8px' }}>
                  <BarChart2 size={24} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>Average Match Score</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)' }}>{dashboardData.averageMatchScore}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#0ea5e9', fontWeight: '500', marginBottom: '16px' }}>
                <ArrowUp size={14} /> 8% from last month
              </div>
              <div style={{ height: '6px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                <div style={{ width: `${dashboardData.averageMatchScore}%`, background: '#38bdf8', height: '100%', borderRadius: '4px' }} />
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid #e0f2fe', flex: 1 }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '13px', marginBottom: '4px' }}>Above platform average</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Your solutions are well aligned.</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
            
          </div>

          {/* BOTTOM SECTION: 2 COLUMNS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
            
            {/* Left Card: Your Match Landscape */}
            <div className="card" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: '#10b981', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    <ClipboardCheck size={14} /> APPLIED CHALLENGES
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Your Match Landscape</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>AI-powered analysis of your applications across government challenges.</p>
                </div>
                <button style={{ background: 'transparent', border: 'none', color: '#2563eb', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  View all <ArrowUp size={14} style={{ transform: 'rotate(45deg)' }} />
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '12px 16px', width: '40%' }}>Challenge</th>
                      <th style={{ padding: '12px 16px', width: '25%' }}>Ministry / Department</th>
                      <th style={{ padding: '12px 16px', width: '15%' }}>Match Score</th>
                      <th style={{ padding: '12px 16px', width: '15%' }}>Status</th>
                      <th style={{ padding: '12px 16px', width: '5%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.appliedChallenges.map((app, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.05)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {getIconForSector(app.iconType)}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px', marginBottom: '2px' }}>{app.title}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {app.department}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ fontWeight: '700', color: app.matchScore >= 80 ? '#10b981' : (app.matchScore >= 70 ? '#14b8a6' : '#2563eb') }}>
                            {app.matchScore}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: app.matchScore >= 80 ? '#10b981' : '#f59e0b' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: app.matchScore >= 80 ? '#10b981' : '#f59e0b' }} />
                            {app.status}
                          </div>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                            View Details <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {dashboardData.appliedChallenges.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          You haven't applied to any challenges yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Card: Top Opportunities */}
            <div className="card" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: '#f59e0b', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  <Trophy size={14} /> RECOMMENDED CHALLENGES
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Top Opportunities for You</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Based on your profile, technology and past applications.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {dashboardData.recommendations.map((rec, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-primary)', border: '1px solid #f1f5f9', borderRadius: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       {getIconForSector(rec.iconType)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rec.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{rec.department}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', padding: '2px 8px', background: 'rgba(34, 197, 94, 0.2)', color: '#166534', borderRadius: '99px', fontWeight: '500' }}>
                          {rec.matchLabel}
                        </span>
                        <button style={{ background: 'transparent', border: 'none', color: '#2563eb', fontWeight: '500', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0 }}>
                          Apply Now <ArrowUp size={12} style={{ transform: 'rotate(45deg)' }} />
                        </button>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#166534', fontWeight: '700', padding: '6px 12px', borderRadius: '8px', fontSize: '16px' }}>
                      {rec.matchScore}%
                    </div>
                  </div>
                ))}
                {dashboardData.recommendations.length === 0 && (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No new recommendations at this time.
                  </div>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
