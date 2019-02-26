from flask import Blueprint, jsonify, request, session, send_from_directory
from config import mysql_db, app, ALLOWED_EXTENSIONS, PRODUCT_IMAGES
import base64
import os

api = Blueprint('api_routes', __name__)


@api.route("/product_image/<filename>")
def get_product_images(filename):
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