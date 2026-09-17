// src/services/api.js
// API service layer — Phase 1 uses mock data, Phase 2 replaces with real API calls

import {
  mockUsers,
  mockChallenges,
  mockStartups,
  mockApplications,
  mockPilots,
  mockContracts,
  mockPayments,
  mockScaleups,
  mockMatchingData,
  mockTemplates,
  dashboardStats,
} from '../data/mockData';
import { expertMentors } from '../data/expertMentors';
import { rankExpertsForChallenge } from '../lib/expertMatching';

// Simulate network delay for non-migrated endpoints
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const BASE_URL = 'http://localhost:8000/api';

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('ipps_token') || sessionStorage.getItem('ipps_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'API request failed');
  }
  return response.json();
}

// ========== AUTH API ==========
export const authAPI = {
  login: async (role, email, password) => {
    const response = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ role, email, password }),
    });
    return response;
  },

  logout: async () => {
    await delay(200);
    return { success: true };
  },

  getCurrentUser: async (token) => {
    const response = await fetchAPI('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  },
};

// ========== CHALLENGES API ==========
export const challengesAPI = {
  getAll: async (filters = {}) => {
    let challenges = await fetchAPI('/challenges');
    if (filters.sector) challenges = challenges.filter(c => c.sector === filters.sector);
    if (filters.department) challenges = challenges.filter(c => c.department === filters.department);
    if (filters.status) challenges = challenges.filter(c => c.status === filters.status);
    if (filters.search) challenges = challenges.filter(c =>
      c.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      c.problem.toLowerCase().includes(filters.search.toLowerCase())
    );
    return challenges;
  },

  getById: async (id) => {
    return await fetchAPI(`/challenges/${id}`);
  },

  create: async (data) => {
    const challenge = await fetchAPI('/challenges', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { success: true, challenge };
  },

  update: async (id, data) => {
    await delay(400);
    return { success: true, challenge: { id, ...data } };
  },

  publish: async (id) => {
    await delay(400);
    return { success: true, message: 'Challenge published successfully' };
  },
};

// ========== STARTUPS API ==========
export const startupsAPI = {
  getAll: async () => {
    return await fetchAPI('/startups');
  },

  getById: async (id) => {
    return await fetchAPI(`/startups/${id}`);
  },

  updateProfile: async (id, data) => {
    await delay(500);
    return { success: true, startup: { id, ...data } };
  },
};

// ========== APPLICATIONS API ==========
export const applicationsAPI = {
  getAll: async (challengeId) => {
    const url = challengeId ? `/applications?challenge_id=${challengeId}` : '/applications';
    return await fetchAPI(url);
  },

  getById: async (id) => {
    await delay(300);
    return mockApplications.find(a => a.id === id); // Mock fallback for single app if not implemented yet
  },

  submit: async (data) => {
    const application = await fetchAPI('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { success: true, application };
  },

  updateStatus: async (id, status) => {
    await delay(400);
    return { success: true, message: `Application ${status}` };
  },

  evaluate: async (id, scores) => {
    await delay(500);
    const total = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
    return { success: true, overallScore: total };
  },
};

// ========== PILOTS API ==========
export const pilotsAPI = {
  getAll: async () => {
    await delay(400);
    return mockPilots;
  },

  getById: async (id) => {
    await delay(300);
    return mockPilots.find(p => p.id === id);
  },

  updateMilestone: async (pilotId, milestoneIdx, status) => {
    await delay(400);
    return { success: true, message: 'Milestone updated' };
  },

  submitReport: async (pilotId, month, data) => {
    await delay(500);
    return { success: true, message: 'Report submitted' };
  },
};

// ========== PILOT EVALUATION API ==========
export const pilotEvaluationAPI = {
  generateQuestions: async (data) => {
    return await fetchAPI('/generate-questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  evaluateAnswers: async (data) => {
    return await fetchAPI('/evaluate-answers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ========== CONTRACTS API ==========
export const contractsAPI = {
  getAll: async () => {
    await delay(400);
    return mockContracts;
  },

  getById: async (id) => {
    await delay(300);
    return mockContracts.find(c => c.id === id);
  },
};

// ========== PAYMENTS API ==========
export const paymentsAPI = {
  createOrder: async (challengeId, applicationId) => {
    return await fetchAPI('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ challenge_id: challengeId, application_id: applicationId })
    });
  },
  verifyPayment: async (data) => {
    return await fetchAPI('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  getMyPayments: async () => {
    return await fetchAPI('/payments/my-payments');
  },
  getAdminPayments: async () => {
    return await fetchAPI('/payments/admin/payments');
  }
};

// ========== WAIVERS API ==========
export const waiversAPI = {
  createWaiver: async (data) => {
    return await fetchAPI('/fee-waivers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  getMyWaivers: async () => {
    return await fetchAPI('/fee-waivers/my-requests');
  },
  getAdminWaivers: async () => {
    return await fetchAPI('/admin/fee-waivers');
  },
  reviewWaiver: async (waiverId, status, remarks) => {
    return await fetchAPI(`/fee-waivers/${waiverId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reviewer_remarks: remarks })
    });
  }
};

// ========== REFUNDS API ==========
export const refundsAPI = {
  checkEligibility: async (paymentId) => {
    return await fetchAPI(`/payments/${paymentId}/refund-eligibility`);
  },
  requestRefund: async (paymentId) => {
    return await fetchAPI(`/payments/${paymentId}/refund-request`, {
      method: 'POST'
    });
  },
  initiateRefund: async (refundId) => {
    return await fetchAPI(`/admin/refunds/${refundId}/initiate`, {
      method: 'POST'
    });
  },
  getMyRefunds: async () => {
    return await fetchAPI('/refunds/my-refunds');
  },
  getAdminRefunds: async () => {
    return await fetchAPI('/admin/refunds');
  }
};

// ========== MATCHING API ==========
export const matchingAPI = {
  getMatches: async (role, entityId) => {
    await delay(800);
    return mockMatchingData;
  },

  runEngine: async (challengeId) => {
    if (!challengeId) {
       // fallback for when it's just a general click without context
       challengeId = "CH-2024-001"; 
    }
    const result = await fetchAPI('/matching/analyze', {
      method: 'POST',
      body: JSON.stringify({ challenge_id: challengeId })
    });
    return { success: true, matches: result.results, computedAt: new Date().toISOString() };
  },
};

// ========== SCALEUPS API ==========
export const scaleupsAPI = {
  getAll: async () => {
    await delay(400);
    return mockScaleups;
  },

  recommend: async (pilotId, decision) => {
    await delay(500);
    return { success: true, decision, message: `Scale-up decision: ${decision}` };
  },
};

// ========== TEMPLATES API ==========
export const templatesAPI = {
  getAll: async () => {
    await delay(300);
    return mockTemplates;
  },

  download: async (id) => {
    await delay(400);
    return { success: true, message: 'Download started' };
  },
};

// ========== EXPERT NETWORK API ==========
// Phase 1: mock. A real implementation swaps these bodies for apiGet/apiPost
// calls to /api/experts and /api/mentorships — the shapes stay identical.
export const expertsAPI = {
  getAll: async () => {
    await delay(300);
    return expertMentors;
  },

  getById: async (id) => {
    await delay(250);
    const expert = expertMentors.find(e => e.id === id);
    if (!expert) throw new Error('Expert not found');
    return expert;
  },

  getRecommended: async (challengeId) => {
    await delay(500);
    const challenge = mockChallenges.find(c => c.id === challengeId) || null;
    return rankExpertsForChallenge(challenge, expertMentors);
  },

  requestMentorship: async (data) => {
    await delay(600);
    return {
      success: true,
      request: {
        ...data,
        id: `MR-${Date.now().toString().slice(-6)}`,
        status: 'Requested',
        requestedDate: new Date().toISOString().split('T')[0],
        scheduledFor: null,
        outcome: null,
      },
    };
  },

  updateMentorship: async (id, status) => {
    await delay(400);
    const slot = new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0];
    return { success: true, id, status, scheduledFor: status === 'Scheduled' ? `${slot}, 11:00 IST` : null };
  },

  saveOutcome: async (id, outcome) => {
    await delay(400);
    return { success: true, id, outcome };
  },
};

// ========== DASHBOARD API ==========
export const dashboardAPI = {
  getStats: async (role) => {
    await delay(400);
    return dashboardStats[role] || dashboardStats.government;
  },
};
