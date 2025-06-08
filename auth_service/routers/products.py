from fastapi import APIRouter, Depends, HTTPException
import httpx
from fastapi.security import OAuth2PasswordBearer
from . import verify_token

router = APIRouter(tags=["Products"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

PRODUCT_SERVICE_URL = "http://product-service:8000/api/products"

@router.get("/products")
async def get_products(token: str = Depends(verify_token)):
    """Получить список всех продуктов"""
    async with httpx.AsyncClient() as client:
        response = await client.get(PRODUCT_SERVICE_URL)
    return response.json()

@router.post("/products")
async def create_product(product: dict, token: str = Depends(verify_token)):
    """Создать новый продукт"""
    async with httpx.AsyncClient() as client:
        response = await client.post(PRODUCT_SERVICE_URL, json=product)
    if response.status_code != 201:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()

@router.put("/products/{product_id}")
async def update_product(product_id: str, product: dict, token: str = Depends(verify_token)):
    """Обновить существующий продукт"""
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{PRODUCT_SERVICE_URL}/{product_id}", json=product)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()

@router.delete("/products/{product_id}")
async def delete_product(product_id: str, token: str = Depends(verify_token)):
    """Удалить продукт"""
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{PRODUCT_SERVICE_URL}/{product_id}")
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return {"detail": "Product deleted"}