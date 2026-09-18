from flask import Blueprint, jsonify, request
from backend.routes.analysis_routes import run_analysis

demo_bp = Blueprint("demo", __name__, url_prefix="/api/demo")

SAMPLE_CASES = {
    "sde": {
        "id": "sde",
        "title": "Software Development Engineer (SDE)",
        "company": "Amazon / Google",
        "student": {
            "name": "Alex Pandian",
            "target_role": "Software Development Engineer",
            "experience_level": "Beginner",
            "daily_prep_hours": 3.5,
            "preferred_learning": ["Practice", "Video"],
            "assessment_score": 68.0
        },
        "resume_text": """Alex Pandian - Final Year Computer Science Student
Email: alex@example.com | Phone: +91 9876543210
TECHNICAL SKILLS:
- Languages: Python, SQL
- Core Fundamentals: Basic DSA (Arrays, Linked Lists, Bubble Sort), Object Oriented Programming (OOP concepts, Classes, Inheritance)
- Web: HTML, CSS, Flask
- Tools: Git, GitHub, VS Code

PROJECTS:
1. Student Placement Portal: Built a web portal using Python Flask and SQLite. Implemented OOP principles and normalized database schema.
2. Relational Query Manager: Designed SQL database schemas and executed complex queries and aggregations.
Coursework: Completed basic programming and OOP coursework.""",
        "jd_text": """Amazon - Software Development Engineer (SDE I)
Job Location: Hyderabad / Bangalore
Role Overview:
We are looking for a Software Development Engineer with a strong problem-solving mindset and solid computer science fundamentals.

REQUIRED SKILLS:
- Strong knowledge of Data Structures and Algorithms (DSA): Trees, Graphs, Dynamic Programming, and Binary Search
- Core Computer Science Fundamentals: Operating Systems (Processes, Threads, Concurrency, Virtual Memory) and DBMS (Relational databases, Normalization, ACID transactions)
- High proficiency in Java or C++ or Python with Object-Oriented Programming (OOP)
- Proven Problem Solving ability and analytical skills

PREFERRED SKILLS:
- Familiarity with System Design principles and Scalable Distributed Systems
- Experience with Computer Networks and REST APIs
- Version control using Git"""
    },
    "frontend": {
        "id": "frontend",
        "title": "Frontend Developer",
        "company": "Swiggy / Razorpay",
        "student": {
            "name": "Sarah Chen",
            "target_role": "Frontend Developer",
            "experience_level": "Intermediate",
            "daily_prep_hours": 3.0,
            "preferred_learning": ["Documentation", "Practice"],
            "assessment_score": 74.0
        },
        "resume_text": """Sarah Chen - Frontend Engineering Aspirant
Email: sarah@example.com
TECHNICAL SKILLS:
- Web: HTML5, CSS3, JavaScript (ES6+, Closures, DOM manipulation)
- Version Control: Git, GitHub
- Libraries: Basic React (functional components, props)

PROJECTS:
1. Portfolio Web App: Developed responsive mobile-first website using HTML, CSS flexbox, and modern JavaScript.
2. Task Tracker: Built interactive todo list in JavaScript with local storage state.""",
        "jd_text": """Razorpay - Frontend Engineer I
Role: Build high-performance, accessible, and delightful web interfaces.

REQUIRED SKILLS:
- Modern JavaScript, HTML5, CSS3, and Responsive UI Design
- Strong expertise in React: Hooks, State Management, and Virtual DOM
- Hands-on experience building REST API client integrations
- Deep understanding of web performance, browser rendering, and TypeScript

PREFERRED SKILLS:
- Basic problem solving and data structures
- Experience with Git and automated testing tools"""
    },
    "data_analyst": {
        "id": "data_analyst",
        "title": "Data Analyst",
        "company": "Deloitte / Mu Sigma",
        "student": {
            "name": "Rohan Verma",
            "target_role": "Data Analyst",
            "experience_level": "Beginner",
            "daily_prep_hours": 2.5,
            "preferred_learning": ["Video", "Practice"],
            "assessment_score": 62.0
        },
        "resume_text": """Rohan Verma - Data Analyst Aspirant
Email: rohan@example.com
TECHNICAL SKILLS:
- Programming: Python (Basics, loops, functions)
- Databases: Basic SQL queries (SELECT, WHERE, JOIN)
- Spreadsheets: Microsoft Excel, Pivot Tables
- Tools: Git

PROJECTS:
1. Retail Sales Analysis: Formatted raw transaction sheets in Excel and wrote SQL queries for monthly sales reports.""",
        "jd_text": """Deloitte - Associate Data Analyst
Role: Transform enterprise datasets into actionable predictive business intelligence.

REQUIRED SKILLS:
- Advanced SQL: Window functions, Subqueries, Aggregate groupings, Joins
- Python for Data Science: Pandas, NumPy, Data Cleaning, and Exploratory Data Analysis
- Database Management Systems (DBMS) and Relational Schema Design

PREFERRED SKILLS:
- Foundational Machine Learning concepts
- Git version control and dashboarding tools"""
    },
    "backend": {
        "id": "backend",
        "title": "Backend Developer",
        "company": "Flipkart / Uber",
        "student": {
            "name": "Karthik Nair",
            "target_role": "Backend Developer",
            "experience_level": "Intermediate",
            "daily_prep_hours": 4.0,
            "preferred_learning": ["Documentation", "Courses"],
            "assessment_score": 70.0
        },
        "resume_text": """Karthik Nair - Backend Engineer
Email: karthik@example.com
TECHNICAL SKILLS:
- Languages: Python, Java
- Databases: MySQL, SQL
- CS Fundamentals: OOP, Basic DBMS

PROJECTS:
1. E-Commerce Cart Service: Implemented cart APIs in Python with MySQL backend.""",
        "jd_text": """Uber - Software Engineer (Backend)
Role: Architect scalable low-latency backend microservices.

REQUIRED SKILLS:
- REST API design, HTTP protocols, and server-side engineering
- Deep expertise in Relational Databases (DBMS, SQL, PostgreSQL/MySQL) and ACID transactions
- Proficiency in Java or Python with solid Object-Oriented Programming (OOP)
- Core Data Structures & Algorithms (DSA) for system optimization

PREFERRED SKILLS:
- System Design, Caching, and Message Queues
- Docker containerization and Git workflows"""
    }
}

@demo_bp.route("/cases", methods=["GET"])
def get_demo_cases():
    cases_summary = []
    for case_id, case in SAMPLE_CASES.items():
        cases_summary.append({
            "id": case_id,
            "title": case["title"],
            "company": case["company"],
            "student_name": case["student"]["name"],
            "target_role": case["student"]["target_role"]
        })
    return jsonify({"cases": cases_summary}), 200

@demo_bp.route("/cases/<case_id>", methods=["GET"])
def get_demo_case_detail(case_id):
    case = SAMPLE_CASES.get(case_id)
    if not case:
        return jsonify({"error": "Test case not found"}), 404
    return jsonify({"case": case}), 200
