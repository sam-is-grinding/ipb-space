from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.auth_service import AuthService
from app.repositories import user_repository
from app.schemas.user import UserCreate, UserLogin
from app.schemas.http import HTTPResponse
from app.schemas.auth import AuthResponse

router = APIRouter(prefix="/auth", tags=["auth"])

async def get_auth_service(db: AsyncSession = Depends(get_db)):
    repo = user_repository.UserRepository(db)
    return AuthService(repo)

@router.post("/register", response_model=HTTPResponse, status_code=status.HTTP_201_CREATED)
async def register(
    data: UserCreate,
    service: AuthService = Depends(get_auth_service)
) -> HTTPResponse:
    """
    Endpoint to register a new user.

    :param data: The UserCreate schema containing user information for registration
    :type data: UserCreate
    :param service: The AuthService dependency for handling user registration logic
    :type service: AuthService
    :return: The registered UserResponse object (without password)
    :rtype: UserResponse
    :raises HTTPException: If the email is already registered
    """
    response = await service.register(data)

    return HTTPResponse(
        success=True,
        message="User registered successfully",
        data={"user": response}
    )

@router.post("/login", response_model=AuthResponse)
async def login(
    data: UserLogin,
    service: AuthService = Depends(get_auth_service)
) -> AuthResponse:
    """
    Endpoint to log in a user and provide access and refresh tokens.

    :param data: The UserLogin schema containing email and password for authentication
    :type data: UserLogin
    :param service: The AuthService dependency for handling authentication logic
    :type service: AuthService
    :return: An AuthResponse object containing the success status, message, and token information
    :raises HTTPException: If authentication fails due to invalid credentials
    """
    AuthData = await service.login(data)
    
    return AuthResponse(
        success=True,
        message="Login successful",
        token=AuthData.token,
        data=AuthData.data
    )

@router.post("/refresh", response_model=HTTPResponse)
async def refresh_access_token(
    refresh_token: str,
    service: AuthService = Depends(get_auth_service)
) -> HTTPResponse:
    """
    Endpoint to refresh an access token using a valid refresh token.

    :param refresh_token: The refresh token provided by the client for refreshing the access token
    :type refresh_token: str
    :param service: The AuthService dependency for handling token refresh logic
    :type service: AuthService
    :return: A new Token object containing the refreshed access token and the same refresh token
    :raises HTTPException: If the refresh token is invalid or expired
    """
    new_token = await service.refresh_access_token(refresh_token)
    return HTTPResponse(
        success=True,
        message="Token refreshed successfully",
        data={"token": new_token}
    )