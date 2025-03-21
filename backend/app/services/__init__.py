import os
import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": os.getenv("FIREBASE_PROJECT_ID"),
        "private_key_id": "dummy-key-id",  # Optional if not needed
        "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
        "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
        "client_id": "dummy-client-id",  # Optional if not needed
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.getenv('FIREBASE_CLIENT_EMAIL').replace('@', '%40')}"
    })
    firebase_admin.initialize_app(cred)

client = firestore.client()


# import firebase_admin
# from firebase_admin import credentials, firestore

# if not firebase_admin._apps:
#     cred = credentials.Certificate("service-account.json")
#     firebase_admin.initialize_app(cred)


# client = firestore.client()

