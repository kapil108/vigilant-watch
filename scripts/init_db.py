import sys
import os
sys.path.append(os.getcwd())
from app.db.base import Base
from app.db.session import engine
from app.models.transaction import Transaction
from app.models.alert import Alert

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    init_db()
