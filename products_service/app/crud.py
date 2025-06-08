from sqlalchemy.orm import Session
from . import models, schemas
from typing import List

def get_product(db: Session, product_id: int) -> models.Product:
    """Получить продукт по ID"""
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[models.Product]:
    """Получить список продуктов с пагинацией"""
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate) -> models.Product:
    """Создать новый продукт"""
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductUpdate) -> models.Product:
    """Обновить существующий продукт"""
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    update_data = product.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int) -> bool:
    """Удалить продукт"""
    db_product = get_product(db, product_id)
    if not db_product:
        return False
    
    db.delete(db_product)
    db.commit()
    return True

def get_all_products(db: Session) -> List[models.Product]:
    """Получить все продукты без пагинации"""
    return db.query(models.Product).all()