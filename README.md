# Endurance

Endurance is a full-stack workout tracking application that allows users to create workout splits, organize training days, add exercises, and track their workouts.

## Features

- User registration and login
- JWT-based authentication
- Create and manage workout splits
- Add training days to workout splits
- Add exercises to individual training days
- Configure target sets for exercises
- Track workout information

## Tech Stack

### Frontend
- React
- Vite
- React Router
- JavaScript
- HTML/CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- JWT authentication

### Database
- PostgreSQL

### Deployment
- Vercel — Frontend
- Microsoft Azure — Backend

## Project Structure

    endurance/
    ├── backend/
    │   ├── main.py
    │   ├── models.py
    │   ├── schemas.py
    │   └── database.py
    │
    ├── frontend/
    │   └── src/
    │       ├── pages/
    │       └── components/
    │
    └── README.md

## Running Locally

### Backend

Navigate to the backend directory:

    cd backend

Activate the virtual environment:

    source venv/bin/activate

Start the FastAPI server:

    uvicorn main:app --reload

The backend will run on:

    http://localhost:8000

### Frontend

Navigate to the frontend directory:

    cd frontend

Install dependencies:

    npm install

Start the development server:

    npm run dev

The frontend will typically run on:

    http://localhost:5173

## Environment Variables

The frontend uses the following environment variable:

    VITE_API_URL=http://localhost:8000

## Future Improvements

- Workout history
- Record weight and repetitions for each set
- Exercise progression tracking
- Workout statistics and analytics
- Improved responsive/mobile UI
- Additional account management features

## Author

Vishnu Varma