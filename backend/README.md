# IPB Space - Backend Service

Layanan backend untuk IPB Space dibangun menggunakan FastAPI dengan arsitektur yang mendukung skalabilitas dan prinsip OOP yang ketat.

## Arsitektur Sistem (Clean Architecture)
Backend ini menerapkan pemisahan tugas (Separation of Concerns) yang ketat:

1.  **Router Layer (`/routers`):** Menangani HTTP Request dan Validasi Schema menggunakan Pydantic. **Dilarang keras** menempatkan logika bisnis di layer ini.
2.  **Service Layer (`/services`):** Menangani logika bisnis utama, seperti pengecekan bentrok jadwal, logika antrian, dan promosi status user.
3.  **Repository Layer (`/repositories`):** Menangani akses langsung ke database (operasi CRUD).

## Struktur Folder

```
backend/
├── alembic/                # (System) Folder untuk migrasi database otomatis
├── app/
│   ├── core/               # (Config) Konfigurasi utama & koneksi database
│   ├── models/             # (Database) Definisi Tabel (SQLAlchemy)
│   ├── schemas/            # (Validation) Validasi Data Input/Output (Pydantic)
│   ├── repositories/       # (Query) Akses ke Database (CRUD)
│   ├── services/           # (Logic) Logika Bisnis & Aturan Aplikasi
│   ├── routers/            # (API) Endpoint URL & Controller
│   └── main.py             # (Entry Point) Pintu masuk aplikasi FastAPI
├── requirements.txt        # Daftar library yang dipakai
└── alembic.ini             # File konfigurasi Alembic
```

## Konfigurasi Lingkungan (.env)
Buat file `.env` di dalam folder `backend/` dengan konfigurasi berikut:

```ini
DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:PORT/NAMA_DB
SECRET_KEY=string_rahasia_untuk_jwt
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Instalasi dan Eksekusi

1. **Buat Virtual Environment**
```bash
python -m venv venv
```


2. **Aktifkan Virtual Environment**
* Windows: `venv\Scripts\activate`
* Linux/Mac: `source venv/bin/activate`

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```


4. **Migrasi Database (Alembic)**
Wajib dijalankan setiap ada perubahan pada model database.
```bash
alembic upgrade head
```


5. **Jalankan Server**
```bash
uvicorn app.main:app --reload
```


6. **Dokumentasi API**
Akses Swagger UI di: `http://127.0.0.1:8000/docs`

