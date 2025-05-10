from flask import Flask
from flask_cors import CORS
from config import Config
from routes.store_routes import store_bp
from routes.product_routes import product_bp
from routes.auth_routes import auth_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'
app.config.from_object(Config)
CORS(app)

# Import and register blueprints
app.register_blueprint(store_bp) #url_prefix=Config.API_PREFIX removed
app.register_blueprint(product_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(auth_bp)

if __name__ == '__main__':
    app.run(
        debug=True
    )