import { useState, useEffect } from 'react';
import { 
  CheckCircle, Clock, XCircle, Search, ChevronRight, Droplet, Wallet, 
  Building2, Hash, FileText, Lock, Zap, Headset, ArrowUp, ArrowDown
} from 'lucide-react';
import { paymentsAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function PaymentsPage() {
  const { showNotification } = useApp();
  const [activeTab, setActiveTab] = useState('Checkout');
  
  // History State
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Checkout State
  const [checkoutData, setCheckoutData] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed

  useEffect(() => {
    if (activeTab === 'Checkout' && !checkoutData) {
      setCheckoutLoading(true);
      paymentsAPI.getPendingCheckoutData()
        .then(setCheckoutData)
        .catch(console.error)
        .finally(() => setCheckoutLoading(false));
    }
    
    if (activeTab === 'Payment History' && payments.length === 0) {
      setHistoryLoading(true);
      paymentsAPI.getMyPayments()
        .then(data => {
          setPayments(data);
          setFilteredPayments(data);
        })
        .catch(console.error)
        .finally(() => setHistoryLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    let result = payments;
    if (filterStatus !== 'All') {
      result = result.filter(p => p.status === filterStatus.toUpperCase());
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.id.toLowerCase().includes(q) || 
        p.challenge_id.toLowerCase().includes(q) ||
        p.application_id.toLowerCase().includes(q)
      );
    }
    setFilteredPayments(result);
  }, [filterStatus, searchQuery, payments]);

  const handleSimulatePayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
      showNotification('Payment processed successfully!', 'success');
    }, 2000);
  };

  const totalPaid = payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + (p.amount_in_rupees || 0), 0);
  const countSuccessful = payments.filter(p => p.status === 'COMPLETED').length;
  const countPending = payments.filter(p => p.status === 'PENDING').length;
  const countFailed = payments.filter(p => p.status === 'FAILED').length;

  return (
    <div className="page-enter" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* PAGE HEADER */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Payments</span>
          {activeTab === 'Payment History' && (
            <>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Payment History</span>
            </>
          )}
          {activeTab === 'Checkout' && (
            <>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Checkout</span>
            </>
          )}
        </div>
        
        <h1 className="section-title" style={{ fontSize: '28px', color: 'var(--text-primary)', marginBottom: '8px' }}>Payments & Verification</h1>
        <p className="section-subtitle" style={{ color: 'var(--text-muted)' }}>Track registration fees and verify application submissions across IPPS Setu.</p>
        
        {/* TABS */}
        <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border-color)', marginTop: '24px' }}>
          {['Checkout', 'Payment History'].map(tab => (
            <div 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{ 
                paddingBottom: '12px', 
                cursor: 'pointer',
                fontWeight: activeTab === tab ? '600' : '500',
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: activeTab === tab ? '2px solid #b45309' : '2px solid transparent',
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* CHECKOUT VIEW */}
      {activeTab === 'Checkout' && (
        checkoutLoading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading checkout data...</div>
        ) : !checkoutData ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#ef4444' }}>Unable to load checkout data.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
            
            {/* LEFT CARD: Application Details */}
            <div className="card" style={{ padding: '0', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden', alignSelf: 'flex-start' }}>
              
              {/* Challenge Banner Section */}
              <div style={{ padding: '24px', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '600', fontSize: '12px', letterSpacing: '0.5px' }}>
                    <Droplet size={16} /> {checkoutData.challenge.ministry}
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Registration Fee Required
                  </div>
                </div>
                
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', maxWidth: '80%', position: 'relative', zIndex: 2 }}>
                  {checkoutData.challenge.title}
                </h2>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', position: 'relative', zIndex: 2 }}>
                  Challenge ID - {checkoutData.challenge.id}
                </div>

                
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '24px', padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '99px', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', position: 'relative', zIndex: 2, cursor: 'pointer' }}>
                  <Droplet size={14} color="#10b981" /> Contribute to a Sustainable India <ChevronRight size={14} color="#94a3b8" />
                </div>
              </div>

              {/* Application Details Grid */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: '#10b981', letterSpacing: '0.5px', marginBottom: '20px' }}>
                  <FileText size={14} /> APPLICATION DETAILS
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                      <Building2 size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Applicant</div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>{checkoutData.application.applicantName}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                      <Hash size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Application ID</div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>{checkoutData.application.id}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Payment type</div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>{checkoutData.application.paymentType}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>To complete your application submission</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
                      <Clock size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Application status</div>
                      <div style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#d97706', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', display: 'inline-block' }}>
                        {checkoutData.application.status}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Complete payment to proceed with evaluation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT CARD: Payment Summary */}
            <div className="card" style={{ padding: '0', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', alignSelf: 'flex-start' }}>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  <Wallet size={16} color="#10b981" /> PAYMENT SUMMARY
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Complete your registration payment</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <span>Registration fee</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>₹{checkoutData.summary.fee.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <span>GST (18%)</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>₹{checkoutData.summary.gst.toLocaleString()}</span>
                </div>
                
                <div style={{ height: '1px', background: 'var(--border-color)', marginBottom: '24px' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '16px' }}>Total due</span>
                  <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '6px 16px', borderRadius: '8px', fontSize: '24px', fontWeight: '700' }}>
                    ₹{checkoutData.summary.total.toLocaleString()}
                  </span>
                </div>

                {paymentStatus === 'success' ? (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#059669', padding: '16px', borderRadius: '8px', textAlign: 'center', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <CheckCircle size={20} /> Payment Successful
                  </div>
                ) : (
                  <button 
                    onClick={handleSimulatePayment}
                    disabled={paymentStatus === 'processing'}
                    style={{ 
                      width: '100%', padding: '16px', background: '#b45309', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: paymentStatus === 'processing' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s', opacity: paymentStatus === 'processing' ? 0.7 : 1
                    }}
                  >
                    <Lock size={18} /> 
                    {paymentStatus === 'processing' ? 'Processing...' : `Pay ₹${checkoutData.summary.total.toLocaleString()} Securely →`}
                  </button>
                )}

                <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <CheckCircle size={14} color="#3b82f6" /> Secured checkout • Powered by RBI compliant payment gateway
                </div>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '20px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: '#10b981' }}><Lock size={20} /></div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>100% Secure<br/>Payments</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: '#10b981' }}><Zap size={20} /></div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>Instant<br/>Confirmation</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: '#10b981' }}><Headset size={20} /></div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>24/7<br/>Support</div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* PAYMENT HISTORY VIEW */}
      {activeTab === 'Payment History' && (
        <>
          {/* 4 SUMMARY CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '10px', background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', borderRadius: '8px' }}><Wallet size={24} /></div>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px' }}>Total Paid</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>₹{totalPaid.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ color: '#10b981' }}><ArrowUp size={20} style={{ transform: 'rotate(45deg)' }} /></div>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '10px', background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', borderRadius: '50%' }}><CheckCircle size={24} /></div>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px' }}>Successful</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{countSuccessful}</div>
                  </div>
                </div>
                <div style={{ color: '#10b981' }}><ArrowUp size={20} style={{ transform: 'rotate(45deg)' }} /></div>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '10px', background: 'rgba(234, 179, 8, 0.1)', color: '#ca8a04', borderRadius: '50%' }}><Clock size={24} /></div>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px' }}>Pending</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{countPending}</div>
                  </div>
                </div>
                <div style={{ color: '#f59e0b' }}><Clock size={20} /></div>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', borderRadius: '50%' }}><XCircle size={24} /></div>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px' }}>Failed</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{countFailed}</div>
                  </div>
                </div>
                <div style={{ color: '#ef4444' }}><ArrowDown size={20} style={{ transform: 'rotate(-45deg)' }} /></div>
              </div>
            </div>
          </div>

          {/* FILTER & SEARCH BAR */}
          <div className="card" style={{ padding: '16px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['All', 'Pending', 'Completed', 'Failed'].map(status => (
                <button 
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    background: filterStatus === status ? 'var(--text-primary)' : 'transparent',
                    color: filterStatus === status ? 'var(--bg-card)' : 'var(--text-muted)',
                    border: 'none',
                    padding: '6px 16px',
                    borderRadius: '99px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
            
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search payment or challenge..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 16px 8px 36px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '99px',
                  fontSize: '13px',
                  width: '250px',
                  outline: 'none',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* HISTORY TABLE */}
          <div className="card" style={{ padding: '0', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
            {historyLoading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading payment history...</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '16px 24px', width: '20%' }}>Payment ID</th>
                    <th style={{ padding: '16px 24px', width: '30%' }}>Challenge</th>
                    <th style={{ padding: '16px 24px', width: '15%' }}>Amount</th>
                    <th style={{ padding: '16px 24px', width: '15%' }}>Status</th>
                    <th style={{ padding: '16px 24px', width: '15%' }}>Date</th>
                    <th style={{ padding: '16px 24px', width: '5%', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(pay => (
                    <tr key={pay.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', cursor: 'pointer' }} className="hover-row">
                      <td style={{ padding: '16px 24px' }}>
                        <code style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{pay.id}</code>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px', marginBottom: '2px' }}>{pay.challenge_id}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pay.application_id}</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                          ₹{pay.amount_in_rupees?.toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: '600',
                          background: pay.status === 'COMPLETED' || pay.status === 'SUCCESS' ? 'rgba(34, 197, 94, 0.2)' : pay.status === 'PENDING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: pay.status === 'COMPLETED' || pay.status === 'SUCCESS' ? '#166534' : pay.status === 'PENDING' ? '#92400e' : '#991b1b'
                        }}>
                          {pay.status === 'COMPLETED' || pay.status === 'SUCCESS' ? <CheckCircle size={12} /> : pay.status === 'PENDING' ? <Clock size={12} /> : <XCircle size={12} />}
                          {pay.status}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                          {new Date(pay.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {new Date(pay.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <ChevronRight size={18} />
                      </td>
                    </tr>
                  ))}
                  {filteredPayments.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No payments found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Global CSS for hover state on table rows since we used inline styles for simplicity */}
      <style>{`
        .hover-row:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
}
