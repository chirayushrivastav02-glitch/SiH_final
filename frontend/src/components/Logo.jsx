// src/components/Logo.jsx
const Logo = ({ size = 38, showText = true, className = '' }) => (
  <div className={`sidebar-logo-brand ${className}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <img
      src="/logo.png"
      alt="IPPS Setu Logo"
      style={{ height: size, width: 'auto', objectFit: 'contain', flexShrink: 0 }}
    />
    {showText && (
      <div className="sidebar-logo-text">
        IPPS Setu
        <span>Innovation Procurement Platform</span>
      </div>
    )}
  </div>
);

export default Logo;
