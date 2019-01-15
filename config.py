from flask import Flask, request, jsonify, make_response
from flaskext.mysql import MySQL
from pymysql.cursors import DictCursor
from functools import wraps
import jwt


# APP CONFIG
app = Flask(__name__, static_url_path="")


app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'desoarmmraosed'
app.config['MYSQL_DATABASE_DB'] = 'webshop'
# app.config['SECRET_KEY'] = urandom(24).hex() # secret key generator
app.config['SECRET_KEY'] = 'dev'

# initialization of db 
mysql_db = MySQL(cursorclass=DictCursor)    
mysql_db.init_app(app)






# DECORATOR FOR ACCESS TOKEN
def admin_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            
            token = request.headers['x-access-token']
        if not token:
            return jsonify({"message":'Token is missing'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            print(data)
            cursor = mysql_db.get_db().cursor()
            cursor.execute("SELECT * FROM admins WHERE id=%s", (id, ))
            current_user = cursor.fetchone()
            

        except:
            return jsonify({'message':'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def customer_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            
            token = request.headers['x-access-token']
        if not token:
            return jsonify({"message":'Token is missing'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            print(data)
            cursor = mysql_db.get_db().cursor()
            cursor.execute("SELECT * FROM customers WHERE id=%s", (id, ))
            current_user = cursor.fetchone()
            

        except:
            return jsonify({'message':'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated