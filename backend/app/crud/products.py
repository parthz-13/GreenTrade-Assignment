from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, schemas
from typing import Optional

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    certification_status: Optional[str] = None
):
    query = db.query(models.Product)
    
    if category:
        query = query.filter(models.Product.category == category)
    if certification_status:
        query = query.filter(models.Product.certification_status == certification_status)
    
    return query.offset(skip).limit(limit).all()

def get_product_by_id(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def update_product(db: Session, product_id: int, product_update: schemas.ProductUpdate):
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return None
    
    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product_by_id(db, product_id)
    if db_product:
        db.delete(db_product)
        db.commit()
        return True
    return False

def get_analytics_summary(db: Session):
    total_suppliers = db.query(func.count(models.Supplier.id)).scalar()
    total_products = db.query(func.count(models.Product.id)).scalar()
    
    products_by_category = db.query(
        models.Product.category,
        func.count(models.Product.id)
    ).group_by(models.Product.category).all()
    
    products_by_certification = db.query(
        models.Product.certification_status,
        func.count(models.Product.id)
    ).group_by(models.Product.certification_status).all()
    
    return {
        "total_suppliers": total_suppliers,
        "total_products": total_products,
        "products_by_category": [
            {"category": cat.value, "count": count} 
            for cat, count in products_by_category
        ],
        "products_by_certification": [
            {"certification_status": status.value, "count": count} 
            for status, count in products_by_certification
        ]
    }