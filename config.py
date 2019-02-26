from flask import Flask
from flaskext.mysql import MySQL
from pymysql.cursors import DictCursor
from flask_mail import Mail






    

# APP CONFIG
app = Flask(__name__, static_url_path="")

# Globals
PROFILE_IMAGES = 'images/profile_images/'
PRODUCT_IMAGES = "images/product_images/"

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'desoarmmraosed'
app.config['MYSQL_DATABASE_DB'] = 'webshop'
app.config['SECRET_KEY'] = 'dev'
app.config['SECURITY_PASSWORD_SALT'] = 'email_confirmation_pass'
app.config['MAIL_DEFAULT_SENDER'] = 'webshop.omaririskic@gmail.com'
app.config['PROFILE_IMAGES'] = PROFILE_IMAGES
app.config['PRODUCT_IMAGES'] = PRODUCT_IMAGES




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


