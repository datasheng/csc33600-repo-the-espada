from flask import Flask
from flask_cors import CORS
from config import Config
from routes.store_routes import store_bp
from routes.auth_routes import auth_bp
from routes.report_routes import report_bp
from routes.signup_routes import signup_bp
from routes.rating_routes import rating_bp
from routes.product_routes import product_bp
from routes.subscription_routes import subscription_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'
app.config.from_object(Config)
CORS(app, supports_credentials=True)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS

# Import and register blueprints
app.register_blueprint(store_bp)
app.register_blueprint(product_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(report_bp)
app.register_blueprint(signup_bp)
app.register_blueprint(rating_bp)
app.register_blueprint(subscription_bp)

if __name__ == "__main__":
    app.run(debug=True)
