"""
ASGI adapter for Gunicorn to run FastAPI
"""
from main import app

# This allows gunicorn to run the FastAPI app
application = app
