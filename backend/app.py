from flask import Flask
from flask_cors import CORS
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Import and register blueprints
from routes.store_routes import store_bp
from routes.product_routes import product_bp
from routes.auth_routes import auth_bp

app.register_blueprint(store_bp, url_prefix=Config.API_PREFIX)
app.register_blueprint(product_bp, url_prefix=Config.API_PREFIX)
app.register_blueprint(auth_bp, url_prefix=Config.API_PREFIX)

if __name__ == '__main__':
    app.run(
        host=app.config['HOST'],
        port=app.config['PORT'],
        debug=app.config['DEBUG']
    )