from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas
from app.database import get_db
from app.crud import products as crud_products

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/summary", response_model=schemas.AnalyticsSummary)
def get_analytics_summary(db: Session = Depends(get_db)):
    return crud_products.get_analytics_summary(db)