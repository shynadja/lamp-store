from typing import List
from pydantic import BaseModel

class OrderItemBase(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    price: float
    discount: float = 0

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        orm_mode = True

class OrderBase(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: str
    delivery_method: str
    payment_method: str

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: int
    items: List[OrderItem]

    class Config:
        orm_mode = True