#                                   Web shop, Flask REST API with Angular 1 as frontend - Omar Iriskic

from flask import Flask, request, jsonify, make_response, redirect, url_for, render_template
import datetime
from config import app, mysql_db, token_required, isAdmin, encrypt_jwt, decrypt_jwt
from email_confirmation import generate_confirmation_token, confirm_token, send_email
from os import urandom # os module to generate random secret key
from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4
import jwt, base64







#TODO FIX ADMIN LOGIN

# Routes

@app.route('/index')
@app.route('/')
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
        token = jwt.encode({'id':admin.get('id'), 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=12)}, app.config['SECRET_KEY'])
        return jsonify({'token':token.decode('UTF-8')})

    return make_response("Could not verify 3", 401, {"WWW-Authenticate": "Basic realm='Login required!'"})
    


@app.route('/admin/register', methods=['POST'])
def admin_register(current_user):
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    db = mysql_db.get_db()
    cursor = db.cursor()
    data['password'] = hashed_password
    cursor.execute("INSERT INTO admins (email, username, password, first_name, last_name, phone_number, gender) VALUES(%(email)s, %(username)s, %(password)s, %(first_name)s, %(last_name)s, %(phone_number)s, %(gender)s)", data)
    db.commit()
    return "Admin successfully created", 201
   

    



# GOD Admin Routes 
#TODO MAKE ACCESS CONTROL SO BASIC ADMINS CAN'T ACCESS THESE ROUTES
@app.route('/admin', methods=['GET'])
@token_required
def get_all_admins(current_user):
    if isAdmin(current_user): # returns True if user has attribute of admin(bool)==True
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
    cursor.execute("SELECT * FROM users WHERE username=%(username)s", auth)
    customer = cursor.fetchone()

    

    if not auth or not auth.username or not auth.password:
        return make_response("Could not verify", 401, {"WWW-Authenticate": "Basic realm='Login required!'"})

    if not customer:
        return jsonify({"message":"No user found"}), 401   
    
    if check_password_hash(customer.get('password'), auth.password):
        token = jwt.encode({'id':customer.get('id'), 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=12)}, app.config['SECRET_KEY'], 'HS256')
        response = make_response("Verified", 200)
        # Check if cookie with token exists
        get_cookie = request.cookies.get('token')
        
        
        if not get_cookie:
            response.set_cookie('token', encrypt_jwt(token), max_age=60*60*13), 200
        return response

    return make_response("Could not verify", 401, {"WWW-Authenticate": "Basic realm='Login required!'"})

# Customer logout
@app.route('/logout')
def customer_logout():
    response = make_response("Logout", 200)
    response.set_cookie('token', expires=0)
    return response



#TODO catch error if token is invalid or there is not user provided, return appropriate messages
# Get user data from cookie and send it to frontend
@app.route('/login/user', methods=['GET'])
@token_required
def get_user_data(current_user):
    token = None

    if request.cookies.get('token'):
        token = request.cookies.get('token')
        token = token.encode()
        token = decrypt_jwt(token)
        
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        cursor = mysql_db.get_db().cursor()
        cursor.execute("SELECT * FROM users WHERE id=%s", (data['id'], ))
        current_user = cursor.fetchone()
        if not current_user:
            return jsonify({"message":"No user found"}), 404
        else:
            del current_user['password'] 
            current_user['date_of_birth'] = current_user['date_of_birth'].isoformat()
            return jsonify(current_user), 200
    except:
        if not token:
            return jsonify({"message":"No user logged"}), 205
    
        

# Register Route
#TODO check input, match password, 
@app.route('/register', methods=['POST'])
def customer_registration():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    db = mysql_db.get_db()
    cursor = db.cursor()
    data['password'] = hashed_password
    #
    data['date_of_birth'] = datetime.datetime.strptime(data['date_of_birth'][:-5], "%Y-%m-%dT%H:%M:%S") + datetime.timedelta(hours=1)
    data['registration_date'] = datetime.datetime.now()
    data['admin'] = False
    token = generate_confirmation_token(data['email'])
    confirm_url = url_for("confirm_email", token=token, _external=True)
    html = render_template('email_confirmation.html', confirm_url=confirm_url)
    subject = "WebShop - Email confirmation"
    send_email(data['email'], subject, html)

    
    cursor.execute("INSERT INTO users (email, username, password, first_name, last_name, gender, date_of_birth, registration_date, admin) VALUES(%(email)s, %(username)s, %(password)s, %(first_name)s, %(last_name)s, %(gender)s, %(date_of_birth)s, %(registration_date)s, %(admin)s)", data)
    db.commit()
    return jsonify({"message":"A confirmation email has been sent to your email address"}), 201


# Email confirmation handler
@app.route('/confirm/<token>')
def confirm_email(token):
    try:
        email = confirm_token(token)
    except:
        return jsonify({"message":"Invalid token"})
    
    
    if email:
        db = mysql_db.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM users WHERE email=%s", (email, ))
        user = cursor.fetchone()
        if user['confirmed']:
            return render_template('email_confirmed.html', url=url_for('index'), success=False), 201
        user['confirmed'] = True
        user['confirmed_on'] = datetime.datetime.now()
        cursor.execute("UPDATE users SET confirmed=%(confirmed)s, confirmed_on=%(confirmed_on)s WHERE email=%(email)s", user)
        db.commit()
        return render_template('email_confirmed.html', url=url_for('index'), success=True), 201 
    else:
        return render_template('email_confirmed.html', url=url_for('index'), failed=True), 404

# Change user password route
@app.route('/user/changepassword', methods=['POST'])
@token_required
def change_password(current_user):
    data = dict(request.json)
    db = mysql_db.get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE id=%s", (current_user['id'], ))
    user = cursor.fetchone()
    user["password"] = generate_password_hash(data["newPass"], method='sha256')
    
    user["password_reset"] = False
    cursor.execute("UPDATE users SET password=%(password)s, password_reset=%(password_reset)s WHERE email=%(email)s", current_user)
    db.commit()
    return jsonify({"message":"Password successfully changed"}), 200



# Reset password Route
@app.route('/login/resetpassword', methods=['POST'])
def reset_password():
    data = dict(request.json)
    cursor = mysql_db.get_db().cursor()
    cursor.execute("SELECT * FROM users WHERE email=%s", (data['email'], ))
    user = cursor.fetchone()
    if user:
        token = generate_confirmation_token(user['email'])
        reset_url = url_for("confirm_reset_password_token", token=token, _external=True)
        html = render_template("reset_password_email.html", reset_url=reset_url)
        subject = "WebShop - Account Recovery"
        send_email(user['email'], subject, html)
        return jsonify({"message":"An email with reset token has been sent to email address"}), 200
    if not user:
        return jsonify({"message":"No user found with email provided"}), 200



# Reset password token 
@app.route('/login/resetpassword/<token>')
def confirm_reset_password_token(token):
    try:
        email = confirm_token(token)
    except:
        return jsonify({"message":"Expired or invalid link"}), 401

    if email:
        db = mysql_db.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM users WHERE email=%s", (email, ))
        user = cursor.fetchone()
        temp_pass = str(uuid4())[:8]
        user['password'] = generate_password_hash(temp_pass, method='sha256')
        user['password_reset'] = True
        cursor.execute("UPDATE users SET password_reset=%(password_reset)s, password=%(password)s WHERE email=%(email)s", user)
        db.commit()
        return render_template('reset_password.html', url=url_for('index'), success=True, password=temp_pass)    

    else:
        return render_template('reset_password.html',url=url_for('index'), success=False)
    
    
    

# Get products Route
@app.route('/api/products')
def get_all_products():
    cursor = mysql_db.get_db().cursor()
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    for i in products:
        i["created_at"] = i["created_at"].isoformat()
    return jsonify(products)


# Get one product Route
@app.route('/api/products/<int:id>')
def get_one_product(id):
    cursor = mysql_db.get_db().cursor()
    cursor.execute("SELECT * FROM products WHERE id=%s", (id, ))
    product = cursor.fetchone()
    product["created_at"] = product["created_at"].isoformat()
    return jsonify(product)


# Get categories Route
@app.route('/api/categories')
def get_categories():
    cursor = mysql_db.get_db().cursor()
    cursor.execute("SELECT * FROM categories")
    categories = cursor.fetchall()
    return jsonify(categories)

# Get one category Route
@app.route('/api/categories/<int:id>')
def get_one_category(id):
    cursor = mysql_db.get_db().cursor()
    cursor.execute("SELECT * FROM categories WHERE id=%s", (id, ))
    category = cursor.fetchone()
    return jsonify(category)


# Get products from main categories Route
@app.route('/api/categories/<int:id>/products')
def get_products_category(id):
    cursor = mysql_db.get_db().cursor()
    cursor.execute("SELECT * FROM products WHERE category_id=%s", (id, ))
    products = cursor.fetchall()
    return jsonify(products)




# Get subcategories from one of main categories Route
@app.route('/api/subcategories/<int:id>')
def get_sub_categories(id):
   cursor = mysql_db.get_db().cursor()
   cursor.execute("SELECT * FROM sub_categories WHERE category_id=%s", (id, ))
   sub_categories = cursor.fetchall()
   return jsonify(sub_categories)





# Get all products from one sub-category Route
@app.route('/api/subcategories/<int:id>/products')
def get_products_subcategory(id):
   cursor = mysql_db.get_db().cursor()
   cursor.execute("SELECT * FROM products WHERE sub_category_id=%s", (id, ))
   products = cursor.fetchall()
   return jsonify(products)









# App run
if __name__ == "__main__":
    app.run(host='localhost', port=5000, debug=False, threaded=True)


