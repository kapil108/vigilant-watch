# 🛡️ Vigilant Watch - AI Fraud Detection System

**Vigilant Watch** happens to be a next-generation fraud detection platform that combines **Rule-Based Engines**, **Statistical Analysis**, and **Machine Learning** to detect financial anomalies in real-time.

Designed for high-performance and explainability, it features a live interactive dashboard for analyzing transaction flows, investigating alerts, and visualizing fraud patterns.

---

## 🚀 Key Features

*   **⚡ Real-Time Hybrid Detection**: Simultaneously evaluates transactions using:
    *   **Deterministic Rules**: High-value thresholds, rapid velocity checks.
    *   **Statistical Anomalies**: Z-Score analysis for deviation from user averages.
    *   **Machine Learning**: Risk scoring models to predict fraud probability (0-100).
*   **📊 Dynamic Modeling**:
    *   **Live Analytics**: Real-time charts for Fraud Trends, "Time-of-Day" patterns, and Geo-distribution.
    *   **Smart Scoring**: Average Risk metrics to compare model confidence.
*   **🔍 Interactive Forensics**:
    *   Detailed transaction breakdowns.
    *   Explainable AI: See exactly *why* a transaction was flagged (e.g., "Amount > 3σ from mean").
*   **💎 Modern UI/UX**: Built with React, TailwindCSS, and Recharts for a premium, responsive experience.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | **FastAPI** (Python 3.10+) | High-performance async API with SQLAlchemy & Pydantic. |
| **Frontend** | **React + Vite** | Blazing fast Dashboard with TypeScript & Shadcn UI. |
| **Database** | **SQLite** | Lightweight, zero-config SQL database (SQLAlchemy ORM). |
| **Analysis** | **Pandas / Scikit-Learn** | Data processing and statistical anomaly detection. |

---

## ⚙️ Installation & Setup

### Prerequisites
*   **Python 3.8+**
*   **Node.js 16+**

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/vigilant-watch.git
cd vigilant-watch
```

### 2. Backend Setup
Create a virtual environment and install dependencies:
```bash
# Windows
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup
Navigate to the frontend directory and install Node modules:
```bash
cd vigilant-watch-main
npm install
```

---

## ▶️ Running the Application

We provide a **One-Click Start Script** for Windows:

```bash
# Run from the root directory
.\run_project.bat
```

This will automatically:
1.  Start the **FastAPI Backend** on `http://127.0.0.1:8000`
2.  Start the **Vite Frontend** on `http://localhost:8080` (or 5173)

### Manual Startup
If you prefer running services separately:

**Backend:**
```bash
.\.venv\Scripts\python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Frontend:**
```bash
cd vigilant-watch-main
npm run dev
```

---

## 📡 API Documentation

The backend includes auto-generated interactive documentation:
*   **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
*   **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 📷 Screenshots

> *Add screenshots of the Dashboard here*

---

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

Brought to you by the **FDS Team** 🚀
