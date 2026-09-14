# PrepWise — Intelligent Personalized Placement Preparation Recommendation System

> **Tagline:** "Prepare Smarter. Get Placement Ready."

PrepWise is an intelligent, explainable full-stack placement preparation recommendation system built for college students and graduates. It answers the fundamental student question:
> **"For this company and this role, what should I prepare next?"**

PrepWise compares a student's resume and current competency profile against a target company's job description (JD). It extracts technical proficiencies, performs semantic skill matching and gap classification, evaluates readiness, ranks preparation activities using a transparent multi-factor recommendation engine, and generates a personalized 5-day preparation roadmap with curated learning resources.

---

## 🎯 Key Features

- **Multi-Format Document Parsing:** Ingests resumes in PDF, DOCX, or TXT format and extracts technical skills, projects, and coursework.
- **Dual JD Input:** Supports PDF/TXT upload or direct text paste with automated separation of **Required Skills** vs **Preferred Qualifications**.
- **Structured Skill Taxonomy:** Maps 30+ core placement topics (DSA, OOP, DBMS, OS, Computer Networks, System Design, Web, Cloud, AI/ML) with normalized canonical aliases (e.g., `cpp`/`c plus plus` -> `C++`, `reactjs` -> `React`).
- **Resilient 4-Tier NLP Fallback:** 
  - **Tier 1:** Sentence Transformers (Embeddings)
  - **Tier 2:** scikit-learn TF-IDF & Cosine Similarity
  - **Tier 3:** Skill Taxonomy & Synonym Graph
  - **Tier 4:** Keyword & Boundary Token Matching
  - *100% functional locally without any paid or external LLM API dependency.*
- **Four-Category Skill Gap Classification:** Identifies `STRONG_MATCH`, `PARTIAL_MATCH`, `WEAK`, and `MISSING` skills with resume evidence snippets.
- **Weighted Multi-Factor Recommendation Engine:** Implements the PRD formula combining JD relevance, skill gap, role importance, prerequisite readiness, user learning preference, and learning history.
- **Scoring Explainability:** Every priority card features transparent factor breakdowns answering *"Why was this recommended?"* and *"What to study next"*.
- **Prerequisite Knowledge Graph:** Uses a directed dependency graph (e.g., Programming -> OOP -> DSA -> Problem Solving) to prevent recommending advanced topics before foundations are solid.
- **Personalized 5-Day Placement Sprint:** Dynamically schedules daily milestones based on user availability (1 to 8 hours/day).
- **Curated Resource Library:** Integrated video, article, course, documentation, and practice links (LeetCode, TakeUForward, GeeksforGeeks, MDN).
- **One-Click Live Demo Mode:** Pre-loaded with 4 benchmark placement profiles (Software Development Engineer, Frontend Developer, Data Analyst, Backend Developer) for instant live evaluation.

---

## 📐 Recommendation Algorithm & Scoring Formula

PrepWise calculates recommendation scores using the weighted model specified in the PRD:

$$\text{Recommendation Score} = 0.30 \times \text{JD Relevance} + 0.25 \times \text{Skill Gap} + 0.20 \times \text{Role Importance} + 0.10 \times \text{Prerequisite Readiness} + 0.10 \times \text{User Preference} + 0.05 \times \text{Learning History}$$

Normalized to a $0 - 100$ scale:

| Score Range | Priority Label | Description |
|:---:|:---:|:---|
| **80 – 100** | `VERY HIGH` | Critical requirement with a major gap and high role weight |
| **65 – 79** | `HIGH` | Significant topic with partial gap or high role importance |
| **45 – 64** | `MEDIUM` | Supporting technical competency or preferred skill |
| **0 – 44** | `LOW` | Minor gap or already well-satisfied foundation |

---

## 🏗 System Architecture & Data Flow

```
Resume (PDF/DOCX/TXT)  +  Job Description (PDF/Paste)  +  Student Preferences
                        │
                        ▼
            [ Parsers & Extractors ]
   (resume_parser.py, jd_parser.py, skill_extractor.py)
                        │
                        ▼
              [ Skill Normalizer ]
      (skill_normalizer.py + skills.json)
                        │
                        ▼
           [ Semantic Skill Matcher ]
      (semantic_matcher.py with cosine similarity)
                        │
                        ▼
              [ Skill Gap Analyzer ]
   (gap_analyzer.py: Strong, Partial, Weak, Missing)
                        │
                        ▼
        [ PrepWise Readiness Calculator ]
  (readiness_engine.py: 0-100 placement readiness index)
                        │
                        ▼
         [ Recommendation Engine (Core) ]
   (recommendation_engine.py: PRD weighted formula,
     role importance, prerequisite graph, preference boost)
                        │
                        ▼
           [ Resource & Roadmap Engines ]
     (resource_engine.py + roadmap_engine.py 5-day plan)
                        │
                        ▼
          [ Flask REST API & SQLite DB ]
                        │
                        ▼
        [ React Vite UI / Interactive Dashboard ]
```

---

## 💻 Technology Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite 5
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Styling:** Modern Custom CSS Design System (Responsive, Dark Slate/Indigo aesthetic)

### Backend
- **Language:** Python 3.10+ (tested on Python 3.13)
- **Framework:** Flask 3.0 + Flask-CORS
- **Database:** SQLite with SQLAlchemy 2.0 & Flask-SQLAlchemy 3.1
- **NLP & Document Parsing:** `pypdf`, `python-docx`, `scikit-learn`, `numpy`
- **Testing:** `pytest`

---

## 📁 Project Structure

```
prepwise/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── ProfileForm.jsx
│   │   │   ├── FileUploader.jsx
│   │   │   ├── JdInput.jsx
│   │   │   ├── AnalysisLoader.jsx
│   │   │   ├── ReadinessScore.jsx
│   │   │   ├── SkillOverview.jsx
│   │   │   ├── SkillGapCard.jsx
│   │   │   ├── RecommendationCard.jsx
│   │   │   ├── RecommendationFactors.jsx
│   │   │   ├── ResourceCard.jsx
│   │   │   ├── RoadmapTimeline.jsx
│   │   │   ├── DemoModal.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── RoadmapPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── data/
│   │   │   └── sampleData.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── extensions.py
│   ├── seed.py
│   ├── evaluate.py
│   ├── requirements.txt
│   ├── .env.example
│   │
│   ├── models/
│   │   ├── student.py
│   │   ├── job.py
│   │   ├── skill.py
│   │   ├── recommendation.py
│   │   └── resource.py
│   │
│   ├── routes/
│   │   ├── profile_routes.py
│   │   ├── upload_routes.py
│   │   ├── analysis_routes.py
│   │   ├── recommendation_routes.py
│   │   ├── resource_routes.py
│   │   └── demo_routes.py
│   │
│   ├── services/
│   │   ├── resume_parser.py
│   │   ├── jd_parser.py
│   │   ├── skill_extractor.py
│   │   ├── skill_normalizer.py
│   │   ├── semantic_matcher.py
│   │   ├── gap_analyzer.py
│   │   ├── readiness_engine.py
│   │   ├── recommendation_engine.py
│   │   ├── resource_engine.py
│   │   └── roadmap_engine.py
│   │
│   ├── data/
│   │   ├── skills.json
│   │   ├── prerequisites.json
│   │   ├── role_importance.json
│   │   └── resources.json
│   │
│   ├── tests/
│   │   └── test_recommendation_engine.py
│   │
│   └── uploads/
│
├── README.md
└── .gitignore
```

---

## 🚀 Setup & Execution Guide

### 1. Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher & npm

### 2. Backend Setup
Open a terminal in the project root:

```bash
# Optional: create virtual environment
python -m venv venv

# Windows Activation:
.\venv\Scripts\activate
# Linux/macOS Activation:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Initialize & seed SQLite database
python backend/seed.py

# Start Flask Backend (port 5000)
python backend/app.py
```

The backend starts at `http://127.0.0.1:5000`. Verify health by visiting `http://127.0.0.1:5000/api/health`.

### 3. Frontend Setup
Open a second terminal in the project root:

```bash
cd frontend

# Install Node packages
npm install

# Start Vite development server
npm run dev
```

The frontend launches at `http://localhost:5173`.

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `POST` | `/api/profile` | Create or update candidate profile |
| `GET` | `/api/profile` | Retrieve most recent profile |
| `POST` | `/api/upload/resume` | Upload PDF/DOCX/TXT resume & extract skills |
| `POST` | `/api/upload/jd` | Upload JD file & extract requirements |
| `POST` | `/api/jd/text` | Submit raw JD text & extract requirements |
| `POST` | `/api/analyze` | **Master Pipeline**: Parses, matches, ranks & returns complete dashboard JSON |
| `GET` | `/api/analysis/<id>` | Retrieve previous analysis by ID |
| `GET` | `/api/analysis/<id>/skills` | Retrieve skill gap matrix |
| `GET` | `/api/analysis/<id>/recommendations` | Retrieve ranked recommendations |
| `GET` | `/api/analysis/<id>/roadmap` | Retrieve 5-day preparation roadmap |
| `GET` | `/api/resources/<canonical_id>` | Retrieve curated resources for a skill |
| `GET` | `/api/demo/cases` | Retrieve demo test benchmarks |

---

## 🧪 Testing & Evaluation

### Run Unit Tests
PrepWise includes test suites verifying normalization, semantic matching, prerequisite damping, preference weighting, and roadmap sequencing:

```bash
python -m pytest backend/tests/test_recommendation_engine.py -v
```

### Run Offline Evaluation Benchmark
Evaluates the recommendation engine across four role benchmarks (SDE, Frontend, Data Analyst, Backend):

```bash
python backend/evaluate.py
```

**Evaluation Results:**
- **Mean Precision@5:** `1.0000` (target > 0.80)
- **Mean Recall@5:** `0.7515` (target > 0.70)
- **Mean NDCG@5:** `0.8946` (target > 0.85)

---

## 🎬 Evaluation & Demonstration Flow

1. Open `http://localhost:5173` in your browser.
2. Click **"Try Demo"** in the top navigation or on the landing page.
3. Select **Software Development Engineer (Amazon)**.
4. Watch the step-by-step analysis checklist process in real time.
5. Review the **PrepWise Readiness Score** (gauge & metric badges).
6. Explore **Your Top Preparation Priorities**:
   - Notice that DSA, Operating Systems, and DBMS dynamically emerge as top recommendations.
   - Click **"View Scoring Breakdown & Learning Resources"** on any card to see exact scoring factors (JD relevance, skill gap, role importance, prerequisite readiness, preference).
   - Click curated learning resource links.
7. Click **"View 5-Day Roadmap"** to inspect daily topics, study hours, and actionable checklists.
