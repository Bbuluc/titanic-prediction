from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import joblib
import pandas as pd
import numpy as np
import uvicorn

# ============================================================================
# FASTAPI APP SETUP
# ============================================================================

app = FastAPI(
    title="Titanic Survival Prediction API",
    description="Machine Learning API for predicting Titanic passenger survival",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://titanic-prediction-seven.vercel.app/"],  # In production, replace with your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# LOAD MODEL
# ============================================================================

MODEL_PATH = "best_rf_model_20251019_203347.joblib"  # Update this to your new model filename!

try:
    model = joblib.load(MODEL_PATH)
    print(f"✓ Model loaded successfully from {MODEL_PATH}")
except FileNotFoundError:
    print(f"⚠ Model file not found: {MODEL_PATH}")
    model = None

# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class PassengerInput(BaseModel):
    """Input data from React frontend - matching your form fields"""
    pclass: str = Field(..., description="Ticket class (1, 2, or 3)")
    name: Optional[str] = Field(default="Unknown", description="Passenger name")
    gender: str = Field(..., description="Gender (male or female)")
    age: float = Field(..., description="Age in years")
    sibsp: int = Field(default=0, description="Number of siblings/spouses")
    parch: int = Field(default=0, description="Number of parents/children")
    fare: Optional[float] = Field(default=7.25, description="Passenger fare")
    cabin: Optional[str] = Field(default=None, description="Cabin number")
    embarked: str = Field(..., description="Port (C, Q, or S)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "pclass": "3",
                "name": "John Doe",
                "gender": "male",
                "age": 22.0,
                "sibsp": 1,
                "parch": 0,
                "fare": 7.25,
                "cabin": None,
                "embarked": "S"
            }
        }

class BatchPassengerInput(BaseModel):
    """For batch predictions"""
    passengers: List[PassengerInput]

class PredictionResponse(BaseModel):
    """Response with prediction results"""
    survived: int
    survival_probability: float
    death_probability: float
    passenger_info: dict

class BatchPredictionResponse(BaseModel):
    """Response for batch predictions"""
    predictions: List[PredictionResponse]
    total_passengers: int

# ============================================================================
# PREPROCESSING FUNCTION
# ============================================================================

def preprocess_passenger(passenger_data: dict) -> pd.DataFrame:
    """
    Preprocess passenger data to match training format
    Converts frontend field names to model field names
    """
    # Convert frontend field names to model field names
    converted_data = {
        'Pclass': int(passenger_data.get('pclass', 3)),
        'Name': passenger_data.get('name', 'Unknown'),
        'Sex': passenger_data.get('gender', 'male'),
        'Age': float(passenger_data.get('age', 30)),
        'SibSp': int(passenger_data.get('sibsp', 0)),
        'Parch': int(passenger_data.get('parch', 0)),
        'Fare': float(passenger_data.get('fare', 7.25)),
        'Cabin': passenger_data.get('cabin'),
        'Embarked': passenger_data.get('embarked', 'S').upper(),
        'Ticket': 'Unknown'
    }
    
    # Create DataFrame
    df = pd.DataFrame([converted_data])
    
    # Extract Title from Name
    df['Title'] = df['Name'].str.extract(r' ([A-Za-z]+)\.', expand=False)
    if df['Title'].isna().any():
        df['Title'] = df['Sex'].map({'male': 'Mr', 'female': 'Miss'})
    
    df['Title'] = df['Title'].replace(['Lady', 'Countess', 'Capt', 'Col', 'Don', 
                                        'Dr', 'Major', 'Rev', 'Sir', 'Jonkheer', 'Dona'], 'Rare')
    df['Title'] = df['Title'].replace('Mlle', 'Miss')
    df['Title'] = df['Title'].replace('Ms', 'Miss')
    df['Title'] = df['Title'].replace('Mme', 'Mrs')
    
    # Family size features
    df['FamilySize'] = df['SibSp'] + df['Parch'] + 1
    df['IsAlone'] = (df['FamilySize'] == 1).astype(int)
    
    # Age bands
    try:
        df['AgeBand'] = pd.cut(df['Age'], bins=[0, 12, 18, 35, 60, 100], labels=[0, 1, 2, 3, 4])
    except ValueError:
        # If age is outside range, assign to closest band
        df['AgeBand'] = 2  # Default to middle age band
    
    # Fare bands
    try:
        df['FareBand'] = pd.qcut(df['Fare'], 4, labels=[0, 1, 2, 3], duplicates='drop')
    except ValueError:
        # If qcut fails, use cut instead or assign default
        df['FareBand'] = pd.cut(df['Fare'], bins=[0, 7.91, 14.454, 31, 513], labels=[0, 1, 2, 3])
    
    # Cabin deck
    df['Deck'] = df['Cabin'].str[0] if df['Cabin'].notna().any() else 'Unknown'
    df['Deck'] = df['Deck'].fillna('Unknown')
    
    # Fill missing Embarked
    if df['Embarked'].isna().any():
        df['Embarked'] = 'S'
    
    # Encode categorical variables
    sex_map = {'male': 1, 'female': 0}
    df['Sex'] = df['Sex'].map(sex_map)
    
    embarked_map = {'S': 0, 'C': 1, 'Q': 2}
    df['Embarked'] = df['Embarked'].map(embarked_map).fillna(0)
    
    # Title encoding
    title_map = {'Mr': 0, 'Miss': 1, 'Mrs': 2, 'Master': 3, 'Rare': 4}
    df['Title'] = df['Title'].map(title_map).fillna(4)
    
    # Deck encoding
    deck_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'T': 7, 'Unknown': 8}
    df['Deck'] = df['Deck'].map(deck_map).fillna(8)
    
    # Select features in correct order
    features = ['Pclass', 'Sex', 'Age', 'SibSp', 'Parch', 'Fare', 
                'Embarked', 'FamilySize', 'IsAlone', 'Title', 
                'AgeBand', 'FareBand', 'Deck']
    
    return df[features]

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "Titanic Survival Prediction API",
        "model_loaded": model is not None
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_status": "loaded" if model is not None else "not loaded",
        "endpoints": ["/", "/health", "/predict", "/predict/batch"]
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_survival(passenger: PassengerInput):
    """
    Predict survival for a single passenger
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Convert to dict and preprocess
        passenger_dict = passenger.dict()
        X = preprocess_passenger(passenger_dict)
        
        # Make prediction
        prediction = model.predict(X)[0]
        probabilities = model.predict_proba(X)[0]
        
        return PredictionResponse(
            survived=int(prediction),
            survival_probability=float(probabilities[1]),
            death_probability=float(probabilities[0]),
            passenger_info={
                "name": passenger.name,
                "class": passenger.pclass,
                "gender": passenger.gender,
                "age": passenger.age
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

@app.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(batch: BatchPassengerInput):
    """
    Predict survival for multiple passengers
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        predictions = []
        
        for passenger in batch.passengers:
            passenger_dict = passenger.dict()
            X = preprocess_passenger(passenger_dict)
            
            prediction = model.predict(X)[0]
            probabilities = model.predict_proba(X)[0]
            
            predictions.append(PredictionResponse(
                survived=int(prediction),
                survival_probability=float(probabilities[1]),
                death_probability=float(probabilities[0]),
                passenger_info={
                    "name": passenger.name,
                    "class": passenger.pclass,
                    "gender": passenger.gender,
                    "age": passenger.age
                }
            ))
        
        return BatchPredictionResponse(
            predictions=predictions,
            total_passengers=len(predictions)
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Batch prediction error: {str(e)}")

@app.get("/model/info")
async def model_info():
    """Get information about the loaded model"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    return {
        "model_type": "RandomForestClassifier",
        "n_estimators": model.n_estimators,
        "max_depth": model.max_depth,
        "features": ['Pclass', 'Sex', 'Age', 'SibSp', 'Parch', 'Fare', 
                     'Embarked', 'FamilySize', 'IsAlone', 'Title', 
                     'AgeBand', 'FareBand', 'Deck']
    }

# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == "__main__":
    print("\n" + "="*80)
    print("🚀 Starting Titanic Prediction API Server...")
    print("="*80)
    print("📍 API URL: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    print("🔧 ReDoc: http://localhost:8000/redoc")
    print("="*80 + "\n")
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )