from flask import Flask, request, jsonify, make_response
from flaskext.mysql import MySQL
from pymysql.cursors import DictCursor
from flask_mail import Mail
from functools import wraps
import jwt
# Crypt cookie access token 
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
import base64

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
    

# APP CONFIG
app = Flask(__name__, static_url_path="")


app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'desoarmmraosed'
app.config['MYSQL_DATABASE_DB'] = 'webshop'
app.config['SECRET_KEY'] = 'dev'
app.config['SECURITY_PASSWORD_SALT'] = 'email_confirmation_pass'
app.config['MAIL_DEFAULT_SENDER'] = 'webshop.omaririskic@gmail.com'

app.config.update(
	DEBUG=True,
	#EMAIL SETTINGS
	MAIL_SERVER='smtp.gmail.com',
	MAIL_PORT=465,
	MAIL_USE_SSL=True,
	MAIL_USERNAME = 'webshop.omaririskic@gmail.com',
	MAIL_PASSWORD = 'webshop123'
	)



# initialization of db 
mysql_db = MySQL(cursorclass=DictCursor)    
mysql_db.init_app(app)

mail = Mail(app)


# DECORATOR FOR ACCESS TOKEN
def access_helper(current_user):
    try:
        if current_user["admin"]:
            return True
    except KeyError:
        return False

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if request.cookies.get('token'):
            token = request.cookies.get('token')
            
    
        if not token:
            return jsonify({"message":'Missing token'}), 401
        try:
            data = decrypt_jwt(jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256']))
            cursor = mysql_db.get_db().cursor()
            cursor.execute("SELECT * FROM customers WHERE id=%s", (data['id'], ))
            current_user = cursor.fetchone()
            
        except jwt.ExpiredSignatureError:
            return jsonify({"message':'Expired or it's invalid token"}), 401
        return f(current_user, *args, **kwargs)
    return decorated