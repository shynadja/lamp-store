from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import SessionLocal, engine
from typing import List

# Создание таблиц в базе данных
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Order Service", version="1.0.0")
  
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("api/v1/orders/", 
          response_model=schemas.Order, 
          status_code=status.HTTP_201_CREATED)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    """
    Создание нового заказа.
    """
    return crud.create_order(db=db, order=order)

@app.get("api/orders/", response_model=List[schemas.Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Получение списка заказов с пагинацией.
    """
    orders = crud.get_orders(db, skip=skip, limit=limit)
    return orders

@app.get("api/orders/{order_id}", response_model=schemas.Order)
def read_order(order_id: int, db: Session = Depends(get_db)):
    """
    Получение информации о конкретном заказе по ID.
    """
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Order not found"
        )
    return db_order

@app.put("api/orders/{order_id}", response_model=schemas.Order)
def update_order(
    order_id: int, 
    order_update: schemas.OrderUpdate, 
    db: Session = Depends(get_db)
):
    """
    Обновление информации о заказе.
    """
    db_order = crud.update_order(db, order_id=order_id, order_update=order_update)
    if db_order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Order not found"
        )
    return db_order

@app.delete("api/orders/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """
    Удаление заказа.
    """
    if not crud.delete_order(db, order_id=order_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Order not found"
        )
    return None