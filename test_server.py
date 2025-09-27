"""
Simple test server to verify the basic setup works
"""
from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Test Server")

@app.get("/")
async def root():
    return {"message": "Test server is working!"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    print("Starting test server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)