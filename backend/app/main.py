from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from app.routers import facility_router, auth_router, user_router

app = FastAPI(title="IPB Space API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(facility_router.router)
app.include_router(auth_router.router)
app.include_router(user_router.router)

@app.get("/")
def home():
    return {"status": "IPB Space Online"}

@app.exception_handler(IntegrityError)
async def sqlalchemy_integrity_exception_handler(request: Request, exc: IntegrityError):
    # This catches your "Duplicate Key" error
    detail = None
    if hasattr(exc, 'orig') and exc.orig and hasattr(exc.orig, 'args') and exc.orig.args:
        detail = str(exc.orig.args[0])
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "status": "error",
            "message": "Data conflict: This ID number or Email is already registered.",
            "detail": detail
        },
    )