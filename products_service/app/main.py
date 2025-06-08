from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import SessionLocal, engine
from auth_service.app.schemas import User
from auth_service.app.main import oauth2_scheme, get_current_active_user
from jose import JWTError, jwt
from typing import List, Optional
import os
from contextlib import asynccontextmanager

DEMO_PRODUCTS = [
    {
        "name": "LED лампа EcoBright 10W",
        "type": "LED",
        "power": "10W",
        "lifespan": "30000 часов",
        "price": 450,
        "description": "Энергосберегающая лампа с тёплым белым светом, эквивалент 75W лампы накаливания",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 1
    },
    {
        "name": "LED лампа CoolDaylight 15W",
        "type": "LED",
        "power": "15W",
        "lifespan": "35000 часов",
        "price": 600,
        "description": "Лампа холодного белого света для рабочих помещений",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 1
    },
    {
        "name": "Лампа накаливания Classic 60W",
        "type": "лампы накаливания",
        "power": "60W",
        "lifespan": "1000 часов",
        "price": 50,
        "description": "Классическая лампа с тёплым светом",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 2
      },
      {
        "name": "Умная лампа SmartHome Pro",
        "type": "умные лампы",
        "power": "9W",
        "lifespan": "25000 часов",
        "price": 1990,
        "description": "Управление через Wi-Fi, работа с голосовыми помощниками",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 3
      },
      {
        "name": "LED лампа Vintage 5W",
        "type": "LED",
        "power": "5W",
        "lifespan": "20000 часов",
        "price": 320,
        "description": "Декоративная лампа в форме свечи для люстр",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 1
      },
      {
        "name": "Лампа накаливания Mirror 40W",
        "type": "лампы накаливания",
        "power": "40W",
        "lifespan": "2000 часов",
        "price": 80,
        "description": "Зеркальная лампа для направленного света",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 2
      },
      {
        "name": "Умная лампа White SmartZ",
        "type": "умные лампы",
        "power": "12W",
        "lifespan": "30000 часов",
        "price": 1500,
        "description": "Регулировка белого света, управление через приложение",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 3
      },
      {
        "name": "LED лампа Eco 12W",
        "type": "LED",
        "power": "12W",
        "lifespan": "40000 часов",
        "price": 550,
        "description": "Экономичная модель с высоким индексом цветопередачи",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 1
      },
      {
        "name": "Лампа накаливания Globe 25W",
        "type": "лампы накаливания",
        "power": "25W",
        "lifespan": "1500 часов",
        "price": 45,
        "description": "Шарообразная декоративная лампа",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 2
      },
      {
        "name": "Умная лампа FullColor",
        "type": "умные лампы",
        "power": "10W",
        "lifespan": "20000 часов",
        "price": 2200,
        "description": "RGB-лампа с синхронизацией с музыкой",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 3
      },
      {
        "name": "LED прожектор Street 30W",
        "type": "LED",
        "power": "30W",
        "lifespan": "50000 часов",
        "price": 1200,
        "description": "Уличный прожектор с защитой от влаги",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 1
      },
      {
        "name": "Лампа накаливания Crystal 75W",
        "type": "лампы накаливания",
        "power": "75W",
        "lifespan": "1000 часов",
        "price": 65,
        "description": "Лампа с кристальным эффектом для люстр",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 2
      },
      {
        "name": "Умная лампа Mini",
        "type": "умные лампы",
        "power": "7W",
        "lifespan": "15000 часов",
        "price": 1700,
        "description": "Компактная лампа для точечных светильников",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 3
      },
      {
        "name": "LED лампа Filament 8W",
        "type": "LED",
        "power": "8W",
        "lifespan": "25000 часов",
        "price": 700,
        "description": "Стиль ретро с нитью накала, винтажный дизайн",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 1
      },
      {
        "name": "Лампа накаливания Spot 100W",
        "type": "лампы накаливания",
        "power": "100W",
        "lifespan": "750 часов",
        "price": 90,
        "description": "Мощная лампа для локального освещения",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 2
      },
      {
        "name": "Умная лампа Office 15W",
        "type": "умные лампы",
        "power": "15W",
        "lifespan": "35000 часов",
        "price": 2500,
        "description": "Автоматическая регулировка света в течение дня",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 3
      },
      {
        "name": "LED лампа UltraSlim 6W",
        "type": "LED",
        "power": "6W",
        "lifespan": "30000 часов",
        "price": 480,
        "description": "Сверхтонкий дизайн для современных светильников",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 1
      },
      {
        "name": "LED лента Flex 10W",
        "type": "LED",
        "power": "10W",
        "lifespan": "50000 часов",
        "price": 890,
        "description": "Гибкая светодиодная лента с пультом управления",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 1
      },
      {
        "name": "Лампа накаливания Candle 15W",
        "type": "лампы накаливания",
        "power": "15W",
        "lifespan": "2000 часов",
        "price": 55,
        "description": "Миниатюрная лампа-свеча для бра",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 2
      },
      {
        "name": "Умная лампа Garden 20W",
        "type": "умные лампы",
        "power": "20W",
        "lifespan": "30000 часов",
        "price": 3200,
        "description": "Уличная умная лампа с датчиком движения",
        "image_url": "/images/product.jpg",
        "discount": 0,
        "type_id": 3
      }
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Создаем таблицы при старте
    models.Base.metadata.create_all(bind=engine)
    
    # Заполняем демо-данными, если база пуста
    db = SessionLocal()
    try:
        if not db.query(models.Product).first():
            for product_data in DEMO_PRODUCTS:
                db.add(models.Product(**product_data))
            db.commit()
    finally:
        db.close()
    yield

app = FastAPI(lifespan=lifespan)

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

async def verify_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return True

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/products", response_model=List[schemas.Product])
def read_products(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    products = crud.get_products(db, skip=skip, limit=limit)
    return products

@app.get("/api/products/{product_id}", response_model=schemas.Product)
def read_product(
    product_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return db_product

@app.post("/api/products/", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
def create_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    type_id: int = Form(...),
    power: str = Form(...),
    lifespan: str = Form(...),
    discount: float = Form(0),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    image_url = None
    if image:
        file_location = f"static/uploads/{image.filename}"
        os.makedirs(os.path.dirname(file_location), exist_ok=True)
        with open(file_location, "wb+") as file_object:
            file_object.write(image.file.read())
        image_url = f"/static/uploads/{image.filename}"
    
    product_data = {
        "name": name,
        "description": description,
        "price": price,
        "type_id": type_id,
        "power": power,
        "lifespan": lifespan,
        "discount": discount,
        "image_url": image_url
    }
    
    return crud.create_product(db=db, product=schemas.ProductCreate(**product_data))

@app.put("/api/products/{product_id}", response_model=schemas.Product)
def update_product(
    product_id: int,
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    type_id: int = Form(...),
    power: str = Form(...),
    lifespan: str = Form(...),
    discount: float = Form(0),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    image_url = db_product.image_url
    if image:
        file_location = f"static/uploads/{image.filename}"
        os.makedirs(os.path.dirname(file_location), exist_ok=True)
        with open(file_location, "wb+") as file_object:
            file_object.write(image.file.read())
        image_url = f"/static/uploads/{image.filename}"
    
    product_data = {
        "name": name,
        "description": description,
        "price": price,
        "type_id": type_id,
        "power": power,
        "lifespan": lifespan,
        "discount": discount,
        "image_url": image_url
    }
    
    return crud.update_product(db=db, product_id=product_id, product=schemas.ProductUpdate(**product_data))

@app.delete("/api/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    crud.delete_product(db, product_id=product_id)
    return None