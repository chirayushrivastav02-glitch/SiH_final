// src/pages/startup/SubmitProposalPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { applicationsAPI, challengesAPI, paymentsAPI, waiversAPI } from '../../services/api';
import { ArrowLeft, Send, Loader2, Check } from 'lucide-react';

const MY_STARTUP_ID = 'ST-003';

const steps = ['Solution', 'Pilot Plan', 'Team & Review'];

export default function SubmitProposalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showNotification, addProposal } = useApp();

  const [challenge, setChallenge] = useState(null);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    proposedSolution: '',
    technology: '',
    pilotBudget: '',
    pilotDuration: '6 months',
    pilotScope: '',
    teamLead: '',
    totalTeam: '',
    previousGovtWork: '',
    consent: false,
    waiverRequested: false,
    waiverReason: '',
  });

  useEffect(() => {
    let alive = true;
    challengesAPI.getById(id).then(c => { if (alive) setChallenge(c); }).catch(() => {});
    return () => { alive = false; };
  }, [id]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const stepValid = () => {
    if (step === 0) return form.proposedSolution.trim().length >= 20 && form.technology.trim().length > 0;
    if (step === 1) return form.pilotBudget.trim() && form.pilotScope.trim();
    if (form.waiverRequested && !form.waiverReason.trim()) return false;
    return form.teamLead.trim() && form.consent;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stepValid()) {
      showNotification('Please complete the required fields before submitting.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      // 1. Submit Application as Pending Payment
      const res = await applicationsAPI.submit({
        challengeId: id,
        startupId: MY_STARTUP_ID,
        startupName: user?.company || 'NovaTech Solutions',
        status: form.waiverRequested ? 'Pending Waiver' : 'Pending Payment',
        ...form,
      });
      const appId = res.application.id;

      if (form.waiverRequested) {
        await waiversAPI.createWaiver({
          challenge_id: id,
          application_id: appId,
          reason: form.waiverReason,
          documents: [{ file_name: "exemption_certificate.pdf", file_url: "/mock/cert.pdf" }] // Mock file upload
        });
        addProposal({ ...res.application, status: 'Pending Waiver' });
        showNotification(`Fee waiver requested for Proposal ${appId}.`, 'success');
        navigate('/startup/applications');
        return;
      }
      
      // 2. Create Payment Order
      const orderData = await paymentsAPI.createOrder(id, appId);
      
      // 3. Open Razorpay Checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "IPPS Setu",
        description: `Registration Fee for ${orderData.challenge_title}`,
        order_id: orderData.gateway_order_id,
        handler: async function (response) {
          try {
            await paymentsAPI.verifyPayment({
              payment_id: orderData.payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            addProposal({ ...res.application, status: 'Submitted' });
            showNotification(`Payment successful. Proposal ${appId} submitted.`, 'success');
            navigate('/startup/applications');
          } catch (err) {
            showNotification('Payment verification failed.', 'error');
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: function() {
            setSubmitting(false);
          }
        },
        prefill: {
          name: orderData.startup_name,
        },
        theme: {
          color: "#0f766e"
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        showNotification('Payment failed: ' + response.error.description, 'error');
        setSubmitting(false);
      });
      rzp.open();

    } catch (err) {
      showNotification('Submission or payment initialization failed. Please retry.', 'error');
      setSubmitting(false);
    }
  };

  return (
    <div className="page-enter" data-testid="submit-proposal-page">
      <button
        className="btn btn-sm btn-secondary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate(`/startup/marketplace/${id}`)}
        data-testid="submit-proposal-back-button"
      >
        <ArrowLeft size={14} /> Back to challenge
      </button>

      <div className="section-header">
        <div>
          <h1 className="section-title" data-testid="submit-proposal-title">Submit Proposal</h1>
          <p className="section-subtitle">
            <code style={{ color: 'var(--teal-400)' }}>{id}</code>
            {challenge ? ` — ${challenge.title}` : ''}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="stepper" data-testid="submit-proposal-stepper">
        {steps.map((label, i) => (
          <div className="stepper-item" key={label}>
            <div className={`stepper-dot ${i < step ? 'done' : i === step ? 'current' : 'future'}`}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            <div className={`stepper-label ${i === step ? 'current' : i < step ? 'done' : ''}`}>{label}</div>
            {i < steps.length - 1 && <div className={`stepper-line ${i < step ? 'done' : ''}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ marginTop: 20 }}>
        {step === 0 && (
          <div data-testid="submit-proposal-step-solution">
            <div className="form-group">
              <label className="form-label">Proposed Solution *</label>
              <textarea
                className="form-textarea"
                rows={6}
                placeholder="Describe your solution, architecture and how it addresses the problem statement (min 20 characters)"
                value={form.proposedSolution}
                onChange={set('proposedSolution')}
                data-testid="proposal-solution-input"
              />
              <div className="form-hint">{form.proposedSolution.length} characters</div>
            </div>
            <div className="form-group">
              <label className="form-label">Technology Stack *</label>
              <input
                className="form-input"
                placeholder="e.g. IoT sensors, Edge AI, FHIR APIs, React Native"
                value={form.technology}
                onChange={set('technology')}
                data-testid="proposal-technology-input"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div data-testid="submit-proposal-step-pilot">
            <div className="form-row cols-2">
              <div className="form-group">
                <label className="form-label">Proposed Pilot Budget *</label>
                <input
                  className="form-input"
                  placeholder="e.g. ₹85 Lakhs"
                  value={form.pilotBudget}
                  onChange={set('pilotBudget')}
                  data-testid="proposal-budget-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pilot Duration</label>
                <select className="form-select" value={form.pilotDuration} onChange={set('pilotDuration')} data-testid="proposal-duration-select">
                  {['3 months', '6 months', '9 months', '12 months'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Pilot Scope & Locations *</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="e.g. Delhi (15 water bodies), Bengaluru (10 water bodies)"
                value={form.pilotScope}
                onChange={set('pilotScope')}
                data-testid="proposal-scope-input"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div data-testid="submit-proposal-step-team">
            <div className="form-row cols-2">
              <div className="form-group">
                <label className="form-label">Project Lead *</label>
                <input
                  className="form-input"
                  placeholder="Name, designation"
                  value={form.teamLead}
                  onChange={set('teamLead')}
                  data-testid="proposal-team-lead-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Team Assigned</label>
                <input
                  className="form-input"
                  placeholder="e.g. 8 members"
                  value={form.totalTeam}
                  onChange={set('totalTeam')}
                  data-testid="proposal-team-size-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Previous Government Work</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Past government deployments, or 'first government project'"
                value={form.previousGovtWork}
                onChange={set('previousGovtWork')}
                data-testid="proposal-govt-work-input"
              />
            </div>
            
            <div className="card" style={{ marginBottom: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
                <input
                  type="checkbox"
                  checked={form.waiverRequested}
                  onChange={e => setForm(f => ({ ...f, waiverRequested: e.target.checked }))}
                />
                Request Registration Fee Waiver
              </label>
              {form.waiverRequested && (
                <div style={{ marginTop: 12 }}>
                  <label className="form-label">Reason for Fee Waiver *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Registered DPIIT Startup Category A"
                    value={form.waiverReason}
                    onChange={set('waiverReason')}
                  />
                  <div className="form-hint" style={{ marginTop: 8 }}>Supporting document (exemption_certificate.pdf) will be attached automatically in this test mode.</div>
                </div>
              )}
            </div>

            <div className="info-banner" style={{ marginBottom: 16 }}>
              <span>Submitting locks your proposal for departmental screening and AI matching.</span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={form.consent}
                onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))}
                data-testid="proposal-consent-checkbox"
              />
              I confirm the information is accurate and accept the platform terms.
            </label>
          </div>
        )}

        <div className="divider" />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={step === 0}
            onClick={() => setStep(s => Math.max(0, s - 1))}
            data-testid="proposal-prev-button"
          >
            Previous
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (!stepValid()) { showNotification('Complete the required fields to continue.', 'error'); return; }
                setStep(s => s + 1);
              }}
              data-testid="proposal-next-button"
            >
              Continue
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={submitting} data-testid="proposal-submit-button">
              {submitting ? (
                <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</>
              ) : form.waiverRequested ? (
                <><Send size={15} /> Request Waiver & Submit</>
              ) : (
                <><Send size={15} /> Pay Registration Fee (₹50,000) & Submit</>
              )}
            </button>
          )}
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
