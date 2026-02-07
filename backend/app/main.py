from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import suppliers, products, analytics
import os
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GreenTrade Management API",
    description="Supplier and Product Management System",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("http://localhost:5173","https://green-trade-assignment.vercel.app")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(suppliers.router)
app.include_router(products.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {
        "message": "GreenTrade Management API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.head("/health")
@app.get("/health")
def health_check():
    return {"status": "healthy"}