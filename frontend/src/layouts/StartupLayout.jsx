// src/layouts/StartupLayout.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';
import {
  LayoutDashboard, Store, Star, FileText, Cpu, Beaker, FileSignature,
  CreditCard, TrendingUp, User, FolderOpen, Bell, LogOut, ChevronRight, X, HandHeart,
  Sun, Moon
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/startup/dashboard' },
  { icon: Store, label: 'Challenge Marketplace', path: '/startup/marketplace' },
  { icon: Star, label: 'Recommended', path: '/startup/recommended' },
  { icon: HandHeart, label: 'Expert Network', path: '/startup/experts', badge: 'New', badgeType: 'ai' },
  { icon: FileText, label: 'My Applications', path: '/startup/applications' },
  { icon: Cpu, label: 'Matching Engine', path: '/startup/matching', badge: 'AI', badgeType: 'ai' },
  { icon: Beaker, label: 'Pilots', path: '/startup/pilots' },
  { icon: FileSignature, label: 'Contracts', path: '/startup/contracts' },
  { icon: CreditCard, label: 'Payments', path: '/startup/payments' },
  { icon: TrendingUp, label: 'Scale-up', path: '/startup/scaleup' },
  { icon: User, label: 'Company Profile', path: '/startup/profile' },
  { icon: FolderOpen, label: 'Documents', path: '/startup/documents' },
  { icon: Bell, label: 'Notifications', path: '/startup/notifications' },
];

const pipelineSteps = [
  { label: 'Marketplace', count: 8, path: '/startup/marketplace' },
  { label: 'Applications', count: 3, path: '/startup/applications' },
  { label: 'Matching', count: 4, path: '/startup/matching' },
  { label: 'Pilots', count: 2, path: '/startup/pilots' },
  { label: 'Contracts', count: 1, path: '/startup/contracts' },
  { label: 'Scale-up', count: 1, path: '/startup/scaleup' },
];

export default function StartupLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Theme State Logic
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
      <div className="sidebar-logo" onClick={() => navigate('/startup/dashboard')} style={{ cursor: 'pointer', padding: '16px' }}>
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
            <div className="avatar" style={{ background: user.avatarColor || '#6366f1', fontSize: 13, width: 34, height: 34 }}>
              {user.avatar}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.company}</div>
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
      <aside className="app-sidebar" aria-label="Startup Navigation">
        <SidebarContent />
      </aside>

      {/* Main App Content Area */}
      <div className="app-main">
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
              onClick={() => navigate('/startup/dashboard')}
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

          {/* Pipeline bar: shown when sidebar is closed, hidden when sidebar is open */}
          {!sidebarOpen && (
            <div className="pipeline-bar" role="navigation" aria-label="Startup innovation pipeline">
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
            <div className="su-badges" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: 'var(--indigo-400)', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                DPIIT Recognised
              </span>
              <span style={{ background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.25)', color: 'var(--teal-400)', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                GeM Ready
              </span>
            </div>

            {/* Theme Toggle Button */}
            <button className="btn btn-icon btn-secondary" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-icon btn-secondary"
                onClick={() => navigate('/startup/notifications')}
                title="Notifications"
              >
                <Bell size={17} />
              </button>
              <div className="notif-dot" />
            </div>

            {/* User Profile */}
            {user && (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                onClick={() => navigate('/startup/profile')}
              >
                <div className="avatar" style={{ background: user.avatarColor || '#6366f1' }}>{user.avatar}</div>
                <div className="user-profile-text">
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.company}</div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="app-content page-enter">
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .su-badges { display: none !important; }
        }
        @media (max-width: 768px) {
          .user-profile-text { display: none !important; }
        }
      `}</style>
    </div>
  );
}