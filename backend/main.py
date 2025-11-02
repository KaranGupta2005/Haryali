from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
import joblib
import pandas as pd
import os

# ---------- Optional: Earth Engine (for yield estimator) ----------
try:
    import ee
    ee_available = True
except Exception:
    ee_available = False

# ---------- FastAPI setup ----------
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Haryali ML API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change this to your frontend domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Load models ----------
BASE_DIR = os.path.dirname(__file__)
PRICE_MODEL_PATH = os.path.join(BASE_DIR, "parali_price_model.pkl")
YIELD_MODEL_PATH = os.path.join(BASE_DIR, "yield_predictor.pkl")
LOCATION_ENCODER_PATH = os.path.join(BASE_DIR, "location_encoder.pkl")

# Price model is mandatory
if not os.path.exists(PRICE_MODEL_PATH):
    raise RuntimeError(f"Missing price model at: {PRICE_MODEL_PATH}")
if not os.path.exists(LOCATION_ENCODER_PATH):
    raise RuntimeError(f"Missing location encoder at: {LOCATION_ENCODER_PATH}")

price_model = joblib.load(PRICE_MODEL_PATH)
location_encoder = joblib.load(LOCATION_ENCODER_PATH)

# Yield model is optional (GEE-dependent)
yield_model = None
if os.path.exists(YIELD_MODEL_PATH):
    try:
        yield_model = joblib.load(YIELD_MODEL_PATH)
    except Exception as e:
        print(f"[WARN] Could not load yield model: {e}")
else:
    print("[INFO] Yield predictor not found. Skipping yield endpoints until added.")

# ---------- Helper: date -> year/month/day/weekday ----------
def date_to_parts(date_str: str):
    try:
        date = pd.to_datetime(date_str, errors="coerce")
        if pd.isna(date):
            return 0, 0, 0, 0
        return date.year, date.month, date.day, date.weekday()
    except Exception:
        return 0, 0, 0, 0

# ---------- Price Prediction Endpoint ----------
class PriceInput(BaseModel):
    price_value: float
    date: str  # ISO format: "2025-11-02"
    location: str


@app.post("/predict_price")
def predict_price(data: PriceInput):
    """Predict Parali price per tonne"""
    year, month, day, weekday = date_to_parts(data.date)

    # Encode location
    if data.location in location_encoder.classes_:
        loc_enc = location_encoder.transform([data.location])[0]
    else:
        loc_enc = -1  # unseen location

    # Prepare features
    feature_cols = ["price_value", "year", "month", "day", "weekday", "location_enc"]
    features = pd.DataFrame([[data.price_value, year, month, day, weekday, loc_enc]], columns=feature_cols)

    pred = price_model.predict(features)[0]
    return {"predicted_price_per_tonne": round(float(pred), 2)}

# ---------- Yield Estimator (disabled if missing) ----------
class YieldEEInput(BaseModel):
    aoi_bbox: List[float] = Field(..., example=[74.5, 30.0, 76.0, 31.5])
    start_date: str = Field(..., example="2024-01-01")
    end_date: str = Field(..., example="2024-04-30")
    reducer: Optional[str] = Field("mean", example="mean")
    scale: Optional[int] = Field(10, example=10)

class YieldFeaturesInput(BaseModel):
    NDVI: float
    EVI: float
    SAVI: float
    NDWI: float
    GNDVI: float
    B4: float
    B8: float
    B11: float
    B12: float

# Placeholder for when GEE or yield model unavailable
@app.post("/predict_yield_ee")
def predict_yield_ee(_: YieldEEInput):
    if not ee_available or yield_model is None:
        raise HTTPException(status_code=503, detail="Yield estimation temporarily unavailable (requires GEE & yield model).")
    return {"message": "Yield estimator will be available once GEE and model are configured."}

@app.post("/predict_yield_features")
def predict_yield_features(_: YieldFeaturesInput):
    if yield_model is None:
        raise HTTPException(status_code=503, detail="Yield model not available yet.")
    return {"message": "Feature-based yield prediction will be added after GEE integration."}

# ---------- Root ----------
@app.get("/")
def root():
    return {"message": "✅ Haryali FastAPI ML server is running!"}
