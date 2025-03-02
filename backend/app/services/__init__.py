import os
import firebase_admin
from firebase_admin import credentials, firestore
import json

# Load Firebase credentials from environment variables
firebase_credentials = {
    "type": "service_account",
    "project_id": os.environ.get("FIREBASE_PROJECT_ID"),
    #"private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
    "private_key": os.environ.get("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
    "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
    "token_uri": "https://oauth2.googleapis.com/token"
}

# Initialize Firebase only if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate(firebase_credentials)
    firebase_admin.initialize_app(cred)

# Firestore client
client = firestore.client()