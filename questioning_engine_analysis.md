# Questioning Engine (Pilot Evaluation) Analysis

The Questioning Engine is an AI-powered evaluation system designed to act as a technical gatekeeper for the sandbox/pilot program. It operates in two distinct phases: **Context-Aware Question Generation** and **Answer Evaluation**.

The engine relies on **Google Gemini (gemini-3.7-flash)** and a **Local RAG (Retrieval-Augmented Generation) implementation** to fetch historical context from past SIH challenges.

Here is a detailed breakdown to help you build the user interface inside the Startup's Pilot Tab.

---

## 1. Architecture Overview

### API Base
- **Router location:** `backend/routers/pilot_evaluation.py`
- **Prefix:** `/api` (configured in `server.py`)

### RAG Integration
- **Retriever:** `backend/lib/rag_retriever.py`
- **Data Source:** `backend/data/past_sih_challenges.csv`
- **Mechanism:** Uses TF-IDF and Cosine Similarity to compare the startup's `domain` and `proposed_solution` against historical records. It retrieves the top 2 most relevant past failures and edge cases to ground the AI's questions.

---

## 2. Phase 1: Generating Questions

The first step in the flow generates a tailored set of stress-test scenarios and deep technical questions for the startup based on their specific profile and historical failures in their domain.

### Endpoint
`POST /api/generate-questions`

### Request Payload (`EvaluationRequest`)
You will need to construct this payload using the startup's existing profile data.
```json
{
  "startup_name": "NovaTech Solutions",
  "domain": "Urban Mobility",
  "proposed_solution": "AI-based traffic optimization system",
  "historical_context": "Has completed 2 previous government deployments."
}
```

### Response Schema (`EvaluationResponse`)
The API strictly returns exactly 5 scenarios and 5 technical questions.
```json
{
  "scenarios": [
    "Scenario 1 string...",
    "Scenario 2 string...",
    // ... 5 total
  ],
  "technical_questions": [
    "Question 1 string...",
    "Question 2 string...",
    // ... 5 total
  ]
}
```

---

## 3. Phase 2: Evaluating Answers

Once the startup answers the generated technical questions, this endpoint acts as the gatekeeper, scoring the answers out of 100 based on technical depth, risk mitigation, and feasibility.

### Endpoint
`POST /api/evaluate-answers`

### Request Payload (`StartupAnswerSubmission`)
The frontend must collect the answers from the startup and pair them with the exact questions asked.
```json
{
  "startup_name": "NovaTech Solutions",
  "domain": "Urban Mobility",
  "q_and_a": [
    {
      "question": "How does your system handle extreme weather sensor degradation?",
      "answer": "Our system falls back to historical algorithmic estimates..."
    },
    // ... up to 5 pairs
  ]
}
```

### Response Schema (`EvaluationResult`)
The backend enforces a threshold: **Score >= 70 = PASS**, otherwise **FAIL**.
```json
{
  "score": 85,
  "verdict": "PASS",
  "reasoning": "Detailed string explaining why they got this score.",
  "critical_vulnerabilities": [
    "Vulnerability 1...", 
    "Vulnerability 2..."
  ],
  "recommended_sandbox_tests": [
    "Test case 1...",
    "Test case 2..."
  ]
}
```

---

## 4. UI/UX Implementation Guide for the Startup Pilot Tab

To integrate this engine into the **Startup Login Side (Pilot Tab)**, I recommend a 3-step wizard or stepper interface:

### Step 1: Pre-Evaluation / Trigger
> [!NOTE]
> Since the questions are dynamically generated, the startup shouldn't see them until they are ready to begin the evaluation.
- **UI Element:** A button `[Start Technical Evaluation]`.
- **Action:** Clicking it hits the `generate-questions` API. Show a skeleton loader while Gemini and the RAG pipeline process the request.

### Step 2: The Interview Form
> [!IMPORTANT]
> The AI expects detailed technical answers. Encourage the startup to be thorough.
- **UI Elements:**
  - Display the `scenarios` as context at the top of the page.
  - Render a vertical list of the 5 `technical_questions`.
  - Provide a rich text area (or standard textarea) below each question for the startup's `answer`.
- **Action:** A `[Submit for AI Evaluation]` button at the bottom hits the `evaluate-answers` API. Show a "Analyzing responses..." loading state.

### Step 3: Evaluation Results Dashboard
- **UI Elements:**
  - **Verdict Header:** A large dynamic badge (Green `PASS` or Red `FAIL`).
  - **Score Ring:** A circular progress chart showing the score out of 100.
  - **Reasoning Box:** A text box displaying the AI's `reasoning`.
  - **Next Steps / Warnings:** Two lists side-by-side displaying `critical_vulnerabilities` and `recommended_sandbox_tests`.

### State Management Tip
If you want to persist the state so the startup doesn't lose their questions on a page refresh, you should store the output of `/api/generate-questions` in `localStorage` or update your `mockPilots` state in `AppContext.jsx` until the real database integration is wired up on the frontend.
