// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Shield, Zap, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

const roles = [
  {
    key: 'government',
    label: 'Government / Agency',
    subtitle: 'Ministries, Departments, PSUs',
    icon: Shield,
    color: '#0d9488',
    description: 'Publish challenges, evaluate startups, manage pilots and procurement.',
    demo: { email: 'ananya.singh@mua.gov.in', password: 'govt@demo' },
  },
  {
    key: 'startup',
    label: 'Startup / Innovator',
    subtitle: 'DPIIT Recognised Startups & MSMEs',
    icon: Zap,
    color: '#6366f1',
    description: 'Discover government challenges, submit solutions and track applications.',
    demo: { email: 'rahul@novatech.in', password: 'startup@demo' },
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, showNotification } = useApp();

  const initialRole = searchParams.get('role') || null;
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const selectedRoleData = roles.find(r => r.key === selectedRole);

  const fillDemo = () => {
    if (!selectedRoleData) return;
    setEmail(selectedRoleData.demo.email);
    setPassword(selectedRoleData.demo.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    setLoading(true);
    try {
      await login(selectedRole, email, password);
      showNotification(`Welcome back! Redirecting to dashboard...`, 'success');
      setTimeout(() => {
        navigate(selectedRole === 'government' ? '/gov/dashboard' : '/startup/dashboard');
      }, 800);
    } catch (err) {
      showNotification('Login failed. Try demo credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(13,148,136,0.06) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(10,31,60,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,31,60,0.04) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 960 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/logo.png" alt="IPPS Setu" style={{ height: 60, width: 'auto', objectFit: 'contain' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--text-primary)' }}>IPPS Setu</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Innovation Procurement Platform</div>
            </div>
          </div>
        </div>

        {/* Role Selector */}
        {!selectedRole ? (
          <div>
            <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
              Welcome to IPPS Setu
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 36 }}>
              Select your role to continue
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 680, margin: '0 auto' }}>
              {roles.map(role => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.key}
                    className="role-card"
                    onClick={() => setSelectedRole(role.key)}
                    style={{ margin: 0, cursor: 'pointer' }}
                  >
                    <div style={{
                      width: 64, height: 64, borderRadius: 'var(--radius-xl)',
                      background: `${role.color}15`, border: `2px solid ${role.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px',
                      boxShadow: `0 0 24px ${role.color}20`,
                    }}>
                      <Icon size={28} style={{ color: role.color }} />
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', marginBottom: 4 }}>{role.label}</h3>
                    <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 12 }}>{role.subtitle}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{role.description}</p>
                  </div>
                );
              })}
            </div>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
              <button
                onClick={() => navigate('/')}
                style={{ background: 'none', border: 'none', color: 'var(--teal-400)', cursor: 'pointer', fontSize: 13 }}
              >
                ← Back to Homepage
              </button>
            </p>
          </div>
        ) : (
          /* Login Form */
          <div style={{ maxWidth: 440, margin: '0 auto' }}>
            <button
              onClick={() => setSelectedRole(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, marginBottom: 24 }}
            >
              <ArrowLeft size={15} /> Change role
            </button>

            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)', padding: '36px',
              boxShadow: 'var(--shadow-xl)',
            }}>
              {/* Role Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-lg)',
                  background: `${selectedRoleData.color}15`, border: `1px solid ${selectedRoleData.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selectedRole === 'government' ? <Shield size={20} style={{ color: selectedRoleData.color }} /> : <Zap size={20} style={{ color: selectedRoleData.color }} />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{selectedRoleData.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedRoleData.subtitle}</div>
                </div>
              </div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                {isRegister ? 'Create Account' : 'Sign In'}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
                {isRegister ? 'Register for IPPS Setu access' : 'Access your IPPS Setu dashboard'}
              </p>

              {/* Demo Credentials Banner */}
              <div className="info-banner" style={{ marginBottom: 20, cursor: 'pointer' }} onClick={fillDemo}>
                <span style={{ fontSize: 14 }}>💡</span>
                <span>
                  <strong style={{ color: 'var(--teal-400)' }}>Demo Mode:</strong> Click here to fill demo credentials for {selectedRoleData.label}
                </span>
              </div>

              <form onSubmit={handleSubmit}>
                {isRegister && (
                  <div className="form-group">
                    <label className="form-label">Full Name <span className="required">*</span></label>
                    <input className="form-input" placeholder="Enter your full name" />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Email Address <span className="required">*</span></label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder={selectedRoleData.demo.email}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password <span className="required">*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="form-input"
                      type={showPass ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      style={{ paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {isRegister && selectedRole === 'startup' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input className="form-input" placeholder="Your startup name" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">DPIIT Recognition No.</label>
                      <input className="form-input" placeholder="DIPPXXXXX (if available)" />
                    </div>
                  </>
                )}

                {!isRegister && (
                  <div style={{ textAlign: 'right', marginBottom: 20 }}>
                    <span style={{ fontSize: 12.5, color: 'var(--teal-400)', cursor: 'pointer' }}>Forgot password?</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: 15 }}
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</>
                  ) : (
                    isRegister ? 'Create Account' : 'Sign In to Dashboard'
                  )}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  style={{ background: 'none', border: 'none', color: 'var(--teal-400)', cursor: 'pointer', fontSize: 13 }}
                >
                  {isRegister ? 'Sign In' : 'Register'}
                </button>
              </div>
            </div>

            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
              Protected by Government of India security standards
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
