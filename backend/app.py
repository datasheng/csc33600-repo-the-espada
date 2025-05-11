from flask import Flask
from flask_cors import CORS
from config import Config
from routes.store_routes import store_bp
#from routes.product_routes import product_bp
from routes.auth_routes import auth_bp
from routes.report_routes import report_bp
from routes.store_hours_routes import store_hours_bp  # Add this import
from routes.signup_routes import signup_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'
app.config.from_object(Config)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# Import and register blueprints
app.register_blueprint(store_bp) #url_prefix=Config.API_PREFIX removed
#app.register_blueprint(product_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(report_bp)
app.register_blueprint(store_hours_bp)  # Register the new blueprint
app.register_blueprint(signup_bp, url_prefix='/api')
  # Register the signup blueprint

if __name__ == '__main__':
    print("\n📌 Registered Routes:")
    for rule in app.url_map.iter_rules():
     print(f"{rule} → {rule.endpoint}")

    app.run(
        debug=True
    )