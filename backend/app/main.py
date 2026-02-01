from fastapi import FastAPI

app = FastAPI(title="IPB Space API")

@app.get("/")
def read_root():
    return {"message": "IPB Space Backend is Running!", "status": "Secure"}