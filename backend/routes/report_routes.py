from flask import Blueprint, request, jsonify
from db import get_db_connection

report_bp = Blueprint('report_bp', __name__)