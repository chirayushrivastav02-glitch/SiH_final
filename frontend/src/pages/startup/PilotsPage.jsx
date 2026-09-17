import { useState, useEffect } from 'react';
import { Rocket, Clock, CheckCircle, ArrowLeft, BrainCircuit, Activity, AlertTriangle, Play, FileText, ChevronRight, Save, Send } from 'lucide-react';
import { pilotEvaluationAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function PilotsPage() {
  const { showNotification } = useApp();
  
  // View states
  const [listTab, setListTab] = useState('Active');
  const [selectedPilot, setSelectedPilot] = useState(null);
  const [detailTab, setDetailTab] = useState('overview');

  // Questioning Engine states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [evaluationResult, setEvaluationResult] = useState(null);
  
  // Mock Pilot Data
  const pilots = [
    { 
      id: 'PLT-1029', 
      title: 'AI Surveillance Drone Testing', 
      status: 'Active', 
      progress: 60, 
      nextMilestone: 'Field Test 2 on Oct 15',
      domain: 'Defense & Security',
      startupName: 'NovaTech Solutions',
      proposedSolution: 'Autonomous AI-powered drone fleet for real-time border surveillance and anomaly detection.',
      historicalContext: 'NovaTech has previously deployed 50 drones for state police, but faced battery limitations in extreme cold. The current solution claims to have solved thermal management.'
    },
    { 
      id: 'PLT-1045', 
      title: 'Secure Comms Protocol', 
      status: 'Upcoming', 
      progress: 0, 
      nextMilestone: 'Kickoff meeting on Nov 1',
      domain: 'Communications',
      startupName: 'NovaTech Solutions',
      proposedSolution: 'Quantum-resistant mesh communication network.',
      historicalContext: 'First-time government deployment. Team consists of ex-DRDO scientists.'
    },
    { 
      id: 'PLT-0998', 
      title: 'Autonomous Supply Vehicle', 
      status: 'Completed', 
      progress: 100, 
      nextMilestone: 'Final Report Submitted',
      domain: 'Logistics',
      startupName: 'NovaTech Solutions',
      proposedSolution: 'Unmanned ground vehicle for supply chain automation in difficult terrains.',
      historicalContext: 'Successfully completed Phase 1 trials in desert conditions.'
    }
  ];

  const displayed = pilots.filter(p => p.status === listTab);

  // --- Handlers ---
  const handleStartEvaluation = async () => {
    if (!selectedPilot) return;
    setIsGenerating(true);
    try {
      const payload = {
        startup_name: selectedPilot.startupName,
        domain: selectedPilot.domain,
        proposed_solution: selectedPilot.proposedSolution,
        historical_context: selectedPilot.historicalContext
      };
      const res = await pilotEvaluationAPI.generateQuestions(payload);
      setQuestionData(res);
      showNotification('Assessment questions generated successfully');
    } catch (err) {
      showNotification(err.message || 'Failed to generate questions. Ensure backend is running.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (index, text) => {
    setAnswers(prev => ({ ...prev, [index]: text }));
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedPilot || !questionData) return;
    
    // Check if all questions are answered
    for (let i = 0; i < questionData.technical_questions.length; i++) {
      if (!answers[i] || answers[i].trim() === '') {
        showNotification('Please answer all questions before submitting.', 'error');
        return;
      }
    }

    setIsEvaluating(true);
    try {
      const q_and_a = questionData.technical_questions.map((q, idx) => ({
        question: q,
        answer: answers[idx]
      }));

      const payload = {
        startup_name: selectedPilot.startupName,
        domain: selectedPilot.domain,
        q_and_a
      };

      const res = await pilotEvaluationAPI.evaluateAnswers(payload);
      setEvaluationResult(res);
      setDetailTab('evaluation');
      showNotification('Assessment evaluated successfully');
    } catch (err) {
      showNotification(err.message || 'Failed to evaluate answers.', 'error');
    } finally {
      setIsEvaluating(false);
    }
  };

  const resetWorkspace = () => {
    setSelectedPilot(null);
    setDetailTab('overview');
    setQuestionData(null);
    setAnswers({});
    setEvaluationResult(null);
  };

  // ==========================================
  // RENDER: LIST VIEW
  // ==========================================
  if (!selectedPilot) {
    return (
      <div className="page-enter">
        <div className="section-header">
          <div>
            <h1 className="section-title">My Pilots</h1>
            <p className="section-subtitle">Manage and track your ongoing pilot projects with government agencies</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          {['Active', 'Upcoming', 'Completed'].map(t => (
            <button 
              key={t} 
              className={`btn ${listTab === t ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setListTab(t)}
            >
              {t === 'Active' && <Rocket size={16} />}
              {t === 'Upcoming' && <Clock size={16} />}
              {t === 'Completed' && <CheckCircle size={16} />}
              {t} Pilots
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {displayed.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🚀</div>
              <div className="empty-state-title">No {listTab.toLowerCase()} pilots</div>
              <p>You do not have any {listTab.toLowerCase()} pilots at the moment.</p>
            </div>
          ) : (
            displayed.map(pilot => (
              <div key={pilot.id} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setSelectedPilot(pilot)} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <code style={{ fontSize: '12px', color: 'var(--teal-400)' }}>{pilot.id}</code>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '4px' }}>{pilot.title}</h3>
                  </div>
                  <span className={`badge ${pilot.status === 'Active' ? 'badge-evaluation' : pilot.status === 'Completed' ? 'badge-shortlisted' : ''}`}>
                    {pilot.status}
                  </span>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Pilot Progress</span>
                    <span style={{ fontWeight: '500' }}>{pilot.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill green" style={{ width: `${pilot.progress}%` }} />
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'var(--bg-card-hover)', borderRadius: '6px', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Next Milestone: </span>
                    <span style={{ fontWeight: '500' }}>{pilot.nextMilestone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--teal-400)', fontWeight: 600, fontSize: 13 }}>
                    Manage Workspace <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: DETAIL WORKSPACE
  // ==========================================
  return (
    <div className="page-enter">
      {/* Workspace Header */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={resetWorkspace} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, marginBottom: 16 }}>
          <ArrowLeft size={16} /> Back to Pilots
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <code style={{ fontSize: 13, color: 'var(--teal-400)', background: 'var(--teal-400-alpha-10)', padding: '2px 8px', borderRadius: 4 }}>{selectedPilot.id}</code>
              <span className={`badge ${selectedPilot.status === 'Active' ? 'badge-evaluation' : selectedPilot.status === 'Completed' ? 'badge-shortlisted' : ''}`}>
                {selectedPilot.status}
              </span>
            </div>
            <h1 className="section-title" style={{ margin: 0 }}>{selectedPilot.title}</h1>
          </div>
        </div>
      </div>

      {/* Workspace Navigation */}
      <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid var(--border-color)', marginBottom: 24, overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Pilot Overview', icon: FileText },
          { id: 'questioning', label: 'LLM Assessment', icon: BrainCircuit },
          { id: 'evaluation', label: 'Evaluation Results', icon: Activity }
        ].map(t => {
          const Icon = t.icon;
          const isActive = detailTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setDetailTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'none', border: 'none',
                padding: '0 0 12px 0',
                color: isActive ? 'var(--teal-400)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                borderBottom: isActive ? '2px solid var(--teal-400)' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} /> {t.label}
            </button>
          )
        })}
      </div>

      {/* --- TAB: OVERVIEW --- */}
      {detailTab === 'overview' && (
        <div style={{ display: 'grid', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>Pilot Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Domain</div>
                <div style={{ fontWeight: 500 }}>{selectedPilot.domain}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Startup</div>
                <div style={{ fontWeight: 500 }}>{selectedPilot.startupName}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Next Milestone</div>
                <div style={{ fontWeight: 500 }}>{selectedPilot.nextMilestone}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>Proposed Solution</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedPilot.proposedSolution}</p>
          </div>

          <div className="card" style={{ background: 'var(--bg-card-hover)', border: '1px dashed var(--teal-400-alpha-30)' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--teal-400-alpha-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-400)' }}>
                <BrainCircuit size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Technical Readiness Assessment Required</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>The deployment agency has requested an AI-driven technical stress test to evaluate system robustness.</p>
                <button className="btn btn-primary" onClick={() => setDetailTab('questioning')}>
                  Go to Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: QUESTIONING ENGINE --- */}
      {detailTab === 'questioning' && (
        <div style={{ display: 'grid', gap: 24 }}>
          {/* State 1: Not started */}
          {!questionData && !isGenerating && (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <BrainCircuit size={48} style={{ color: 'var(--teal-400)', margin: '0 auto 24px' }} />
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>LLM Technical Gatekeeper</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6 }}>
                Our AI evaluation engine will analyze your proposed solution against historical deployment failures in <strong>{selectedPilot.domain}</strong> and generate specific stress-test scenarios you must address before proceeding to the pilot phase.
              </p>
              <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: 16 }} onClick={handleStartEvaluation}>
                <Play size={18} /> Generate Technical Questions
              </button>
            </div>
          )}

          {/* State 2: Generating */}
          {isGenerating && (
            <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--teal-400-alpha-20)', borderTopColor: 'var(--teal-400)', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Analyzing Historical Failures...</h3>
              <p style={{ color: 'var(--text-muted)' }}>Retrieving RAG context and generating stress tests.</p>
            </div>
          )}

          {/* State 3: Questions Generated & Interview Form */}
          {questionData && !isEvaluating && (
            <div className="page-enter">
              {/* Context / Scenarios */}
              <div className="card" style={{ marginBottom: 24, borderLeft: '4px solid var(--teal-400)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={18} style={{ color: 'var(--teal-400)' }} /> 
                  Identified Risk Scenarios
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                  Based on historical deployments, the AI has identified the following edge cases you must account for:
                </p>
                <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', display: 'grid', gap: 8, fontSize: 14 }}>
                  {questionData.scenarios.map((scenario, idx) => (
                    <li key={idx} style={{ lineHeight: 1.5 }}>{scenario}</li>
                  ))}
                </ul>
              </div>

              {/* Questions Form */}
              <div style={{ display: 'grid', gap: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700 }}>Technical Defense Questionnaire</h2>
                  <span className="badge" style={{ background: 'var(--teal-400-alpha-10)', color: 'var(--teal-400)' }}>
                    {Object.keys(answers).filter(k => answers[k]?.trim() !== '').length} / {questionData.technical_questions.length} Answered
                  </span>
                </div>

                {questionData.technical_questions.map((q, idx) => (
                  <div key={idx} className="card" style={{ background: 'var(--bg-card-hover)' }}>
                    <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--teal-400)', marginRight: 8 }}>Q{idx + 1}.</span> {q}
                    </h4>
                    <textarea
                      placeholder="Detail your technical approach, fail-safes, and mitigation strategies..."
                      value={answers[idx] || ''}
                      onChange={(e) => handleAnswerChange(idx, e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: 120,
                        padding: 16,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 8,
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        fontSize: 14,
                        lineHeight: 1.6,
                        resize: 'vertical'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Submission */}
              <div className="card" style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: 4 }}>Ready to submit?</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>The AI will evaluate your responses immediately.</p>
                </div>
                <button className="btn btn-primary" onClick={handleSubmitEvaluation}>
                  <Send size={16} /> Submit Assessment
                </button>
              </div>
            </div>
          )}

          {/* State 4: Evaluating */}
          {isEvaluating && (
            <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--teal-400-alpha-20)', borderTopColor: 'var(--teal-400)', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Evaluating Responses...</h3>
              <p style={{ color: 'var(--text-muted)' }}>The AI is assessing your technical depth and risk mitigation.</p>
            </div>
          )}
        </div>
      )}

      {/* --- TAB: EVALUATION --- */}
      {detailTab === 'evaluation' && (
        <div style={{ display: 'grid', gap: 24 }} className="page-enter">
          {!evaluationResult ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-title">No Evaluation Results</div>
              <p>Complete the LLM Assessment first to see your evaluation results.</p>
              <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => setDetailTab('questioning')}>Go to Assessment</button>
            </div>
          ) : (
            <>
              {/* Verdict Header */}
              <div className="card" style={{ 
                display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center',
                borderTop: evaluationResult.verdict === 'PASS' ? '4px solid #10b981' : '4px solid #ef4444'
              }}>
                <div style={{ 
                  width: 100, height: 100, borderRadius: '50%', 
                  border: `8px solid ${evaluationResult.verdict === 'PASS' ? '#10b981' : '#ef4444'}20`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: evaluationResult.verdict === 'PASS' ? '#10b981' : '#ef4444', lineHeight: 1 }}>{evaluationResult.score}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Gatekeeper Verdict</h2>
                    <span className="badge" style={{ 
                      fontSize: 14, padding: '4px 12px',
                      background: evaluationResult.verdict === 'PASS' ? '#10b98120' : '#ef444420',
                      color: evaluationResult.verdict === 'PASS' ? '#10b981' : '#ef4444'
                    }}>
                      {evaluationResult.verdict}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 15 }}>
                    {evaluationResult.reasoning}
                  </p>
                </div>
              </div>

              {/* Details Columns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                <div className="card">
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444' }}>
                    <AlertTriangle size={18} /> Critical Vulnerabilities
                  </h3>
                  {evaluationResult.critical_vulnerabilities.length > 0 ? (
                    <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', display: 'grid', gap: 12, fontSize: 14 }}>
                      {evaluationResult.critical_vulnerabilities.map((v, idx) => <li key={idx}>{v}</li>)}
                    </ul>
                  ) : (
                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No critical vulnerabilities identified.</p>
                  )}
                </div>

                <div className="card">
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--teal-400)' }}>
                    <Activity size={18} /> Recommended Sandbox Tests
                  </h3>
                  {evaluationResult.recommended_sandbox_tests.length > 0 ? (
                    <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', display: 'grid', gap: 12, fontSize: 14 }}>
                      {evaluationResult.recommended_sandbox_tests.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  ) : (
                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No additional tests required.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
