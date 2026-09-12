# IPPS Setu Synthetic Dataset

## Purpose
This dataset is a large, realistic, and completely **synthetic** collection of data designed for the AI-powered Government Challenge -> Startup Matching Engine prototype.

> [!WARNING]
> This is DEMONSTRATION/DEVELOPMENT data only. It contains no real personal data, no Aadhaar, no PAN, and no sensitive information. This dataset does NOT represent official government data, and any similarity to real startups or challenges is purely coincidental. The registration fee, fee waivers, and refund policies presented herein are synthetic business rules for demonstration and do not reflect actual government mandates.

## Dataset Sizes
- **Challenges:** 100
- **Startups:** 1,000
- **Applications:** 5,000
- **Mentorships:** Varies (Assigned to shortlisted/pilot startups)
- **Pilots:** Varies (Assigned to pilot/selected startups)
- **Procurement:** Varies (Assigned to finally selected startups)
- **Evaluation Ground Truth:** 5,000 (Matches applications 1:1)

## Schema & Relationships
- **Challenges**: Government problem statements with required tech, sectors, budgets, and experience constraints.
- **Startups**: Tech companies with capabilities, sectors, team size, experience, and SBERT-friendly text descriptions.
- **Applications**: Link a Startup to a Challenge. Contains AI-analyzed statuses, registration fees, and fee-waivers.
- **Mentorship**: Support provided to startups that reach the 'Shortlisted' or 'Pilot' stage.
- **Pilot**: KPIs and success scores for startups testing their solutions in the real world.
- **Procurement**: Final contracting details for 'Selected' startups.
- **Evaluation Ground Truth**: Pre-calculated scores (0-100) determining the exact mathematical fit of a startup to a challenge based on the prototype weights.

## Generation Process
The dataset is generated programmatically using Python's `Faker` and `random` libraries. It follows strict referential integrity rules (e.g., procurement records only exist for selected applications) and uses a fixed random seed (`42`) to guarantee reproducibility.

## Business Logic
- **Eligibility Logic:** Startups that do not meet the minimum required experience or do not possess any of the required technologies are marked as ineligible.
- **Registration Fee & Waivers:** Applications normally carry a fee. However, ~10% are synthetically marked as fee-waived due to demonstration welfare categories (e.g., PwD-led startup). Waived applications have a fee of 0.
- **Refund Logic:** Rejected or withdrawn non-waived applications receive a refund (Fee minus processing fee). Selected applications or fee-waived applications receive no refund.
- **Pilot Flow:** Only startups at the pilot stage or selected stage have pilot records. Selected startups *must* have a successful pilot record.

## How to Regenerate
1. Ensure Python 3.x is installed.
2. Install dependencies: `pip install faker sentence-transformers pandas scikit-learn motor`
3. Navigate to the `data_generator/` directory.
4. Run `python generator.py`.
5. Run `python validation/validate_dataset.py` to ensure dataset integrity.

## How to Seed MongoDB
The dataset can be safely seeded into MongoDB into isolated collections prefixed with `synthetic_` (e.g., `synthetic_challenges`) to avoid overwriting production data.
1. Ensure your MongoDB URL is configured in `backend/.env`.
2. Navigate to the `data_generator/` directory.
3. Run `python seed_database.py`.

## AI Matching Integration
The dataset includes rich semantic descriptions suitable for NLP processing. 
To test SBERT matching on this dataset:
1. Navigate to the `data_generator/` directory.
2. Run `python test_ai_matching.py`.
This script will load a sample challenge, encode startup descriptions using `sentence-transformers`, calculate Cosine Similarity, apply hard eligibility filters, and output a ranked list of startups simulating the AI Matching Engine.
