from flask import Blueprint, request, jsonify
from db import get_db_connection

product_bp = Blueprint('auth_routes', __name__)