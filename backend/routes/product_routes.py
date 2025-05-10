from flask import Blueprint, request, jsonify
from db import get_db_connection

product_bp = Blueprint('product_bp', __name__)