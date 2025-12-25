from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# For now using synchronous engine for simplicity in rule execution, 
# can switch to async if needed for high throughput API.
# But description mentioned "Rule-based SQL queries" which handles fine with sync or async.
# Using sync for easier debugging first.
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
