from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import schemas
from app.database import get_db
from app.crud import products as crud_products
from app.crud import suppliers as crud_suppliers

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.post(
    "/", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED
)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    supplier = crud_suppliers.get_supplier_by_id(db, product.supplier_id)
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found"
        )
    return crud_products.create_product(db, product)


@router.get("/", response_model=List[schemas.ProductWithSupplier])
def get_all_products(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = Query(None),
    certification_status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return crud_products.get_products(
        db,
        skip=skip,
        limit=limit,
        category=category,
        certification_status=certification_status,
    )


@router.put("/{product_id}", response_model=schemas.ProductResponse)
def update_product(
    product_id: int,
    product_update: schemas.ProductUpdate,
    db: Session = Depends(get_db),
):
    updated_product = crud_products.update_product(db, product_id, product_update)
    if not updated_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    return updated_product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    deleted = crud_products.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    return None
