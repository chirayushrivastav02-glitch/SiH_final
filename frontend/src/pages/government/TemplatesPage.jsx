import { FileText, Download, Copy, Edit2 } from 'lucide-react';

export default function TemplatesPage() {
  const templates = [
    { id: 1, title: 'Standard Challenge Format', category: 'Challenge Creation' },
    { id: 2, title: 'Technical Evaluation Matrix', category: 'Evaluation' },
    { id: 3, title: 'Pilot Memorandum of Understanding', category: 'Agreements' },
    { id: 4, title: 'Security Clearance Checklist', category: 'Compliance' }
  ];

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">Template Library</h1>
          <p className="section-subtitle">Standardized government templates for procurement workflows</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
        {templates.map(t => (
          <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-card-hover)', borderRadius: '8px', color: 'var(--teal-400)' }}>
                <FileText size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{t.title}</h3>
                <span className="badge badge-draft">{t.category}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button className="btn btn-sm btn-primary" style={{ flex: 1 }}><Copy size={14} /> Use</button>
              <button className="btn btn-sm btn-secondary" title="Edit"><Edit2 size={14} /></button>
              <button className="btn btn-sm btn-secondary" title="Download"><Download size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
