from flask import Blueprint, jsonify, request, send_from_directory
from config import mysql_db, app, ALLOWED_EXTENSIONS, PROFILE_IMAGES
from auth import  token_required, isAdmin, encrypt_jwt, decrypt_jwt
from flask import Flask, request, jsonify, make_response, redirect, url_for, render_template
from werkzeug.utils import secure_filename
import datetime
from email_confirmation import generate_confirmation_token, confirm_token, send_email
from os import urandom # os module to generate random secret key
from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4
import jwt, base64, itertools, operator
import os
import stripe


customer = Blueprint("customer", __name__)
admin = Blueprint("admin", __name__)

stripe_public_key = "pk_test_ldUAyToKHxFojOBDjNwiYYAZ"
stripe_secret_key = "sk_test_5JpCSCbSDGO98Emu7NNeODu5"
stripe.api_key = stripe_secret_key

#TODO FIX ADMIN LOGIN

# Routes

@app.route('/index')
@app.route('/')
def index():    
    return app.send_static_file('index.html')


# Admin CMS
@admin.route('/admin/login', methods=['POST'])
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
    


@admin.route('/admin/register', methods=['POST'])
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
@customer.route('/login', methods=["POST"])
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
@customer.route('/logout')
@token_required
def customer_logout(current_user):
    response = make_response("Logout", 200)
    response.set_cookie('token', expires=0)
    return response



# Upload images
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@customer.route("/profile_image/<filename>")
def get_profile_image(filename):
    return send_from_directory(app.config["PROFILE_IMAGES"], filename)



# Upload profile picture
@customer.route('/edit/profile_picture', methods=['POST'])
@token_required
def upload_profile_picture(current_user):
    if 'file' not in request.files:
        return "No file part", 205
    file = request.files["file"]
    if file.filename == "":
        return "No images selected", 205
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        if os.path.exists("images/profile_images/"+ str(current_user['image'])) and current_user['image'] != "":
            os.remove("images/profile_images/"+str(current_user['image']))
        file.save(os.path.join(app.config["PROFILE_IMAGES"], file.filename))

        db = mysql_db.get_db()
        cursor = db.cursor()
        current_user['image'] = file.filename
        cursor.execute("UPDATE users SET image=%(image)s WHERE id=%(id)s", current_user)
        db.commit()
        # print("File uploaded: " + filename + " to test_images/profile_photos")
        return filename, 200
    


@customer.route("/edit/profile_picture/delete", methods=["GET"])
@token_required
def delete_profile_picture(current_user):
    if os.path.exists("images/profile_images/"+ str(current_user['image'])):
        try:
            if not str(current_user['image']) == "no_image.png":
                os.remove("images/profile_images/"+str(current_user['image']))
        except PermissionError:
            return "Error", 404
        current_user['image'] = ""
        db = mysql_db.get_db()
        cursor = db.cursor()
        cursor.execute("UPDATE users SET image=%(image)s WHERE id=%(id)s", current_user)
        db.commit()
        return "", 200
    else:
        return "", 400

# Edit customer info
@customer.route('/edit', methods=['POST'])
@token_required
def edit_user_data(current_user):
    data = request.get_json()

    
    current_user['address_1'] = data['address_1']
    current_user['address_2'] = data['address_2']
    current_user['city'] = data['city']
    current_user['country'] = data['country']
    current_user['postal_code'] = data['postal_code']
    current_user['phone_number'] = data['phone_number']
    
    db = mysql_db.get_db()
    cursor = db.cursor()

    if data['email'] != current_user['email']:
        current_user['email'] = data['email']
        current_user['confirmed'] = False
        cursor.execute("UPDATE users SET confirmed=%(confirmed)s, email=%(email)s,  address_1=%(address_1)s, address_2=%(address_2)s, city=%(city)s, country=%(country)s, postal_code=%(postal_code)s, phone_number=%(phone_number)s WHERE id=%(id)s", current_user)
        # Token for email confirmation
        token = generate_confirmation_token(data['email'])
        confirm_url = url_for("customer.confirm_email", token=token, _external=True)
        html = render_template('email_confirmation.html', confirm_url=confirm_url, name=data['first_name'])
        subject = "WebShop - Email address changed"
        send_email(data['email'], subject, html)
    else:
        cursor.execute("UPDATE users SET address_1=%(address_1)s, address_2=%(address_2)s, city=%(city)s, country=%(country)s, postal_code=%(postal_code)s, phone_number=%(phone_number)s WHERE id=%(id)s", current_user)
    db.commit()
    return jsonify({"message":"Updated"}), 200





# token required decorator checks token from access_token header, if it's correct then user is saved in current_user
@customer.route('/login/user', methods=['GET'])
@token_required
def get_user_data(current_user):
    if current_user:
        del current_user['password'] # it's not needed on frontend side
        del current_user["id"]
        return jsonify(current_user), 200
    
    else:
        return "", 205
    

        

# Register Route
#TODO check input, match password, 
@customer.route('/register', methods=['POST'])
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
    data['image'] = "no_picture.png"
    token = generate_confirmation_token(data['email'])
    confirm_url = url_for("customer.confirm_email", token=token, _external=True)
    html = render_template('email_confirmation.html', confirm_url=confirm_url, name=data['first_name'])
    subject = "WebShop - Email confirmation"
    send_email(data['email'], subject, html)

    
    cursor.execute("INSERT INTO users (email, username, password, first_name, last_name, gender, date_of_birth, registration_date, admin, image) VALUES(%(email)s, %(username)s, %(password)s, %(first_name)s, %(last_name)s, %(gender)s, %(date_of_birth)s, %(registration_date)s, %(admin)s, %(image)s)", data)
    db.commit()
    return jsonify({"message":"A confirmation email has been sent to your email address"}), 201


# Email confirmation handler
@customer.route('/confirm/<token>')
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
@customer.route('/user/changepassword', methods=['POST'])
@token_required
def change_password(current_user):
    data = dict(request.json)
    db = mysql_db.get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE id=%s", (current_user['id'], ))
    user = cursor.fetchone()
    user["password"] = generate_password_hash(data["newPass"], method='sha256')
    
    user["password_reset"] = False
    cursor.execute("UPDATE users SET password=%(password)s, password_reset=%(password_reset)s WHERE email=%(email)s", user)
    db.commit()
    return jsonify({"message":"Password successfully changed"}), 200



# Reset password Route
@customer.route('/login/resetpassword', methods=['POST'])
@token_required
def reset_password(current_user):
    data = dict(request.json)
    cursor = mysql_db.get_db().cursor()
    cursor.execute("SELECT * FROM users WHERE email=%s", (data['email'], ))
    user = cursor.fetchone()
    if user:
        token = generate_confirmation_token(user['email'])
        reset_url = url_for("customer.confirm_reset_password_token", token=token, _external=True)
        html = render_template("reset_password_email.html", reset_url=reset_url)
        subject = "WebShop - Account Recovery"
        send_email(user['email'], subject, html)
        return jsonify({"message":"An email with reset token has been sent to email address"}), 200
    if not user:
        return jsonify({"message":"No user found with email provided"}), 200



# Reset password token 
@customer.route('/login/resetpassword/<token>')
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
    
    
    

@customer.route("/cart/items")
@token_required
def get_cart_items(current_user):
    if current_user:
        cursor = mysql_db.get_db().cursor()
        cursor.execute("SELECT * FROM cart_items c LEFT JOIN products p ON c.product_id=p.id LEFT JOIN shopping_cart s ON c.shopping_cart_id=s.id WHERE s.customer_id=%s", (current_user['id'], ))
        cart_items = cursor.fetchall()
        
            
        for i in cart_items:
            i["product_id"] = i["p.id"]
            del i["customer_id"], i["shopping_cart_id"], i["s.id"], i["p.id"]
        return jsonify(cart_items)
    else:
        return "Not authenticated", 401
    

@customer.route("/cart/items/<int:id>", methods=['POST'])
@token_required
def add_item_to_cart(current_user, id):
    db = mysql_db.get_db()
    cursor = db.cursor()
    cursor.execute("SELECT customer_id, id FROM shopping_cart WHERE customer_id=%s", (current_user['id'], ))
    hasCart = cursor.fetchone()
    cursor.execute("SELECT id FROM products WHERE id=%s", (id, ))
    product = cursor.fetchone()
    try:
        quantity = int(request.data)
    except TypeError:
        return "", 205
    if hasCart:
        data = {
            "product_id": product['id'],
            "shopping_cart_id": hasCart["id"],
            "created_at": datetime.datetime.now(),
            "quantity": quantity
        }
        cursor.execute("INSERT INTO cart_items (product_id, shopping_cart_id, created_at, quantity) VALUES (%(product_id)s, %(shopping_cart_id)s, %(created_at)s, %(quantity)s)", data)
        db.commit()
        
        return jsonify({"message":"Added to cart"}), 200
    else:
        cursor.execute("INSERT INTO shopping_cart (customer_id, created_at) VALUES (%s, %s)", (current_user['id'], datetime.datetime.now()))
        db.commit()
        cursor.execute("SELECT customer_id, id FROM shopping_cart WHERE customer_id=%s", (current_user['id'], ))
        hasCart = cursor.fetchone()
        data = {
            "product_id": product['id'],
            "shopping_cart_id": hasCart["id"],
            "created_at": datetime.datetime.now(),
            "quantity": quantity
        }
        
        
        cursor.execute("INSERT INTO cart_items (product_id, shopping_cart_id, created_at, quantity) VALUES (%(product_id)s, %(shopping_cart_id)s, %(created_at)s, %(quantity)s)", data)
        db.commit()
        return jsonify({"message":"Added to cart"}), 200
        

@customer.route("/cart/items/<int:id>/delete")
@token_required
def delete_item_from_cart(current_user, id):
    db = mysql_db.get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM cart_items WHERE id=%s",(id, ))
    db.commit()
    return "", 200



@customer.route("/cart/items/<int:id>/update_quantity", methods=['PUT'])
@token_required
def update_cart_item_quantity(current_user, id):
    db = mysql_db.get_db()
    cursor = db.cursor()
    cursor.execute("UPDATE cart_items SET quantity=%s WHERE id=%s", (int(request.data), id))
    db.commit()
    return "", 200


# Payment
# Stripe
@customer.route("/stripe/public_key")
@token_required
def get_stripe_public_key(current_user):
    return stripe_public_key, 200


@customer.route("/stripe/pay", methods=["POST"])
def stripe_pay():
    customer = stripe.Customer.create(email=request.form['stripeEmail'], source=request.form['stripeToken'])
    db = mysql_db.get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email=%s", (request.form['stripeEmail']))
    customer_db = cursor.fetchone()
    if not customer_db:
        return "No user with email provided found", 205
    
    cursor.execute("SELECT * FROM cart_items c LEFT JOIN products p ON c.product_id=p.id LEFT JOIN shopping_cart s ON c.shopping_cart_id=s.id WHERE s.customer_id=%s", (customer_db['id'], ))
    cart_items = cursor.fetchall()
    

    # Get amount to be charged
    total_price = 0
    for i in cart_items:
        total_price += (i["price"] * i["quantity"])
    

    charge = stripe.Charge.create(
        customer=customer.id,
        amount=int(total_price*100),
        currency='usd',
        description=customer_db["username"] + " cart items"
    )

    cursor.execute("SELECT id FROM shopping_cart WHERE customer_id=%s", (customer_db['id']))
    shopping_cart_id = cursor.fetchone()
    cursor.execute("DELETE FROM cart_items WHERE shopping_cart_id=%s", (int(shopping_cart_id['id'])))
    cursor.execute("INSERT INTO orders (customer_id, order_status_code) VALUES (%s, %s)", (customer_db['id'], 1))
    db.commit()

    cursor.execute("SELECT * FROM orders WHERE customer_id=%s ORDER BY orders.order_date DESC", (customer_db['id']))
    order = cursor.fetchone()
    cursor.execute("INSERT INTO invoices (order_id, invoice_desc) VALUES (%s, %s)", (order['id'], str(customer_db['first_name'] + " " + customer_db['last_name'])))
    for i in cart_items:
        cursor.execute("INSERT INTO order_items (product_id, order_id, order_item_quantity, order_item_price) VALUES (%s, %s, %s, %s)", (i['product_id'], order['id'], i['quantity'], i['price']))
    
        
    # TODO - Place order
    
    
    db.commit()

    
    return redirect(url_for('index'))


# Get orders
@customer.route("/orders")
@token_required
def get_orders(current_user):
    db = mysql_db.get_db()
    cursor = db.cursor()
    cursor.execute("SELECT o.id, o.order_date, o.order_status_code, p.name, oi.order_item_quantity, oi.order_item_price FROM order_items oi LEFT JOIN orders o ON oi.order_id=o.id LEFT JOIN products p ON oi.product_id=p.id WHERE o.customer_id=%s ORDER BY o.order_date DESC", (current_user['id']))
    orders = cursor.fetchall()
    sorted_orders = sorted(orders, key=operator.itemgetter('id'))
    
    list_orders = []
    for key, group in itertools.groupby(sorted_orders, key=lambda x:x['id']):
        list_orders.append(list(group))
    
    return jsonify(list_orders)



# Error handler route
@app.errorhandler(400)
@app.errorhandler(401)
@app.errorhandler(403)
@app.errorhandler(404)
@app.errorhandler(405)
def _handle_api_error(ex):
    ex = str(ex)[:3]
    if ex == "400":
        title = "Bad request"
        message = "Sorry but your client has issued a malformed or illegal request"
        return render_template("error_handlers/error_page.html", error_code=ex, message=message, title=title), 400
    elif ex == "403":
        title = "Forbidden"
        message = "Sorry but your client does not have permission to get specified URL from server"
        return render_template("error_handlers/error_page.html", error_code=ex, message=message, title=title), 403
    elif ex == "404":
        title = "Oops! This Page Could Not Be Found"
        message = "Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable"
        return render_template("error_handlers/error_page.html", error_code=ex, message=message, title=title), 404
    elif ex == "405":
        title = "Method not allowed"
        message = "Sorry but the requested method is not allowed"
        return render_template("error_handlers/error_page.html", error_code=ex, message=message, title=title), 405


