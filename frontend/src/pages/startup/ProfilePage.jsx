import { useState, useEffect } from 'react';
import { 
  Save, User, Building, MapPin, Mail, Phone, Globe, ChevronLeft, ChevronRight, 
  CheckCircle, ShieldCheck, Droplet, Building2, Hash, FileText, Target, Activity, 
  Calendar, Map, Users, TrendingUp
} from 'lucide-react';
import { profileAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function ProfilePage() {
  const { user } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState('profile'); // 'profile' or 'passport'
  
  const [profile, setProfile] = useState({
    name: 'NovaTech Solutions',
    description: 'An AI and Robotics startup focused on autonomous systems for defense and civilian applications.',
    industry: 'Aerospace & Defense',
    founded: '2020',
    dpiit: 'DIPP12345',
    website: 'https://novatech.example.com',
    email: 'contact@novatech.example.com',
    phone: '+91 9876543210',
    address: 'Bengaluru, Karnataka, India',
    teamSize: '15-50'
  });

  const [passportData, setPassportData] = useState(null);
  const [passportLoading, setPassportLoading] = useState(false);

  useEffect(() => {
    if (viewMode === 'passport' && !passportData) {
      setPassportLoading(true);
      profileAPI.getInnovationPassportData(user?.id)
        .then(setPassportData)
        .catch(console.error)
        .finally(() => setPassportLoading(false));
    }
  }, [viewMode, user?.id, passportData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  if (viewMode === 'passport') {
    return (
      <div className="page-enter" style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
        
        {/* Navigation */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={() => setViewMode('profile')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
          >
            <ChevronLeft size={16} /> Back to Company Profile
          </button>
        </div>

        {passportLoading ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#64748b' }}>Generating Innovation Passport...</div>
        ) : passportData ? (
          <div style={{ background: '#fdfbf7', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', overflow: 'hidden', position: 'relative' }}>
            
            {/* Decorative Background */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '300px', background: 'linear-gradient(135deg, rgba(224, 242, 254, 0.4), rgba(220, 252, 231, 0.3))', zIndex: 0 }} />

            {/* Content Container */}
            <div style={{ position: 'relative', zIndex: 1, padding: '40px' }}>
              
              {/* HEADER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(203, 213, 225, 0.5)', paddingBottom: '32px', marginBottom: '32px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', letterSpacing: '1px', marginBottom: '4px' }}>IPPS SETU</div>
                  <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1e3a8a', letterSpacing: '-0.5px', marginBottom: '8px', fontFamily: '"Playfair Display", serif' }}>INNOVATION PASSPORT</h1>
                  <p style={{ fontSize: '15px', color: '#475569', fontStyle: 'italic' }}>From Ideas to Impact | A Transparent Journey for a Stronger Bharat</p>
                </div>
                
                <div style={{ display: 'flex', gap: '32px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>IPPS ID</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>{passportData.ippsId}</div>
                    
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b' }}>
                      <div>Issued On <strong style={{ color: '#0f172a' }}>{passportData.issuedOn}</strong></div>
                      <div>Last Updated <strong style={{ color: '#0f172a' }}>{passportData.lastUpdated}</strong></div>
                    </div>
                  </div>
                  
                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '140px' }}>
                    <ShieldCheck size={28} color="#059669" style={{ marginBottom: '8px' }} />
                    <div style={{ fontWeight: '700', color: '#065f46', fontSize: '16px', marginBottom: '4px' }}>Verified</div>
                    <div style={{ fontSize: '10px', color: '#047857', textAlign: 'center', lineHeight: '1.4' }}>This innovation has completed all key milestones and is eligible for scale-up.</div>
                  </div>
                </div>
              </div>

              {/* IDENTITY SECTION */}
              <div style={{ display: 'flex', gap: '32px', marginBottom: '40px' }}>
                <div style={{ width: '160px', height: '160px', borderRadius: '16px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Droplet size={48} color="#0ea5e9" style={{ marginBottom: '16px' }} />
                  <div style={{ fontWeight: '800', color: '#1e3a8a', fontSize: '18px' }}>AquaSense</div>
                  <div style={{ fontSize: '9px', color: '#64748b', letterSpacing: '0.5px', textAlign: 'center', marginTop: '4px' }}>CLEANER WATER<br/>BRIGHTER CITIES</div>
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>{profile.name}</h2>
                  <div style={{ fontSize: '16px', color: '#334155', fontWeight: '500', marginBottom: '4px' }}>{passportData.identity.shortDesc}</div>
                  <div style={{ fontSize: '14px', color: '#64748b', fontStyle: 'italic', marginBottom: '24px' }}>{profile.description}</div>
                  
                  <div style={{ display: 'flex', gap: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Droplet size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{passportData.identity.sector}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Sector</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building2 size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{passportData.identity.ministry}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Nodal Department</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fefce8', color: '#ca8a04', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Hash size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{passportData.identity.challengeId}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Challenge ID</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TIMELINE */}
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', marginBottom: '32px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '56px', left: '10%', right: '10%', height: '2px', background: '#e2e8f0', zIndex: 1 }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                  {passportData.journey.map((stage, idx) => (
                    <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '140px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: stage.status === 'completed' ? '#0ea5e9' : '#f8fafc', border: stage.status === 'completed' ? 'none' : '2px solid #e2e8f0', color: stage.status === 'completed' ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: stage.status === 'completed' ? '0 4px 10px rgba(14, 165, 233, 0.3)' : 'none', position: 'relative' }}>
                        {idx === 0 && <Target size={24} />}
                        {idx === 1 && <Users size={24} />}
                        {idx === 2 && <FileText size={24} />}
                        {idx === 3 && <Activity size={24} />}
                        {idx === 4 && <Building2 size={24} />}
                        {idx === 5 && <TrendingUp size={24} />}
                        
                        {stage.status === 'completed' && (
                          <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#10b981', borderRadius: '50%', padding: '2px', color: '#fff', border: '2px solid #fff' }}>
                            <CheckCircle size={12} />
                          </div>
                        )}
                      </div>
                      <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px', marginBottom: '4px' }}>{stage.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', marginBottom: '8px' }}>{stage.desc}</div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: stage.status === 'completed' ? '#10b981' : '#94a3b8', padding: '4px 8px', background: stage.status === 'completed' ? '#ecfdf5' : '#f8fafc', borderRadius: '99px' }}>
                        {stage.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM 3 CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                
                {/* Outcomes */}
                <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', fontWeight: '700', fontSize: '14px', marginBottom: '24px' }}>
                    <Activity size={18} /> Key Outcomes (Pilot)
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ color: '#0ea5e9' }}><Target size={24} /></div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '20px', color: '#0f172a' }}>{passportData.outcomes.accuracy}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>Detection Accuracy</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ color: '#0ea5e9' }}><TrendingUp size={24} style={{ transform: 'rotate(180deg)' }} /></div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '20px', color: '#0f172a' }}>{passportData.outcomes.reduction}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>Reduction in Contamination Incidents</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ color: '#0ea5e9' }}><Calendar size={24} /></div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '20px', color: '#0f172a' }}>{passportData.outcomes.duration}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>Pilot Duration</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ color: '#0ea5e9' }}><MapPin size={24} /></div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '20px', color: '#0f172a' }}>{passportData.outcomes.locations}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>Varanasi, Indore, Nashik</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence */}
                <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', fontWeight: '700', fontSize: '14px', marginBottom: '24px' }}>
                    <ShieldCheck size={18} /> Evidence & Verification
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {passportData.documents.map((doc, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx < passportData.documents.length - 1 ? '1px solid #e2e8f0' : 'none', paddingBottom: idx < passportData.documents.length - 1 ? '16px' : '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <CheckCircle size={20} color="#10b981" />
                          <div style={{ fontSize: '13px', fontWeight: '500', color: '#334155' }}>{doc.title}</div>
                        </div>
                        <button style={{ background: 'transparent', border: 'none', color: '#0ea5e9', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          View <ChevronRight size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact */}
                <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', fontWeight: '700', fontSize: '14px', marginBottom: '24px' }}>
                    <Users size={18} /> Public Impact
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ color: '#f59e0b' }}><Building size={20} /></div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '20px', color: '#0f172a' }}>{passportData.impact.cities}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Cities</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ color: '#f59e0b' }}><Building2 size={20} /></div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '20px', color: '#0f172a' }}>{passportData.impact.departments}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Departments</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ color: '#f59e0b' }}><Users size={20} /></div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '20px', color: '#0f172a' }}>{passportData.impact.citizens}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Citizens Benefited</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ color: '#10b981' }}><TrendingUp size={20} /></div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '20px', color: '#0f172a' }}>{passportData.impact.economic}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Potential Economic Impact</div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 'auto', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#065f46', fontSize: '15px', marginBottom: '4px' }}>Scale-Up Readiness</div>
                      <div style={{ fontSize: '12px', color: '#047857' }}>Verified and ready for national deployment</div>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle size={24} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // DEFAULT PROFILE VIEW
  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">Company Profile</h1>
          <p className="section-subtitle">Manage your startup details, certifications, and public information</p>
        </div>
        <div className="section-actions">
          {isEditing ? (
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={16} /> Save Changes
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--teal-500)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
              NT
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>{profile.name}</h2>
            <span className="badge badge-submitted" style={{ marginBottom: '16px' }}>DPIIT Recognised</span>
            
            <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              <div style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)' }}><Mail size={16} /> <span style={{ fontSize: '14px' }}>{profile.email}</span></div>
              <div style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)' }}><Phone size={16} /> <span style={{ fontSize: '14px' }}>{profile.phone}</span></div>
              <div style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)' }}><Globe size={16} /> <span style={{ fontSize: '14px' }}>{profile.website.replace('https://', '')}</span></div>
              <div style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)' }}><MapPin size={16} /> <span style={{ fontSize: '14px' }}>{profile.address}</span></div>
            </div>
          </div>
          
          {/* View Innovation Passport Entry Point */}
          <div 
            onClick={() => setViewMode('passport')}
            className="card" 
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', 
              background: 'linear-gradient(135deg, #1e3a8a, #0f172a)', color: '#fff', cursor: 'pointer', 
              transition: 'transform 0.2s', border: '1px solid #334155'
            }}
          >
            <ShieldCheck size={40} color="#38bdf8" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>Innovation Passport</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.4' }}>
              View your official IPPS Setu verified identity and procurement journey.
            </p>
            <div style={{ background: '#38bdf8', color: '#0f172a', padding: '8px 24px', borderRadius: '99px', fontSize: '14px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              View Passport <ChevronRight size={16} />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Company Information</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Company Name</label>
              {isEditing ? (
                <input type="text" name="name" value={profile.name} onChange={handleChange} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }} />
              ) : (
                <div style={{ fontSize: '15px' }}>{profile.name}</div>
              )}
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Description</label>
              {isEditing ? (
                <textarea name="description" value={profile.description} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }} />
              ) : (
                <div style={{ fontSize: '15px' }}>{profile.description}</div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Industry</label>
              {isEditing ? (
                <input type="text" name="industry" value={profile.industry} onChange={handleChange} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }} />
              ) : (
                <div style={{ fontSize: '15px' }}>{profile.industry}</div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>DPIIT Number</label>
              {isEditing ? (
                <input type="text" name="dpiit" value={profile.dpiit} onChange={handleChange} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }} />
              ) : (
                <div style={{ fontSize: '15px' }}>{profile.dpiit}</div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Founded Year</label>
              {isEditing ? (
                <input type="text" name="founded" value={profile.founded} onChange={handleChange} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }} />
              ) : (
                <div style={{ fontSize: '15px' }}>{profile.founded}</div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Team Size</label>
              {isEditing ? (
                <select name="teamSize" value={profile.teamSize} onChange={handleChange} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                </select>
              ) : (
                <div style={{ fontSize: '15px' }}>{profile.teamSize}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
