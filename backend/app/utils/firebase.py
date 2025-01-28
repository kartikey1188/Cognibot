from firebase_admin import auth

def verify_token(auth_header):
    if not auth_header:
        raise ValueError("Authorization header missing")
    try:
        token = auth_header.split(" ")[1]
        return auth.verify_id_token(token)
    except Exception as e:
        raise ValueError(str(e))
