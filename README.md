# 🎓 LearnSphere AI — Early Academic Intervention & Personalized Learning Platform

> **ISTE-ED01 Hackathon Project**: AI-powered platform for predicting semester readiness from Internal Assessment (IA) test scores, generating adaptive 6-week study roadmaps, and providing faculty intervention analytics.

---

## 🚀 Key Features

### 1. Student Portal (`StudentHub.jsx`)
- **Dual Input Assessment**: Drop transcript marksheet (PDF/PNG OCR parser) or input IA scores out of 50 manually.
- **Performance Risk Analysis**: Subject score classification with color-coded risk pills (**Emerald Strong**, **Amber Average**, **Red Weak**).
- **In-Card Semester Readiness**: Integrated speedometer-style linear progress bar set to **78% ("On Track")**.
- **6-Week Adaptive Study Roadmap**: Stepper roadmap where connecting lines sit visually **BEHIND circular step nodes (`bg-white`)**.
- **AI Study Priorities**: Priority cards powered by Google Gemini API logic (*High Priority*, *Review Needed*, *Maintain Pace*).

### 2. Adaptive Quiz Engine (`AdaptiveQuiz.jsx`)
- Weekly dynamic quizzes with difficulty auto-scaling (Wk 1: 10 Easy → Wk 6: 10 Hard).

### 3. Teacher Portal & Faculty Analytics (`FacultyAnalytics.jsx`)
- Overview KPI stats (*Total Enrolled: 128*, *At-Risk: 4*, *Resolved: 1*).
- Priority Intervention Roster with functional **Send Nudge** and **Resolve** action handlers calling Python Flask REST APIs.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Python Flask, Flask-RESTful, Flask-JWT-Extended, SQLAlchemy.
- **ML & CV**: Scikit-Learn RandomForestClassifier, OpenCV, Tesseract OCR.
- **AI**: Google Gemini API integration.
- **Database**: Supabase PostgreSQL schemas (`schema.sql`).

---

## 📁 Repository Structure

```
learnsphere-ai/
├── frontend/
│   ├── src/
│   │   ├── components/       # Header & Navbar
│   │   ├── pages/            # StudentHub, AdaptiveQuiz, FacultyAnalytics
│   │   ├── services/         # Axios API Client
│   │   ├── context/          # Auth Context
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── routes/           # Auth, Student, and Teacher Blueprints
│   │   ├── models/           # SQLAlchemy Models
│   │   ├── ml/               # Readiness Predictor Model
│   │   ├── ocr/              # Transcript OCR Parser
│   │   └── ai/               # Gemini AI Study Plan Generator
│   ├── main.py               # Flask App Entrypoint
│   └── requirements.txt
├── schema.sql                # Supabase Database Schema
└── README.md
```

---

## ⚡ Quick Start

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### Backend (Python Flask REST API)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
API running at `http://localhost:5000/api`.

---

## 📄 License

MIT License © 2026 LearnSphere AI Team
