# 🏛️ IPB Space

Campus facility booking and queue management system for IPB University.

## 🛠️ Tech Stack

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend** | React.js + Vite | Single Page Application (SPA) |
| **Styling** | Tailwind CSS | Utility-first Framework |
| **Backend** | FastAPI (Python) | Asynchronous Server |
| **Database** | PostgreSQL | Relational Database Management System |
| **ORM** | SQLAlchemy (Async) | Object Relational Mapping |
| **Validation** | Pydantic | Data Schema Validation |

## 🚀 Quick Start

### Prerequisites
- 🐍 Python 3.10+
- 📦 Node.js (LTS)
- 🗄️ PostgreSQL
- 🔀 Git

### Setup

Clone the repository and follow the setup guides:

**Backend Setup** (see [backend/README.md](backend/README.md))
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend Setup** (see [frontend/README.md](frontend/README.md))
```bash
cd frontend
npm install
npm run dev
```

## 🤝 Contributing

1. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
   Use prefixes: `feat/` (new feature), `fix/` (bug fix), `docs/` (documentation)

2. Commit and push:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin feat/your-feature-name
   ```

3. Submit a pull request with a clear description

## 👥 Contributors

### Kelompok 6 - Paralel 3 - KOM1337 Analisis dan Desain Sistem

| Nama | NIM |
| :--- | :--- |
| Daffa Aulia Musyaffa Subyantoro | G6401231028 |
| Naufal Ghifari Afdhala | G6401231029 |
| Husni Abdillah | G6401231097 |
