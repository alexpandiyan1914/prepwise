# PrepWise

## Prepare Smarter. Get Placement Ready.

PrepWise is an intelligent and explainable placement preparation recommendation system for college students and graduates.

It compares a student's resume and skills with a target company's Job Description (JD) and recommends what the student should prepare next.

## Features

* Resume parsing from PDF, DOCX, and TXT files
* Job Description upload or direct text input
* Technical skill extraction and normalization
* Semantic skill matching
* Skill gap classification:

  * Strong Match
  * Partial Match
  * Weak
  * Missing
* Placement readiness score
* Personalized preparation recommendations
* Explainable recommendation scoring
* Prerequisite-based topic ordering
* Personalized 5-day preparation roadmap
* Curated learning resources
* Demo profiles for different placement roles
* Fully functional locally without paid LLM APIs

## Recommendation Formula

PrepWise uses the following weighted scoring model:

```text
Recommendation Score =
0.30 × JD Relevance
+ 0.25 × Skill Gap
+ 0.20 × Role Importance
+ 0.10 × Prerequisite Readiness
+ 0.10 × User Preference
+ 0.05 × Learning History
```

| Score    | Priority  |
| -------- | --------- |
| 80 - 100 | Very High |
| 65 - 79  | High      |
| 45 - 64  | Medium    |
| 0 - 44   | Low       |

## Tech Stack

### Frontend

* React 18
* Vite 5
* React Router DOM
* Axios
* Lucide React
* Custom CSS

### Backend

* Python 3.10+
* Flask
* Flask-CORS
* SQLAlchemy
* SQLite
* PyPDF
* Python-DOCX
* Scikit-learn
* NumPy
* Pytest

## Project Structure

```text
prepwise/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── seed.py
│   ├── evaluate.py
│   ├── requirements.txt
│   │
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── data/
│   ├── tests/
│   └── uploads/
│
├── README.md
└── .gitignore
```

## Installation

### Requirements

Make sure the following are installed:

* Python 3.10 or higher
* Node.js 18 or higher
* npm

### Backend Setup

From the project root:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r backend/requirements.txt
```

Initialize the database:

```bash
python backend/seed.py
```

Start the backend:

```bash
python backend/app.py
```

Backend:

```text
http://127.0.0.1:5000
```

Health check:

```text
http://127.0.0.1:5000/api/health
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint                             | Description              |
| ------ | ------------------------------------ | ------------------------ |
| GET    | `/api/health`                        | Check backend status     |
| POST   | `/api/profile`                       | Create or update profile |
| GET    | `/api/profile`                       | Get latest profile       |
| POST   | `/api/upload/resume`                 | Upload and parse resume  |
| POST   | `/api/upload/jd`                     | Upload Job Description   |
| POST   | `/api/jd/text`                       | Submit JD text           |
| POST   | `/api/analyze`                       | Run complete analysis    |
| GET    | `/api/analysis/<id>`                 | Get analysis             |
| GET    | `/api/analysis/<id>/skills`          | Get skill gaps           |
| GET    | `/api/analysis/<id>/recommendations` | Get recommendations      |
| GET    | `/api/analysis/<id>/roadmap`         | Get 5-day roadmap        |
| GET    | `/api/resources/<canonical_id>`      | Get learning resources   |
| GET    | `/api/demo/cases`                    | Get demo profiles        |

## Running Tests

Run the recommendation engine tests:

```bash
python -m pytest backend/tests/test_recommendation_engine.py -v
```

Run the offline evaluation:

```bash
python backend/evaluate.py
```

## Demo

1. Start the backend and frontend.
2. Open:

```text
http://localhost:5173
```

3. Select `Try Demo`.
4. Choose a demo profile such as:

   * Software Development Engineer
   * Frontend Developer
   * Data Analyst
   * Backend Developer
5. Review the readiness score.
6. Check the recommended preparation topics.
7. Open the scoring breakdown to understand why each topic was recommended.
8. View the personalized 5-day roadmap.

## NLP Fallback System

PrepWise uses multiple levels of skill matching:

1. Sentence Transformers for semantic embeddings
2. TF-IDF and cosine similarity
3. Skill taxonomy and synonym matching
4. Keyword and boundary matching

This allows the system to continue working locally even when advanced NLP models are unavailable.

## Evaluation Results

The current offline benchmark results are:

```text
Mean Precision@5: 1.0000
Mean Recall@5:    0.7515
Mean NDCG@5:     0.8946
```

## License

This project is intended for educational and placement preparation purposes.
