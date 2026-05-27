from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional, Any
from sqlalchemy.sql import func
import datetime

from app.models.user import User
from app.schemas.user import UserCreate

FAILED_LOGIN_THRESHOLD: int = 5
LOCK_DURATION_MINUTES: int = 15


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_users(self, skip: int = 0, limit: int = 100) -> list[User]:
        result = await self.db.execute(select(User).where(User.deleted_at.is_(None)).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def get_by_id(self, user_id: int) -> Optional[User]:
        stmt = select(User).where(User.deleted_at.is_(None), User.id == user_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()
    
    async def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(User.deleted_at.is_(None), User.email == email)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def create(self, user_create: UserCreate, hashed_password: str) -> User:
        new_user = User(
            email=user_create.email,
            fullname=user_create.fullname,
            idnum=user_create.idnum,
            hashed_password=hashed_password,
            role=user_create.role if user_create.role else None,
            created_at=datetime.datetime.now()
        )
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)
        return new_user
    
    async def update_last_login(self, user_id: int) -> None:
        user = await self.get_by_id(user_id)
        if user:
            user.last_login = func.now()
            await self.db.commit()

    async def refresh(self, user_id: int) -> Optional[User]:
        user = await self.get_by_id(user_id)
        if user:
            await self.db.refresh(user)
            return user
        return None

    async def update(self, user_id: int, **kwargs: Any) -> Optional[User]:
        user = await self.get_by_id(user_id)
        if not user:
            return None
        for key, value in kwargs.items():
            setattr(user, key, value)
        user.updated_at = datetime.datetime.now()
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def delete(self, user_id: int) -> bool:
        user = await self.get_by_id(user_id)
        if not user:
            return False
        user.deleted_at = datetime.datetime.now(datetime.UTC)
        await self.db.commit()
        return True


    # Account-locking helpers
    
    async def increment_failed_login(self, user_id: int) -> int:
        user = await self.get_by_id(user_id)
        if not user:
            return 0
        user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
        user.last_failed_login_at = datetime.datetime.now(datetime.timezone.utc)
        await self.db.commit()
        return user.failed_login_attempts

    async def reset_failed_login(self, user_id: int) -> None:
        user = await self.get_by_id(user_id)
        if user:
            user.failed_login_attempts = 0
            user.locked_until = None
            user.last_failed_login_at = None
            await self.db.commit()

    async def lock_user(self, user_id: int, until: datetime.datetime) -> None:
        user = await self.get_by_id(user_id)
        if user:
            user.locked_until = until
            await self.db.commit()
