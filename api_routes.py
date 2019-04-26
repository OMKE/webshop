from flask import Blueprint, jsonify, request, session, send_from_directory
from config import mysql_db, app, ALLOWED_EXTENSIONS, PRODUCT_IMAGES, POPULAR_CATEGORIES
import base64, os
from PIL import Image


api = Blueprint('api_routes', __name__)




@api.route("/api/categories/popular/images/<filename>")
def get_popular_categories_images(filename):
   return send_from_directory(app.config["POPULAR_CATEGORIES"], filename)


@api.route("/api/categories/popular")
def get_popular_categories():
   cursor = mysql_db.get_db().cursor()
   cursor.execute("SELECT * FROM popular_categories")
   popular_cats = cursor.fetchall()
   return jsonify(popular_cats)

@api.route("/api/categories/popular/<int:id>")
def get_one_popular_category(id):
   cursor = mysql_db.get_db().cursor()
   cursor.execute("SELECT * FROM popular_categories WHERE id=%s", (id, ))
   cat = cursor.fetchone()
   return jsonify(cat)

# This func makes thumbnail pictures out of originals so it makes page loading faster
@api.route("/product_image/thumbs/<filename>")
def get_thumb_product_images(filename):
   size = 150, 150
   img = Image.open(app.config['PRODUCT_IMAGES']+filename)
   img.thumbnail(size, Image.ANTIALIAS)
   img.save("images/product_images/thumbs/"+filename)
   
   return send_from_directory(app.config["PRODUCT_IMAGES"]+"thumbs/", filename)


# Get full size image
@api.route("/product_image/<filename>")
def get_full_product_images(filename):
   
   return send_from_directory(app.config["PRODUCT_IMAGES"], filename)

# Get products Route
@api.route('/api/products')
def get_all_products():
    cursor = mysql_db.get_db().cursor()
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    for i in products:
        i["created_at"] = i["created_at"].isoformat()
    return jsonify(products)


# Get one product Route
@api.route('/api/products/<int:id>')
def get_one_product(id):
    cursor = mysql_db.get_db().cursor()
    cursor.execute("SELECT * FROM products WHERE id=%s", (id, ))
    product = cursor.fetchone()
    product["created_at"] = product["created_at"].isoformat()
    return jsonify(product)

# Get similar products, from same sub_category
@api.route("/api/products/<int:id>/similar")
def get_similar_products(id):
   cursor = mysql_db.get_db().cursor()
   cursor.execute("SELECT * FROM products WHERE sub_category_id=%s", (id, ))
   products = cursor.fetchmany(4)
   return jsonify(products)


# Daily deals Route
@api.route("/api/daily_deals")
def get_daily_deals_products():
   cursor = mysql_db.get_db().cursor()
   cursor.execute("SELECT p.id, p.category_id, p.sub_category_id, p.name, p.price, p.color, p.size, p.desc, p.image, p.created_at FROM daily_deals d LEFT JOIN products p ON p.id = d.product_id")
   daily_deals = cursor.fetchall()
   return jsonify(daily_deals)
   


# Get categories Route
@api.route('/api/categories')
def get_categories():
    cursor = mysql_db.get_db().cursor()
    cursor.execute("SELECT * FROM categories")
    categories = cursor.fetchall()
    return jsonify(categories)

# Get one category Route
@api.route('/api/categories/<int:id>')
def get_one_category(id):
    cursor = mysql_db.get_db().cursor()
    cursor.execute("SELECT * FROM categories WHERE id=%s", (id, ))
    category = cursor.fetchone()
    return jsonify(category)


# TODO Optimize - PriceCtrl
# Sort products by price


# Get products from main categories Route
@api.route('/api/categories/<int:id>/products')
def get_products_category(id):
   cursor = mysql_db.get_db().cursor()
   cursor.execute("SELECT * FROM products WHERE category_id=%s", (id, ))
   products = cursor.fetchall()
   return jsonify(products)






# Get subcategories from one of main categories Route
@api.route('/api/subcategories/<int:id>')
def get_sub_categories(id):
   cursor = mysql_db.get_db().cursor()
   cursor.execute("SELECT * FROM sub_categories WHERE category_id=%s", (id, ))
   sub_categories = cursor.fetchall()
   return jsonify(sub_categories)


# Get all subcategories
@api.route("/api/subcategories")
def get_all_subcategories():
    cursor = mysql_db.get_db().cursor()
    cursor.execute("SELECT * FROM sub_categories")
    sub_cats = cursor.fetchall()
    return jsonify(sub_cats), 200






# Get all products from one sub-category Route
@api.route('/api/subcategories/<int:id>/products')
def get_products_subcategory(id):
   cursor = mysql_db.get_db().cursor()
   cursor.execute("SELECT * FROM products WHERE sub_category_id=%s", (id, ))
   products = cursor.fetchall()
   return jsonify(products)


# Search route
@api.route('/api/search/<string:params>')
def search(params):
   cursor = mysql_db.get_db().cursor()
   query = "SELECT * FROM products WHERE name LIKE '%" + params + "%'"
   cursor.execute(query)
   search_result = cursor.fetchall()
   # count = len(search_result)
   # if len(params) <= 3: # If search params is les than 3 characters, return quarter of search results number
      
   #    return jsonify(search_result[:round(count/4)])
   if not search_result:
      return "", 205
   return jsonify(search_result)