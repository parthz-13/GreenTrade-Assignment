from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class CategoryEnum(str, Enum):
    ORGANIC_FOOD = "Organic Food"
    HANDMADE = "Handmade"
    SUSTAINABLE_GOODS = "Sustainable Goods"

class CertificationStatusEnum(str, Enum):
    CERTIFIED = "Certified"
    PENDING = "Pending"
    NOT_CERTIFIED = "Not Certified"

class SupplierBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    country: str = Field(..., min_length=1, max_length=100)
    contact_person: str = Field(..., min_length=1, max_length=200)
    phone: str = Field(..., min_length=1, max_length=20)

class SupplierCreate(SupplierBase):
    pass

class SupplierResponse(SupplierBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    category: CategoryEnum
    price: float = Field(..., gt=0)
    stock_quantity: int = Field(..., ge=0)
    unit: str = Field(default="pcs")
    certification_status: CertificationStatusEnum
    certification_expiry_date: Optional[datetime] = None
    description: Optional[str] = None

class ProductCreate(ProductBase):
    supplier_id: int

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[CategoryEnum] = None
    price: Optional[float] = Field(None, gt=0)
    stock_quantity: Optional[int] = Field(None, ge=0)
    certification_status: Optional[CertificationStatusEnum] = None
    certification_expiry_date: Optional[datetime] = None
    description: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    supplier_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProductWithSupplier(ProductResponse):
    supplier: SupplierResponse

class SupplierWithProducts(SupplierResponse):
    products: List[ProductResponse] = []

class CategoryCount(BaseModel):
    category: str
    count: int

class CertificationCount(BaseModel):
    certification_status: str
    count: int

class AnalyticsSummary(BaseModel):
    total_suppliers: int
    total_products: int
    products_by_category: List[CategoryCount]
    products_by_certification: List[CertificationCount]