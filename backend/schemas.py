from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class ExerciseCreate(BaseModel):
    name: str
    target_sets: int


class SplitCreate(BaseModel):
    name: str


class SplitDayCreate(BaseModel):
    name: str


class WorkoutCreate(BaseModel):
    split_day_id: int


class SetCreate(BaseModel):
    exercise_id: int
    workout_id: int
    set_number: int
    weight: float
    reps: int