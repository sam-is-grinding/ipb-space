from sqlalchemy import Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.core.database import Base
import datetime
from app.enums.user_enums import UserRoles

class User(Base):
    """
    SQLAlchemy User model.

    Attributes:
        id (int): Primary key, auto-incremented.
        fullname (str): Full name of the user.
        idnum (str): Unique identifier (NIM/NIP) for the user.
        email (str): Unique email address of the user.
        hashed_password (str): Hashed password for authentication.
        role (str): Role of the user (obtained from UserRoles enum).
        is_active (bool): Indicates if the account is active or deactivated.
        created_at (datetime): Timestamp of when the user was created.
        updated_at (datetime): Timestamp of the last update to the user record.
        last_login (datetime): Timestamp of the last login by the user.
    """

    __tablename__ = "users"

    id : Mapped[int] = mapped_column(Integer, primary_key=True, index=True) # ID in DB
    fullname : Mapped[str] = mapped_column(String, nullable=False) 
    idnum : Mapped[str] = mapped_column(String, unique=True, index=True, nullable=True)  # NIM / NIP
    email : Mapped[str] = mapped_column(String, unique=True, index=True,nullable=False)
    hashed_password : Mapped[str] = mapped_column(String)
    role : Mapped[str] = mapped_column(String, default=UserRoles.CIVITAS.value, nullable=False)

    # Timestamps
    created_at : Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=datetime.datetime.now, nullable=False)
    updated_at : Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    last_login : Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"