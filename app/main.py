from fastapi import FastAPI
from app.api.v1.endpoints import transactions, alerts, analytics
from app.core.config import settings

from app.core.config import settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Fraud Detection System API"}

app.include_router(transactions.router, prefix="/api/v1/transactions", tags=["transactions"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["alerts"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
