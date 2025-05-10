from os import environ

class Config:
    API_PREFIX = '/api'
    HOST = environ.get('FLASK_HOST', '127.0.0.1')
    PORT = int(environ.get('FLASK_PORT', 5000))
    DEBUG = environ.get('FLASK_DEBUG', True)
