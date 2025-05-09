from os import environ

class Config:
    API_PREFIX = '/api'
    
    # API Endpoints
    ENDPOINTS = {
        'stores': f'{API_PREFIX}/stores',
        'products': f'{API_PREFIX}/products',
        'auth': {
            'login': f'{API_PREFIX}/auth/login',
            'signup': f'{API_PREFIX}/auth/signup',
            'logout': f'{API_PREFIX}/auth/logout'
        }
    }
    
    # Server Configuration
    HOST = environ.get('FLASK_HOST', 'localhost')
    PORT = int(environ.get('FLASK_PORT', 5000))
    DEBUG = environ.get('FLASK_DEBUG', True)
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = environ.get('DATABASE_URL', 'mysql://root:@localhost/espada_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False