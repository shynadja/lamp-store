from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..models import Admin
from ..schemas import AdminLogin, Token
from ..auth import verify_password, create_access_token
from ..database import get_db

router = APIRouter(tags=["Authentication"])

@router.post("/admin", response_model=Token)
async def login(form: AdminLogin, db: AsyncSession = Depends(get_db)):
    """Аутентификация администратора и получение JWT токена"""
    result = await db.execute(select(Admin).where(Admin.username == form.username))
    admin = result.scalar_one_or_none()
    if not admin or not verify_password(form.password, admin.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    token = create_access_token({"sub": admin.username})
    return {"access_token": token, "token_type": "bearer"}