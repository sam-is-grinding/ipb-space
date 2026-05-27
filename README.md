# Punya orang
 
Repository ini adalah fork dari project [IPB Space](https://github.com/HusniAbdillah/ipb-space).
Bedanya di sini ada tambahan protokol keamanan(?) atau apapun namanya, untuk tugas pada mata kuliah KOM1315
---
 
# copy_source.py
 
Script ini dipakai untuk menyalin file-file _source code_ yang (mungkin) relevan dari folder backend ke struktur folder target (misal `03_Source_Code`).
 
## Cara pakai
 
Jalankan scriptnya:
 
```bash
python copy_source.py
```
 
Nanti akan minta dua input path:
 
- **SOURCE**: path ke folder `backend` project kamu
- **TARGET**: path ke folder `03_Source_Code` tujuan
Contoh input:
 
```
Input SOURCE backend folder path:
> C:\Users\ipb-space\backend
 
Input TARGET 03_Source_Code folder path:
> C:\Users\KOM1315_SmtGenap26_Kelompok04_IPBSpace\03_Source_Code
```
 
> Pakai path absolut supaya ga ribet tentang working directory.
 
## Kalau mau lebih gampang

Edit langsung dua variabel di bagian atas script biar ga perlu input manual tiap kali:
 
```python
SOURCE_ROOT = r"C:\Users\ipb-space\backend"
TARGET_ROOT = r"C:\Users\KOM1315_SmtGenap26_Kelompok04_IPBSpace\03_Source_Code"
```
Tapi mendingan duplicate scriptnya, misal jadi `copy_stuff_with_path.py` gitu, terus masukin ke `.gitginore` supaya ga ke push ke repo (yg `copy_stuff_with_path.py` udah ada di `.gitignore` nya btw)

Mapping lengkap file yang disalin bisa dilihat dan diubah di bagian `MAPPINGS` dalam script.
 
---

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
