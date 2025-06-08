from pydantic import BaseModel

class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: float
    image_url: str | None = None
    type: str
    power: str
    lifespan: str

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True