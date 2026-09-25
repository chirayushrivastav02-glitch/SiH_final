// src/pages/public/LandingPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { platformStats } from '../../data/mockData';
import InnovationHeatmap from '../../components/InnovationHeatmap';
import {
  ArrowRight, CheckCircle, ChevronRight, Menu, X, Globe, Shield,
  Zap, TrendingUp, Users, Target, BarChart3, Star, Sun, Moon
} from 'lucide-react';

const processSteps = [
  { step: '01', title: 'Challenge', desc: 'Govt publishes structured problem statements', color: '#0d9488', icon: Target },
  { step: '02', title: 'Discovery', desc: 'AI matches startups to relevant challenges', color: '#06b6d4', icon: Zap },
  { step: '03', title: 'Evaluation', desc: 'Transparent scoring by expert panels', color: '#6366f1', icon: Star },
  { step: '04', title: 'Pilot', desc: 'Structured pilot with KPI measurement', color: '#f97316', icon: BarChart3 },
  { step: '05', title: 'Procurement', desc: 'GFR & GeM-aligned procurement', color: '#a855f7', icon: Globe },
  { step: '06', title: 'Scale-up', desc: 'Validated solutions scaled nationally', color: '#22c55e', icon: TrendingUp },
];

const features = [
  {
    icon: Shield,
    title: 'Transparent & Auditable',
    desc: 'Every decision logged. Rule-based scoring. Full audit trail from problem statement to national scale-up.',
    color: '#0d9488',
  },
  {
    icon: Zap,
    title: 'AI-Powered Matching',
    desc: 'Intelligent matching engine connects government challenges to the most relevant startups in seconds.',
    color: '#06b6d4',
  },
  {
    icon: Globe,
    title: 'GeM & GFR Aligned',
    desc: 'Procurement pathways designed to comply with GeM, GFR 2017 and DPIIT startup procurement policies.',
    color: '#6366f1',
  },
  {
    icon: TrendingUp,
    title: 'Structured Scaling',
    desc: 'Pilot → Department → District → State → National. Every successful pilot has a clear scale pathway.',
    color: '#f97316',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('ipps-theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('ipps-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="landing-hero" style={{ background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/logo.png" alt="IPPS Setu" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', lineHeight: 1.1 }}>IPPS Setu</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Innovation Procurement Platform</div>
          </div>
        </div>

        <div className="landing-nav-links">
          {['Home', 'How It Works', 'Challenges', 'Startups', 'About'].map(link => (
            <span key={link} className="landing-nav-link">{link}</span>
          ))}
        </div>

        <div className="landing-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-icon btn-secondary" onClick={toggleTheme} title="Toggle Theme" aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>Get Started</button>
        </div>

        <button
          className="btn btn-icon btn-secondary"
          style={{ marginLeft: 'auto', display: 'none' }}
          id="mobile-landing-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '12px 24px' }}>
          {['Home', 'How It Works', 'Challenges', 'Startups', 'About'].map(link => (
            <div key={link} style={{ padding: '10px 0', color: 'var(--text-secondary)', fontSize: 14, borderBottom: '1px solid var(--border-color)' }}>{link}</div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center' }}>
            <button className="btn btn-icon btn-secondary" onClick={toggleTheme} title="Toggle Theme" style={{ width: 38, height: 38 }}>
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/login')} style={{ flex: 1 }}>Login</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')} style={{ flex: 1 }}>Get Started</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '80px 64px', position: 'relative', overflow: 'hidden' }}>
        {/* Background Effect */}
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0,
          background: 'radial-gradient(ellipse 80% 50% at 60% 50%, rgba(13,148,136,0.08) 0%, transparent 70%)',
        }}>
          {/* Grid lines */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            {/* Left: Hero Text */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.3)',
                borderRadius: 'var(--radius-full)', padding: '5px 14px',
                fontSize: 12, fontWeight: 600, color: 'var(--teal-400)',
                marginBottom: 24, letterSpacing: '0.04em',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal-400)', boxShadow: '0 0 8px var(--teal-400)' }} />
                PILOT-TO-SCALE PIPELINE • GOVERNMENT OF INDIA
              </div>

              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px, 5vw, 58px)',
                fontWeight: 900,
                lineHeight: 1.1,
                color: 'var(--text-primary)',
                marginBottom: 24,
              }}>
                From Government Challenges to{' '}
                <span style={{ background: 'linear-gradient(135deg, var(--teal-400), var(--cyan-400))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Scaled Public Impact
                </span>
              </h1>

              <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 36, maxWidth: 500 }}>
                IPPS Setu connects government departments with innovative startups through a structured, transparent and auditable innovation procurement lifecycle — from problem statement to national scale-up.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/login?role=government')}>
                  <Shield size={18} />
                  Government Login
                  <ArrowRight size={16} />
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => navigate('/login?role=startup')}>
                  <Zap size={18} />
                  Startup Login
                </button>
                <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
                  Explore Challenges
                </button>
              </div>

              {/* Trust Badges */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['MOU-aligned', 'GeM Integrated', 'DPIIT Recognised', 'GFR 2017 Compliant'].map(badge => (
                  <span key={badge} style={{
                    background: 'var(--surface-alt)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 'var(--radius-full)', padding: '4px 12px',
                    fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)',
                  }}>
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Stats Dashboard Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {platformStats.map(stat => (
                  <div key={stat.label} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)', padding: '20px',
                    transition: 'all var(--transition-base)',
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Live Metrics Bar */}
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius-lg)', padding: '16px 20px',
                boxShadow: 'var(--shadow-teal)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--teal-400)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Platform Performance</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--green-400)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-400)', boxShadow: '0 0 8px var(--green-400)' }} />
                    Live
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  {[
                    { label: 'Avg Match Time', value: '< 4 sec' },
                    { label: 'Pilot Success', value: '71%' },
                    { label: 'Time to Contract', value: '~48 days' },
                    { label: 'Beneficiaries', value: '2.4M+' },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{m.value}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Intelligence Heatmap Section */}
      <InnovationHeatmap />

      {/* Process Flow */}
      <section style={{ padding: '80px 64px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
              The Complete Innovation Procurement Journey
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
              A structured, repeatable lifecycle from problem identification to national scale-up
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {processSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.step} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)', padding: '24px 16px', textAlign: 'center',
                  position: 'relative',
                  borderTop: `3px solid ${step.color}`,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: `${step.color}20`,
                    border: `2px solid ${step.color}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                    boxShadow: `0 0 16px ${step.color}20`,
                  }}>
                    <Icon size={20} style={{ color: step.color }} />
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: step.color, letterSpacing: '0.06em', marginBottom: 4 }}>STEP {step.step}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 6 }}>{step.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{step.desc}</div>
                  {idx < processSteps.length - 1 && (
                    <div style={{
                      position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)',
                      color: 'var(--text-muted)', zIndex: 1, fontSize: 16,
                    }}>
                      <ChevronRight size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
              Built for Government Innovation at Scale
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
              Every feature designed for the unique needs of government–startup collaboration
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {features.map(feat => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)', padding: '28px',
                  transition: 'all var(--transition-base)',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: var_radius_md,
                    background: `${feat.color}15`, border: `1px solid ${feat.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                    <Icon size={22} style={{ color: feat.color }} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 8 }}>{feat.title}</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 64px',
        background: 'linear-gradient(135deg, rgba(13,148,136,0.1), rgba(6,182,212,0.05))',
        borderTop: '1px solid var(--border-color)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
            Ready to Transform Government Innovation?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, marginBottom: 36 }}>
            Join 48 government departments and 1,240 startups already using IPPS Setu to solve India's most pressing public challenges.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/login?role=government')}>
              <Shield size={18} />
              I'm from Government
              <ArrowRight size={16} />
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/login?role=startup')}>
              <Zap size={18} />
              I'm a Startup
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '32px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="IPPS Setu" style={{ height: 42, width: 'auto', objectFit: 'contain' }} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>IPPS Setu</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Innovation Procurement Platform</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            © 2024 IPPS Setu. Government of India Initiative. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Use', 'RTI', 'Contact'].map(l => (
              <span key={l} style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 1024px) {
          .landing-hero section:first-of-type > div > div {
            grid-template-columns: 1fr !important;
          }
          section > div > div[style*="grid-template-columns: repeat(6"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          section > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          #mobile-landing-menu { display: flex !important; }
          section { padding: 48px 24px !important; }
          nav.landing-nav { padding: 16px 24px !important; }
          section > div > div[style*="grid-template-columns: repeat(6"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          section > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr !important;
          }
          section > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
const var_radius_md = 'var(--radius-md)';
