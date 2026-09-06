from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class ExerciseCreate(BaseModel):
    name:str

class SplitCreate(BaseModel):
    name:str

class SplitDayCreate(BaseModel):
    name:str
    day_order:int

class SplitDayExercisesCreate(BaseModel):
    exercise_id:int
    exercise_order:int
    sets:int

class WorkoutCreate(BaseModel):
    split_day_id:int

class SetCreate(BaseModel):
    exercise_id:int
    workout_id:int
    set_number:int
    weight:float
    reps:int

