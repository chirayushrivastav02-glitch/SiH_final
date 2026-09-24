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

// ============================================================
// RENDER BACKEND URL
// ============================================================
const BASE_URL = 'https://sih-final-ymol.onrender.com/api';

// ============================================================
// GENERIC API REQUEST FUNCTION
// ============================================================
async function fetchAPI(endpoint, options = {}) {
  const token =
    localStorage.getItem('ipps_token') ||
    sessionStorage.getItem('ipps_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'API request failed');
  }

  return response.json();
}

// ============================================================
// AUTH API
// ============================================================
export const authAPI = {
  login: async (role, email, password) => {
    // Demo credentials
    if (
      role === 'government' &&
      email === 'ananya.singh@mua.gov.in' &&
      password === 'govt@demo'
    ) {
      await delay(500);

      return {
        success: true,
        user: mockUsers.government,
        token: 'mock-token-government-' + Date.now(),
      };
    }

    if (
      role === 'startup' &&
      email === 'rahul@novatech.in' &&
      password === 'startup@demo'
    ) {
      await delay(500);

      return {
        success: true,
        user: mockUsers.startup,
        token: 'mock-token-startup-' + Date.now(),
      };
    }

    const response = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        role,
        email,
        password,
      }),
    });

    return response;
  },

  logout: async () => {
    await delay(200);
    return { success: true };
  },

  getCurrentUser: async token => {
    return await fetchAPI('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// ============================================================
// CHALLENGES API
// ============================================================
export const challengesAPI = {
  getAll: async (filters = {}) => {
    await delay(400);

    let challenges = [...mockChallenges];

    if (filters.sector) {
      challenges = challenges.filter(
        c => c.sector === filters.sector
      );
    }

    if (filters.department) {
      challenges = challenges.filter(
        c => c.department === filters.department
      );
    }

    if (filters.status) {
      challenges = challenges.filter(
        c => c.status === filters.status
      );
    }

    if (filters.search) {
      challenges = challenges.filter(
        c =>
          c.title
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          c.problem
            .toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    return challenges;
  },

  getById: async id => {
    return await fetchAPI(`/challenges/${id}`);
  },

  create: async data => {
    const challenge = await fetchAPI('/challenges', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return {
      success: true,
      challenge,
    };
  },

  update: async (id, data) => {
    await delay(400);

    return {
      success: true,
      challenge: {
        id,
        ...data,
      },
    };
  },

  publish: async id => {
    await delay(400);

    return {
      success: true,
      message: 'Challenge published successfully',
    };
  },
};

// ============================================================
// STARTUPS API
// ============================================================
export const startupsAPI = {
  getAll: async () => {
    return await fetchAPI('/startups');
  },

  getById: async id => {
    return await fetchAPI(`/startups/${id}`);
  },

  updateProfile: async (id, data) => {
    await delay(500);

    return {
      success: true,
      startup: {
        id,
        ...data,
      },
    };
  },
};

// ============================================================
// APPLICATIONS API
// ============================================================
export const applicationsAPI = {
  getAll: async challengeId => {
    const url = challengeId
      ? `/applications?challenge_id=${challengeId}`
      : '/applications';

    return await fetchAPI(url);
  },

  getById: async id => {
    await delay(300);

    return mockApplications.find(a => a.id === id);
  },

  submit: async data => {
    const application = await fetchAPI('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return {
      success: true,
      application,
    };
  },

  updateStatus: async (id, status) => {
    await delay(400);

    return {
      success: true,
      message: `Application ${status}`,
    };
  },

  evaluate: async (id, scores) => {
    await delay(500);

    const total =
      Object.values(scores).reduce((a, b) => a + b, 0) /
      Object.keys(scores).length;

    return {
      success: true,
      overallScore: total,
    };
  },
};

// ============================================================
// PILOTS API
// ============================================================
export const pilotsAPI = {
  getAll: async () => {
    await delay(400);
    return mockPilots;
  },

  getById: async id => {
    await delay(300);

    return mockPilots.find(p => p.id === id);
  },

  updateMilestone: async (pilotId, milestoneIdx, status) => {
    await delay(400);

    return {
      success: true,
      message: 'Milestone updated',
    };
  },

  submitReport: async (pilotId, month, data) => {
    await delay(500);

    return {
      success: true,
      message: 'Report submitted',
    };
  },
};

// ============================================================
// PILOT EVALUATION API
// ============================================================
export const pilotEvaluationAPI = {
  generateQuestions: async data => {
    return await fetchAPI('/generate-questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  evaluateAnswers: async data => {
    return await fetchAPI('/evaluate-answers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================================
// CONTRACTS API
// ============================================================
export const contractsAPI = {
  getAll: async () => {
    await delay(400);
    return mockContracts;
  },

  getById: async id => {
    await delay(300);

    return mockContracts.find(c => c.id === id);
  },
};

// ============================================================
// PAYMENTS API
// ============================================================
export const paymentsAPI = {
  createOrder: async (challengeId, applicationId) => {
    return await fetchAPI('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({
        challenge_id: challengeId,
        application_id: applicationId,
      }),
    });
  },

  verifyPayment: async data => {
    return await fetchAPI('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyPayments: async () => {
    await delay(300);

    return [
      {
        id: 'PAY-2026-A4F91C',
        challenge_id: 'Water Quality Monitoring',
        application_id: 'APP-2026-1842',
        created_at: '2026-09-12T14:32:00Z',
        amount_in_rupees: 50000,
        status: 'COMPLETED',
      },
      {
        id: 'PAY-2026-B7D20E',
        challenge_id: 'Smart Mobility for Tier-II Cities',
        application_id: 'APP-2026-1729',
        created_at: '2026-09-11T10:18:00Z',
        amount_in_rupees: 50000,
        status: 'PENDING',
      },
      {
        id: 'PAY-2026-C2A88B',
        challenge_id: 'Decentralised Waste Traceability',
        application_id: 'APP-2026-1604',
        created_at: '2026-09-09T16:45:00Z',
        amount_in_rupees: 50000,
        status: 'FAILED',
      },
      {
        id: 'PAY-2026-D6E14A',
        challenge_id: 'Crop Disease Early Warning',
        application_id: 'APP-2026-1521',
        created_at: '2026-09-07T09:06:00Z',
        amount_in_rupees: 50000,
        status: 'COMPLETED',
      },
    ];
  },

  getPendingCheckoutData: async () => {
    await delay(400);

    return {
      challenge: {
        id: 'CH-2026-WQM-018',
        title: 'AI-Powered Water Quality Monitoring',
        ministry: 'MINISTRY OF JAL SHAKTI',
      },

      application: {
        id: 'APP-2026-1842',
        applicantName: 'JalDrishti Labs Pvt. Ltd.',
        status: 'AWAITING PAYMENT',
        paymentType: 'One-time registration fee',
      },

      summary: {
        fee: 50000,
        gst: 9000,
        total: 59000,
      },
    };
  },

  getAdminPayments: async () => {
    await delay(300);

    return [
      {
        id: 'TXN-001',
        startup_id: 'ST-001',
        application_id: 'APP-2024-001',
        created_at: new Date().toISOString(),
        amount_in_rupees: 15000,
        status: 'SUCCESS',
      },
      {
        id: 'TXN-002',
        startup_id: 'ST-004',
        application_id: 'APP-2024-003',
        created_at: new Date(
          Date.now() - 86400000
        ).toISOString(),
        amount_in_rupees: 25000,
        status: 'PENDING',
      },
      {
        id: 'TXN-003',
        startup_id: 'ST-005',
        application_id: 'APP-2024-004',
        created_at: new Date(
          Date.now() - 172800000
        ).toISOString(),
        amount_in_rupees: 15000,
        status: 'SUCCESS',
      },
    ];
  },
};

// ============================================================
// WAIVERS API
// ============================================================
export const waiversAPI = {
  createWaiver: async data => {
    return await fetchAPI('/fee-waivers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyWaivers: async () => {
    return await fetchAPI('/fee-waivers/my-requests');
  },

  getAdminWaivers: async () => {
    await delay(300);

    return [
      {
        id: 'WAV-001',
        startup_id: 'ST-002',
        application_id: 'APP-2024-002',
        reason: 'Women-led Startup DPIIT Recognized',
        status: 'PENDING',
      },
      {
        id: 'WAV-002',
        startup_id: 'ST-005',
        application_id: 'APP-2024-005',
        reason: 'Student Innovator Category',
        status: 'APPROVED',
      },
    ];
  },

  reviewWaiver: async (waiverId, status, remarks) => {
    return await fetchAPI(`/fee-waivers/${waiverId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        reviewer_remarks: remarks,
      }),
    });
  },
};

// ============================================================
// REFUNDS API
// ============================================================
export const refundsAPI = {
  checkEligibility: async paymentId => {
    return await fetchAPI(
      `/payments/${paymentId}/refund-eligibility`
    );
  },

  requestRefund: async paymentId => {
    return await fetchAPI(
      `/payments/${paymentId}/refund-request`,
      {
        method: 'POST',
      }
    );
  },

  initiateRefund: async refundId => {
    return await fetchAPI(
      `/admin/refunds/${refundId}/initiate`,
      {
        method: 'POST',
      }
    );
  },

  getMyRefunds: async () => {
    return await fetchAPI('/refunds/my-refunds');
  },

  getAdminRefunds: async () => {
    await delay(300);

    return [
      {
        id: 'REF-001',
        startup_id: 'ST-003',
        application_id: 'APP-2024-004',
        refundable_amount: 1450000,
        processing_fee: 50000,
        status: 'REQUESTED',
      },
      {
        id: 'REF-002',
        startup_id: 'ST-006',
        application_id: 'APP-2024-007',
        refundable_amount: 2400000,
        processing_fee: 100000,
        status: 'COMPLETED',
      },
    ];
  },
};

// ============================================================
// MATCHING API
// ============================================================
export const matchingAPI = {
  getMatches: async (role, entityId) => {
    await delay(800);
    return mockMatchingData;
  },

  getMatchesForChallenge: async challengeId => {
    await delay(600);

    const applications = mockApplications.filter(
      app => app?.challengeId === challengeId
    );

    const results = applications
      .map((app, index) => {
        const startup = mockStartups.find(
          s => s?.id === app.startupId
        );

        if (!startup) return null;

        const existingMatch = mockMatchingData.find(
          m =>
            m?.startupId === startup.id &&
            m?.challengeId === challengeId
        );

        const seed =
          (startup.id.length +
            challengeId.length +
            index) *
          7;

        const overallScore =
          existingMatch?.overallScore ||
          (70 + (seed % 25));

        const breakdown =
          existingMatch?.breakdown || {
            technicalFit: Math.min(
              100,
              overallScore + 2
            ),
            sectorExperience: Math.min(
              100,
              overallScore - 1
            ),
            teamCapability: Math.min(
              100,
              overallScore + 4
            ),
            previousExperience: Math.min(
              100,
              overallScore - 3
            ),
            financialCapability: Math.min(
              100,
              overallScore - 5
            ),
            scalability: Math.min(
              100,
              overallScore + 1
            ),
            locationMatch:
              seed % 2 === 0 ? 100 : 70,
          };

        return {
          rank: 0,
          startupId: startup.id,
          startupName: startup.name,
          logo:
            startup.avatar ||
            startup.name
              .substring(0, 2)
              .toUpperCase(),
          location: startup.location,
          overallScore,

          technologyScore:
            breakdown.technicalFit,

          problemSimilarityScore:
            breakdown.sectorExperience,

          sectorScore:
            breakdown.sectorExperience,

          experienceScore:
            breakdown.previousExperience,

          teamScore:
            breakdown.teamCapability,

          scalabilityScore:
            breakdown.scalability,

          revenueScore:
            breakdown.financialCapability,

          locationScore:
            breakdown.locationMatch,

          whyMatches: [
            startup.technology
              ? startup.technology.split(',')[0]
              : 'Tech match',

            startup.govtProjects > 0
              ? `${startup.govtProjects} Govt Projects`
              : 'Promising startup',
          ],

          watchPoints:
            startup.teamSize < 20
              ? ['Small team size']
              : [],
        };
      })
      .filter(Boolean);

    results.sort(
      (a, b) => b.overallScore - a.overallScore
    );

    results.forEach((res, idx) => {
      res.rank = idx + 1;
    });

    return results;
  },

  runEngine: async challengeId => {
    if (!challengeId) {
      challengeId = 'CH-2024-001';
    }

    const result = await fetchAPI(
      '/matching/analyze',
      {
        method: 'POST',
        body: JSON.stringify({
          challenge_id: challengeId,
        }),
      }
    );

    return {
      success: true,
      matches: result.results,
      computedAt: new Date().toISOString(),
    };
  },

  getStartupDashboard: async startupId => {
    await delay(500);

    const startupIdToUse =
      startupId || 'ST-001';

    const startup = mockStartups.find(
      s => s?.id === startupIdToUse
    );

    const profileReadiness = startup
      ? startup.profileCompletion || 87
      : 87;

    let applications =
      mockApplications.filter(
        app =>
          app?.startupId ===
          startupIdToUse
      );

    if (applications.length < 4) {
      const fallbacks = [
        {
          id: 'APP-DEMO-1',
          startupId: startupIdToUse,
          challengeId: 'CH-2024-001',
          status: 'Evaluation',
          overallScore: 91.4,
        },
        {
          id: 'APP-DEMO-2',
          startupId: startupIdToUse,
          challengeId: 'CH-2024-003',
          status: 'Submitted',
          overallScore: 78.2,
        },
        {
          id: 'APP-DEMO-3',
          startupId: startupIdToUse,
          challengeId: 'CH-2024-007',
          status: 'Under Review',
          overallScore: 72.6,
        },
        {
          id: 'APP-DEMO-4',
          startupId: startupIdToUse,
          challengeId: 'CH-2024-010',
          status: 'Under Review',
          overallScore: 68.1,
        },
      ];

      const existingIds = new Set(
        applications.map(
          a => a.challengeId
        )
      );

      for (const f of fallbacks) {
        if (applications.length >= 4)
          break;

        if (
          !existingIds.has(
            f.challengeId
          )
        ) {
          applications.push(f);
          existingIds.add(
            f.challengeId
          );
        }
      }
    }

    let totalScore = 0;

    const appliedChallenges =
      applications.map(app => {
        const challenge =
          mockChallenges.find(
            c =>
              c.id ===
              app?.challengeId
          );

        const matchScore =
          app?.scores?.overall ||
          app?.overallScore ||
          (70 +
            (app?.id?.length ||
              0 * 2));

        totalScore += matchScore;

        return {
          id:
            challenge?.id ||
            app?.challengeId,

          title:
            challenge?.title ||
            'Unknown Challenge',

          department:
            challenge?.department ||
            'Government Department',

          matchScore:
            parseFloat(
              matchScore.toFixed(1)
            ),

          status:
            app?.status ===
            'Evaluation'
              ? 'Excellent Fit'
              : app?.status ===
                'Submitted'
              ? 'Good Fit'
              : 'Moderate Fit',

          iconType:
            challenge?.sector ||
            'General',
        };
      });

    const averageMatchScore =
      appliedChallenges.length > 0
        ? (
            totalScore /
            appliedChallenges.length
          ).toFixed(1)
        : 76.4;

    const appliedChallengeIds =
      new Set(
        applications.map(
          a => a?.challengeId
        )
      );

    const availableChallenges =
      mockChallenges.filter(
        c =>
          !appliedChallengeIds.has(
            c.id
          )
      );

    const recommendations =
      availableChallenges
        .slice(0, 5)
        .map((challenge, index) => {
          const matchScore =
            95 - index * 4;

          return {
            id: challenge.id,
            title: challenge.title,
            department:
              challenge.department,
            matchScore,
            matchLabel:
              matchScore >= 90
                ? 'High Match'
                : 'Good Match',
            iconType:
              challenge.sector,
          };
        });

    const highMatchOpportunities =
      recommendations.filter(
        r => r.matchScore >= 80
      ).length;

    return {
      profileReadiness,
      totalApplied:
        applications.length,
      averageMatchScore,
      highMatchOpportunities,
      appliedChallenges,
      recommendations,
    };
  },
};

// ============================================================
// SCALEUPS API
// ============================================================
export const scaleupsAPI = {
  getAll: async () => {
    await delay(400);
    return mockScaleups;
  },

  recommend: async (
    pilotId,
    decision
  ) => {
    await delay(500);

    return {
      success: true,
      decision,
      message: `Scale-up decision: ${decision}`,
    };
  },
};

// ============================================================
// TEMPLATES API
// ============================================================
export const templatesAPI = {
  getAll: async () => {
    await delay(300);
    return mockTemplates;
  },

  download: async id => {
    await delay(400);

    return {
      success: true,
      message: 'Download started',
    };
  },
};

// ============================================================
// EXPERT NETWORK API
// ============================================================
export const expertsAPI = {
  getAll: async () => {
    await delay(300);
    return expertMentors;
  },

  getById: async id => {
    await delay(250);

    const expert =
      expertMentors.find(
        e => e.id === id
      );

    if (!expert) {
      throw new Error(
        'Expert not found'
      );
    }

    return expert;
  },

  getRecommended: async challengeId => {
    await delay(500);

    const challenge =
      mockChallenges.find(
        c => c.id === challengeId
      ) || null;

    return rankExpertsForChallenge(
      challenge,
      expertMentors
    );
  },

  requestMentorship: async data => {
    await delay(600);

    return {
      success: true,

      request: {
        ...data,
        id: `MR-${Date.now()
          .toString()
          .slice(-6)}`,

        status: 'Requested',

        requestedDate:
          new Date()
            .toISOString()
            .split('T')[0],

        scheduledFor: null,
        outcome: null,
      },
    };
  },

  updateMentorship: async (
    id,
    status
  ) => {
    await delay(400);

    const slot =
      new Date(
        Date.now() +
          4 * 86400000
      )
        .toISOString()
        .split('T')[0];

    return {
      success: true,
      id,
      status,

      scheduledFor:
        status === 'Scheduled'
          ? `${slot}, 11:00 IST`
          : null,
    };
  },

  saveOutcome: async (
    id,
    outcome
  ) => {
    await delay(400);

    return {
      success: true,
      id,
      outcome,
    };
  },
};

// ============================================================
// DASHBOARD API
// ============================================================
export const dashboardAPI = {
  getStats: async role => {
    await delay(400);

    return (
      dashboardStats[role] ||
      dashboardStats.government
    );
  },
};

// ============================================================
// PROFILE API
// ============================================================
export const profileAPI = {
  getInnovationPassportData:
    async startupId => {
      await delay(600);

      return {
        ippsId: 'IPP-2026-00421',

        issuedOn: '16 Sep 2026',

        lastUpdated: '16 Sep 2026',

        verified: true,

        identity: {
          logo: 'NT',

          shortDesc:
            'Real-time monitoring and predictive analytics for safer water',

          sector:
            'Water & Urban Infrastructure',

          ministry:
            'Ministry of Jal Shakti',

          challengeId:
            'CHL-1042',
        },

        journey: [
          {
            id: 'challenge',
            title: 'Challenge',
            desc: 'Problem statement identified',
            date: '12 Jan 2026',
            status: 'completed',
          },

          {
            id: 'match',
            title: 'Match',
            desc: 'Matched with startup based on solution fit',
            date: '20 Jan 2026',
            status: 'completed',
          },

          {
            id: 'evaluation',
            title: 'Evaluation',
            desc: 'Technical & business evaluation completed',
            date: '05 Feb 2026',
            status: 'completed',
          },

          {
            id: 'pilot',
            title: 'Pilot',
            desc: 'Pilot deployment in selected location',
            date: '12 Apr 2026',
            status: 'completed',
          },

          {
            id: 'procurement',
            title: 'Procurement',
            desc: 'Contract & compliance verified',
            date: '18 Jul 2026',
            status: 'completed',
          },

          {
            id: 'scaleup',
            title: 'Scale-up',
            desc: 'Approved for scale-up',
            date: '16 Sep 2026',
            status: 'completed',
          },
        ],

        outcomes: {
          accuracy: '87%',
          reduction: '35%',
          duration: '6 Months',
          locations: '3 Locations',
        },

        impact: {
          cities: '12',
          departments: '3',
          citizens: '2.4L+',
          economic: '₹320 Cr',
        },

        documents: [
          {
            title:
              'Evaluation Report Verified',
            status: 'verified',
          },

          {
            title:
              'Pilot KPI Report Verified',
            status: 'verified',
          },

          {
            title:
              'Compliance & Safety Certificates',
            status: 'verified',
          },

          {
            title:
              'Procurement Documentation',
            status: 'verified',
          },

          {
            title:
              'Scale-up Approval',
            status: 'verified',
          },
        ],
      };
    },
};