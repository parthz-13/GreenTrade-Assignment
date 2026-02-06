from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import schemas
from app.database import get_db
from app.crud import suppliers as crud_suppliers

router = APIRouter(prefix="/api/suppliers", tags=["Suppliers"])

@router.post("/", response_model=schemas.SupplierResponse, status_code=status.HTTP_201_CREATED)
def create_supplier(supplier: schemas.SupplierCreate, db: Session = Depends(get_db)):
    existing_supplier = crud_suppliers.get_supplier_by_email(db, supplier.email)
    if existing_supplier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    return crud_suppliers.create_supplier(db, supplier)

@router.get("/", response_model=List[schemas.SupplierResponse])
def get_all_suppliers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_suppliers.get_suppliers(db, skip=skip, limit=limit)

@router.get("/{supplier_id}", response_model=schemas.SupplierWithProducts)
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    supplier = crud_suppliers.get_supplier_by_id(db, supplier_id)
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supplier not found"
        )
    return supplier