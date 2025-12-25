from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Fraud Detection System"
    API_V1_STR: str = "/api/v1"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "fraud_detection"
    POSTGRES_DB: str = "fraud_detection"
    DATABASE_URL: str
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost", "http://localhost:5173", "http://localhost:8080"]

    model_config = {"env_file": ".env", "extra": "ignore"}

settings = Settings()
