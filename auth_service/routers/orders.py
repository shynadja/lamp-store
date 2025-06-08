from fastapi import APIRouter, Depends, HTTPException
import httpx
from fastapi.security import OAuth2PasswordBearer
from . import verify_token

router = APIRouter(tags=["Orders"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin")

ORDER_SERVICE_URL = "http://order-service:8000/api/orders"

@router.get("/orders")
async def get_orders(token: str = Depends(verify_token)):
    """Получить список всех заказов"""
    async with httpx.AsyncClient() as client:
        response = await client.get(ORDER_SERVICE_URL)
    return response.json()

@router.put("/orders/{order_id}")
async def update_order_status(order_id: str, status: dict, token: str = Depends(verify_token)):
    """Обновить статус заказа"""
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{ORDER_SERVICE_URL}/{order_id}", json=status)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()