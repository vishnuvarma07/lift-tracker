import os

from fastapi import FastAPI, Depends, HTTPException
from database import SessionLocal, Base, engine
from sqlalchemy.orm import Session
from pwdlib import PasswordHash
import models
import schemas
from datetime import datetime, timedelta, timezone

import jwt
from jwt.exceptions import InvalidTokenError

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

password_hasher = PasswordHash.recommended()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

models.Base.metadata.create_all(bind=engine)

def create_token(data:dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user_id = int(user_id)
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail = "Invalid Token")
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


    

@app.post("/register")
def register_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = password_hasher.hash(user.password)
    new_user = models.User(username=user.username, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}

@app.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db:Session = Depends(get_db)
):
    existing_user = db.query(models.User).filter(models.User.username == form_data.username).first()

    if existing_user is None:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    password_check = password_hasher.verify(form_data.password, existing_user.password_hash)

    if not password_check:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    access_token = create_token(
        data={"sub": str(existing_user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.get("/splits")
def get_splits(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    splits = db.query(models.Split).filter(models.Split.user_id == current_user.id).all()
    return splits

@app.post("/splits")
def create_split(
    split: schemas.SplitCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_split = models.Split(
        name = split.name,
        user_id = current_user.id
    )

    db.add(new_split)
    db.commit()
    db.refresh(new_split)

    return new_split

@app.get("/splits/{splitId}/days")
def get_split_days(
    splitId: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    split = db.query(models.Split).filter(
        models.Split.id == splitId,
        models.Split.user_id == current_user.id
    ).first()

    if not split:
        raise HTTPException(
            status_code=404,
            detail="Split not found"
        )

    days = db.query(models.SplitDay).filter(
        models.SplitDay.split_id == splitId
    ).order_by(models.SplitDay.day_order).all()

    return days

@app.post("/splits/{splitId}/days")
def create_split_day(
    splitId: int,
    split_day: schemas.SplitDayCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    split = db.query(models.Split).filter(models.Split.id == splitId, models.Split.user_id == current_user.id).first()

    if split is None:
        raise HTTPException(status_code=404, detail="Split not found")

    existing_days = (
        db.query(models.SplitDay)
        .filter(models.SplitDay.split_id == splitId)
        .count()
    )

    new_split_day = models.SplitDay(
        name = split_day.name,
        split_id = split.id,
        day_order = existing_days + 1
    )

    db.add(new_split_day)
    db.commit()
    db.refresh(new_split_day)

    return new_split_day




    















