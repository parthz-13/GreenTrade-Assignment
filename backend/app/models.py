from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class CategoryEnum(str, enum.Enum):
    ORGANIC_FOOD = "Organic Food"
    HANDMADE = "Handmade"
    SUSTAINABLE_GOODS = "Sustainable Goods"

class CertificationStatusEnum(str, enum.Enum):
    CERTIFIED = "Certified"
    PENDING = "Pending"
    NOT_CERTIFIED = "Not Certified"

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    country = Column(String, nullable=False)
    contact_person = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    products = relationship("Product", back_populates="supplier", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    name = Column(String, nullable=False, index=True)
    category = Column(SQLEnum(CategoryEnum), nullable=False)
    price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, nullable=False)
    certification_status = Column(SQLEnum(CertificationStatusEnum), nullable=False)
    certification_expiry_date = Column(DateTime, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    supplier = relationship("Supplier", back_populates="products")