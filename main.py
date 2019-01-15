#                                   Web shop, Flask REST API with Angular 1 as frontend - Omar Iriskic

from flask import Flask, request, jsonify, make_response, redirect
import datetime
from config import app, mysql_db, token_required, access_helper
from os import urandom # os module to generate random secret key
from werkzeug.security import generate_password_hash, check_password_hash
import jwt


#TODO
# enkriptovati token koji se nalazi u cookie-u


# Routes

@app.route('/')
@app.route('/index')
def index():
    return app.send_static_file('index.html')


# Admin CMS
@app.route('/admin/login', methods=['POST'])
def admin_login():
    auth = request.authorization
    cursor = mysql_db.get_db().cursor()
    cursor.execute("SELECT * FROM admins WHERE username=%(username)s", auth)
    admin = cursor.fetchone()
    
    if not auth or not auth.username or not auth.password:
        return make_response("Could not verify 1", 401, {"WWW-Authenticate": "Basic realm='Login required!'"})
    
    
    if check_password_hash(admin.get('password'), auth.password):
        token = jwt.encode({'id':admin.get('id'), 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        return jsonify({'token':token.decode('UTF-8')})

    return make_response("Could not verify 3", 401, {"WWW-Authenticate": "Basic realm='Login required!'"})
    


@app.route('/admin/register', methods=['POST'])
@token_required
def create_admin(current_user):
    if access_helper(current_user):
        data = request.get_json()
        hashed_password = generate_password_hash(data['password'], method='sha256')
        db = mysql_db.get_db()
        cursor = db.cursor()
        data['password'] = hashed_password
        cursor.execute("INSERT INTO admins (email, username, password, first_name, last_name, phone_number, gender) VALUES(%(email)s, %(username)s, %(password)s, %(first_name)s, %(last_name)s, %(phone_number)s, %(gender)s)", data)
        db.commit()
        return "Admin successfully created", 201
    else:
        return jsonify({'message':'Not verified'}), 401

    



# GOD Admin Routes 
#TODO Make auth so basic admins can't access these routes
@app.route('/admin', methods=['GET'])
@token_required
def get_all_admins(current_user):
    if access_helper(current_user): # returns True if user has attribute of admin(bool)==True
        db = mysql_db.get_db().cursor()
        db.execute("SELECT * FROM admins")
        admins = db.fetchall()
        return jsonify(admins), 200
    else:
        return jsonify({'message':'Not verified'}), 401
        
            
    




# Customer Routes

# Login Route
@app.route('/login', methods=["POST"])
def customer_login():
    auth = request.authorization
    cursor = mysql_db.get_db().cursor()
    cursor.execute("SELECT * FROM customers WHERE username=%(username)s", auth)
    customer = cursor.fetchone()

    

    if not auth or not auth.username or not auth.password:
        return make_response("Could not verify", 401, {"WWW-Authenticate": "Basic realm='Login required!'"})

    if not customer:
        return jsonify({"message":"No user found"}), 401   
    
    if check_password_hash(customer.get('password'), auth.password):
        token = jwt.encode({'id':customer.get('id'), 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        response = make_response("Verified", 200)
        # Check if cookie with token exists
        get_cookie = request.cookies.get('token')
        if not get_cookie:
            response.set_cookie('token', token.decode("UTF-8").encode(), max_age=60*60*24*30), 200
        return response

    return make_response("Could not verify", 401, {"WWW-Authenticate": "Basic realm='Login required!'"})


# Register Route
@app.route('/register', methods=['POST'])
def customer_registration():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    db = mysql_db.get_db()
    cursor = db.cursor()
    data['password'] = hashed_password
    date = None
    try:
        date = datetime.datetime.strptime(data['date_of_birth'], "%Y-%m-%dT%H:%M:%S")
    except ValueError:
        pass
    data['date_of_birth'] = date
    
    
    cursor.execute("INSERT INTO customers (email, username, password, first_name, last_name, gender, date_of_birth) VALUES(%(email)s, %(username)s, %(password)s, %(first_name)s, %(last_name)s, %(gender)s, %(date_of_birth)s)", data)
    db.commit()
    return "", 201

if __name__ == "__main__":
    app.run(host='localhost', port=5000, debug=False)


