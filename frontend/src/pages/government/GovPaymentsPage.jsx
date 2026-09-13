import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';
import { paymentsAPI, waiversAPI, refundsAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function GovPaymentsPage() {
  const { showNotification } = useApp();
  const [activeSection, setActiveSection] = useState('Payments');
  
  const [payments, setPayments] = useState([]);
  const [waivers, setWaivers] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    if (activeSection === 'Payments') {
      paymentsAPI.getAdminPayments().then(setPayments).catch(console.error).finally(() => setLoading(false));
    } else if (activeSection === 'Waivers') {
      waiversAPI.getAdminWaivers().then(setWaivers).catch(console.error).finally(() => setLoading(false));
    } else if (activeSection === 'Refunds') {
      refundsAPI.getAdminRefunds().then(setRefunds).catch(console.error).finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const handleWaiverReview = async (waiverId, status) => {
    try {
      await waiversAPI.reviewWaiver(waiverId, status, `Waiver ${status.toLowerCase()} by Admin`);
      showNotification(`Waiver ${status}`, 'success');
      fetchData();
    } catch (err) {
      showNotification('Action failed', 'error');
    }
  };

  const handleRefundInitiate = async (refundId) => {
    try {
      await refundsAPI.initiateRefund(refundId);
      showNotification('Refund initiated via Test Gateway', 'success');
      fetchData();
    } catch (err) {
      showNotification('Failed to initiate refund', 'error');
    }
  };

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">Admin Financial Records (Test Mode)</h1>
          <p className="section-subtitle">Manage payments, fee waivers, and refunds</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        {['Payments', 'Waivers', 'Refunds'].map(sec => (
          <button 
            key={sec} 
            className={`btn ${activeSection === sec ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px', padding: '6px 16px' }}
            onClick={() => setActiveSection(sec)}
          >
            {sec}
          </button>
        ))}
      </div>

      {activeSection === 'Payments' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-table-head)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Transaction ID</th>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Startup / App</th>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Date</th>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Amount</th>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(pay => (
                <tr key={pay.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px' }}><code style={{ color: 'var(--teal-400)' }}>{pay.id}</code></td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '500' }}>{pay.startup_id}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{pay.application_id}</div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{new Date(pay.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '16px', fontWeight: '600' }}>₹{pay.amount_in_rupees?.toLocaleString()}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                      background: pay.status === 'SUCCESS' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                      color: pay.status === 'SUCCESS' ? 'var(--green-400)' : 'var(--amber-400)'
                    }}>
                      {pay.status === 'SUCCESS' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {pay.status === 'SUCCESS' ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'Waivers' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-table-head)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Waiver ID</th>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Startup / App</th>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Reason</th>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {waivers.map(w => (
                <tr key={w.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px' }}><code style={{ color: 'var(--teal-400)' }}>{w.id}</code></td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '500' }}>{w.startup_id}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{w.application_id}</div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{w.reason}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                      background: w.status === 'APPROVED' ? 'rgba(52, 211, 153, 0.1)' : w.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                      color: w.status === 'APPROVED' ? 'var(--green-400)' : w.status === 'REJECTED' ? 'var(--red-400)' : 'var(--amber-400)'
                    }}>
                      {w.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {w.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-sm btn-primary" onClick={() => handleWaiverReview(w.id, 'APPROVED')}>Approve</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => handleWaiverReview(w.id, 'REJECTED')}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {waivers.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No waiver requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'Refunds' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-table-head)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Refund ID</th>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Startup / App</th>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Amounts</th>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px' }}><code style={{ color: 'var(--teal-400)' }}>{r.id}</code></td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '500' }}>{r.startup_id}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{r.application_id}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '500' }}>Refund: ₹{(r.refundable_amount/100).toLocaleString()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Fee: ₹{(r.processing_fee/100).toLocaleString()}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                      background: r.status === 'COMPLETED' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                      color: r.status === 'COMPLETED' ? 'var(--green-400)' : 'var(--amber-400)'
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {(r.status === 'ELIGIBLE' || r.status === 'REQUESTED') && (
                      <button className="btn btn-sm btn-primary" onClick={() => handleRefundInitiate(r.id)}>Initiate Refund</button>
                    )}
                  </td>
                </tr>
              ))}
              {refunds.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No refunds found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
