// src/layouts/GovernmentLayout.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';
import {
  LayoutDashboard, Target, Users, Cpu, Star, Beaker, ShoppingCart,
  CreditCard, TrendingUp, FileText, Bell, LogOut, ChevronRight,
  Settings, Menu, X, Sun, Moon
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/gov/dashboard' },
  { icon: Target, label: 'Challenges', path: '/gov/challenges', badge: '6' },
  { icon: Users, label: 'Startups', path: '/gov/startups' },
  { icon: Cpu, label: 'Matching Engine', path: '/gov/matching', badge: 'AI', badgeType: 'ai' },
  { icon: Star, label: 'Evaluation', path: '/gov/evaluation' },
  { icon: Beaker, label: 'Pilots', path: '/gov/pilots' },
  { icon: ShoppingCart, label: 'Procurement', path: '/gov/procurement' },
  { icon: CreditCard, label: 'Payments', path: '/gov/payments' },
  { icon: TrendingUp, label: 'Scale-Up', path: '/gov/scaleup' },
  { icon: FileText, label: 'Templates', path: '/gov/templates' },
  { icon: Bell, label: 'Notifications', path: '/gov/notifications' },
];

const pipelineSteps = [
  { label: 'Challenges', count: 8, path: '/gov/challenges' },
  { label: 'Applications', count: 12, path: '/gov/evaluation' },
  { label: 'Shortlisted', count: 4, path: '/gov/evaluation' },
  { label: 'Pilots', count: 4, path: '/gov/pilots' },
  { label: 'Procurement', count: 2, path: '/gov/procurement' },
  { label: 'Scaling', count: 2, path: '/gov/scaleup' },
];

export default function GovernmentLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const SidebarContent = () => (
    <>
      <div className="sidebar-logo" onClick={() => navigate('/gov/dashboard')} style={{ cursor: 'pointer', padding: '16px' }}>
        <Logo />
      </div>

      <div className="sidebar-section-label">Navigation</div>
      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label, path, badge, badgeType }) => (
          <div
            key={path}
            className={`sidebar-item ${isActive(path) ? 'active' : ''}`}
            onClick={() => {
              navigate(path);
              setSidebarOpen(false);
            }}
          >
            <Icon className="sidebar-icon" size={18} />
            <span>{label}</span>
            {badge && <span className={`sidebar-badge ${badgeType || ''}`}>{badge}</span>}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div className="avatar" style={{ background: user.avatarColor || '#0d9488', fontSize: 13, width: 34, height: 34 }}>
              {user.avatar}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.department?.split(' ').slice(-2).join(' ')}</div>
            </div>
          </div>
        )}
        <div className="sidebar-item" onClick={handleLogout} style={{ color: 'var(--red-400)' }}>
          <LogOut size={18} className="sidebar-icon" />
          <span>Logout</span>
        </div>
      </div>
    </>
  );

  return (
    <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Collapsible Sidebar */}
      <aside className="app-sidebar" aria-label="Government Navigation">
        <SidebarContent />
      </aside>

      <div className="app-main">
        {/* Topbar */}
        <header className="app-topbar">
          {/* 4-Bar Menu Toggle Button (Morphs to X when sidebar is open) */}
          <button
            type="button"
            className={`nsp-menu-btn ${sidebarOpen ? 'open' : ''}`}
            onClick={() => setSidebarOpen(prev => !prev)}
            title={sidebarOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            aria-label={sidebarOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
          >
            <div className="nsp-menu-btn-lines">
              <span />
              <span />
              <span />
              <span />
            </div>
          </button>

          {/* Symbol only - visible when sidebar is closed, disappears when sidebar opens */}
          {!sidebarOpen && (
            <div
              onClick={() => navigate('/gov/dashboard')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="IPPS Setu"
            >
              <img
                src="/logo.png"
                alt="IPPS Logo"
                style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'contain', background: 'white', padding: 2, flexShrink: 0 }}
              />
            </div>
          )}

          {/* Pipeline Steps: shown when sidebar is closed, hidden when sidebar is open */}
          {!sidebarOpen && (
            <div className="pipeline-bar" role="navigation" aria-label="Government challenge pipeline">
              {pipelineSteps.map((step, idx) => (
                <div key={step.label} className="pipeline-step">
                  <button
                    type="button"
                    className={`pipeline-step-btn ${isActive(step.path) ? 'active' : ''}`}
                    onClick={() => navigate(step.path)}
                  >
                    <span className={`pipeline-step-count ${idx === 0 ? 'orange' : ''}`}>{step.count}</span>
                    <span>{step.label}</span>
                  </button>
                  {idx < pipelineSteps.length - 1 && (
                    <ChevronRight size={14} className="pipeline-arrow" />
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <button className="btn btn-icon btn-secondary" onClick={toggleTheme} title="Toggle Theme" style={{ marginRight: '8px' }}>
                {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
              </button>
            </div>
            
            <div style={{ position: 'relative' }}>
              <button className="btn btn-icon btn-secondary" onClick={() => navigate('/gov/notifications')} title="Notifications">
                <Bell size={17} />
              </button>
              <div className="notif-dot" />
            </div>

            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="avatar" style={{ background: user.avatarColor || '#0d9488' }}>{user.avatar}</div>
                <div className="gov-user-text" style={{ display: 'none' }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.department}</div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="app-content page-enter">
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .gov-user-text { display: block !important; }
        }
      `}</style>
    </div>
  );
}