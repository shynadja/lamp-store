from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    customer_phone = Column(String)
    customer_email = Column(String)
    delivery_method = Column(String)
    payment_method = Column(String)

    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer)
    product_name = Column(String)
    quantity = Column(Integer)
    price = Column(Float)
    discount = Column(Float)
    order_id = Column(Integer, ForeignKey("orders.id"))

    order = relationship("Order", back_populates="items")