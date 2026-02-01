from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import facility_router

app = FastAPI(title="IPB Space API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(facility_router.router)

@app.get("/")
def home():
    return {"status": "IPB Space Online"}