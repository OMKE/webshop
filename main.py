#                                   Web shop, Flask REST API with Angular 1 as frontend - Omar Iriskic

from config import app
from api_routes import api
from routes import customer, admin, render_template


# Blueprint registration
# api.py 
app.register_blueprint(api)
# routes.py 
app.register_blueprint(customer)
app.register_blueprint(admin)






    

# App run
if __name__ == "__main__":
    app.run(host='localhost', port=5000, debug=False, threaded=True)


