from flask import Flask, request, jsonify, make_response
from flaskext.mysql import MySQL
from pymysql.cursors import DictCursor
from functools import wraps
import base64
import jwt





# APP CONFIG
app = Flask(__name__, static_url_path="")


app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'desoarmmraosed'
app.config['MYSQL_DATABASE_DB'] = 'webshop'
app.config['SECRET_KEY'] = 'dev'

cookie_crypt_password = 'piskota'

# initialization of db 
mysql_db = MySQL(cursorclass=DictCursor)    
mysql_db.init_app(app)




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
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            cursor = mysql_db.get_db().cursor()
            cursor.execute("SELECT * FROM customers WHERE id=%s", (data['id'], ))
            current_user = cursor.fetchone()
            
        except jwt.ExpiredSignatureError:
            return jsonify({"message':'Expired or it's invalid token"}), 401
        return f(current_user, *args, **kwargs)
    return decorated