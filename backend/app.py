from flask import Flask
from flask_cors import CORS
from config import Config
from routes.signup_routes import signup_bp

print("app.py is loading...")

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

app.register_blueprint(signup_bp, url_prefix='/api')

@app.route('/')
def home():
    return {"message": "Backend is running"}

if __name__ == '__main__':
    
    for rule in app.url_map.iter_rules():
        print(f"{rule} → {rule.endpoint}")

    

    app.run(
        host='127.0.0.1',
        port=5000,
        debug=True
    )
