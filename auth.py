from flask import Flask, request, jsonify, make_response
from functools import wraps
import jwt
# Crypt cookie access token 
import cryptography.fernet
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
import base64
from config import mysql_db, app

# Config for Fernet
jwt_key = 'developer' # jwt access token password
salt = b'salt_' 
kdf = PBKDF2HMAC(
    algorithm=hashes.SHA256(),
    length=32,
    salt=salt,
    iterations=100000,
    backend=default_backend()
)
key = base64.urlsafe_b64encode(kdf.derive(jwt_key.encode()))
f = Fernet(key)

def encrypt_jwt(token):
    encrypted_jwt = f.encrypt(token)
    return encrypted_jwt

def decrypt_jwt(encrypted_jwt):
    return f.decrypt(encrypted_jwt)


# DECORATOR FOR ACCESS TOKEN
def isAdmin(current_user):
    try:
        if current_user["admin"]:
            return True
        else:
            return False
    except KeyError:
        return False

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        try:
            if request.cookies.get('_tkws'):
                token = request.cookies.get('_tkws')
                token = token.encode()
                try:
                    token = decrypt_jwt(token)
                except cryptography.fernet.InvalidToken:
                    return "Invalid Token", 205
        except KeyError:
            return "Could not authenticate", 205

            
        if not token:
            return jsonify({"message":'Missing token'}), 205
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            cursor = mysql_db.get_db().cursor()
            cursor.execute("SELECT * FROM users WHERE id=%s", (data['id'], ))
            current_user = cursor.fetchone()
            
        except jwt.ExpiredSignatureError:
            return jsonify({"message':'Expired or it's invalid token"}), 401
        return f(current_user, *args, **kwargs)
    return decorated