import asyncio
from typing import TypedDict

from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.core.security import Security
from app.enums.user_enums import UserRoles
from app.models.facility import Facility
from app.models.user import User


class SeedUser(TypedDict):
    fullname: str
    idnum: str
    email: str
    password: str
    role: str


class SeedFacility(TypedDict):
    name: str
    description: str
    location: str
    capacity: int
    image_url: str
    is_active: bool


SEED_USERS: list[SeedUser] = [
    {
        "fullname": "Admin IPB Space",
        "idnum": "19880001",
        "email": "admin@ipbspace.com",
        "password": "Admin1234",
        "role": UserRoles.ADMIN.value,
    },
    {
        "fullname": "Facility Manager",
        "idnum": "19880002",
        "email": "manager@ipbspace.com",
        "password": "Manager1234",
        "role": UserRoles.FACILITY_MANAGER.value,
    },
    {
        "fullname": "Civitas Demo",
        "idnum": "20240001",
        "email": "civitas@ipbspace.com",
        "password": "Civitas1234",
        "role": UserRoles.CIVITAS.value,
    },
]


SEED_FACILITIES: list[SeedFacility] = [
    {
        "name": "RK. U1.01",
        "description": "Ruang kelas ber-AC dengan proyektor.",
        "location": "Gedung GWW Lantai 1",
        "capacity": 40,
        "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c",
        "is_active": True,
    },
    {
        "name": "Lab Komputer A",
        "description": "Laboratorium komputer untuk praktikum.",
        "location": "Gedung CCR Lantai 2",
        "capacity": 30,
        "image_url": "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
        "is_active": True,
    },
    {
        "name": "Aula Mini Fakultas",
        "description": "Aula kecil untuk seminar dan diskusi.",
        "location": "Gedung FEM Lantai 3",
        "capacity": 120,
        "image_url": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
        "is_active": True,
    },
]


async def seed_users() -> tuple[int, int]:
    inserted = 0
    skipped = 0

    async with AsyncSessionLocal() as session:
        for payload in SEED_USERS:
            query = select(User).where(User.email == payload["email"])
            existing_user = (await session.execute(query)).scalar_one_or_none()

            if existing_user:
                skipped += 1
                continue

            user = User(
                fullname=payload["fullname"],
                idnum=payload["idnum"],
                email=payload["email"],
                hashed_password=Security.hash_password(payload["password"]),
                role=payload["role"],
            )
            session.add(user)
            inserted += 1

        await session.commit()

    return inserted, skipped


async def seed_facilities() -> tuple[int, int]:
    inserted = 0
    skipped = 0

    async with AsyncSessionLocal() as session:
        for payload in SEED_FACILITIES:
            query = select(Facility).where(
                Facility.name == payload["name"],
                Facility.location == payload["location"],
            )
            existing_facility = (await session.execute(query)).scalar_one_or_none()

            if existing_facility:
                skipped += 1
                continue

            facility = Facility(
                name=payload["name"],
                description=payload["description"],
                location=payload["location"],
                capacity=payload["capacity"],
                image_url=payload["image_url"],
                is_active=payload["is_active"],
            )
            session.add(facility)
            inserted += 1

        await session.commit()

    return inserted, skipped


async def main() -> None:
    users_inserted, users_skipped = await seed_users()
    facilities_inserted, facilities_skipped = await seed_facilities()

    print("Seeding complete:")
    print(f"- users: inserted={users_inserted}, skipped={users_skipped}")
    print(
        f"- facilities: inserted={facilities_inserted}, skipped={facilities_skipped}"
    )


if __name__ == "__main__":
    asyncio.run(main())