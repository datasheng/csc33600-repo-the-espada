from flask import Blueprint, request, jsonify
import pymysql.cursors
from db import get_db_connection


report_bp = Blueprint('report_bp', __name__)


@report_bp.route('/api/reports', methods=['GET'])
def get_reports():
   try:
       connection = get_db_connection()
       cursor = connection.cursor(pymysql.cursors.DictCursor)
      
       # Fetch total join fee
       cursor.execute("SELECT SUM(join_fee) AS total_revenue FROM subscriptions")
       result = cursor.fetchone()
       total_revenue = result["total_revenue"] if result and result["total_revenue"] is not None else 0


       # Fetch all subscriptions (reports)
       cursor.execute("SELECT * FROM subscriptions")
       reports = cursor.fetchall()
      
       return jsonify({"reports": reports, "total": total_revenue}), 200
   except Exception as e:
       print(f"Error fetching reports: {e}")
       return jsonify({"error": str(e)}), 500
   finally:
       if cursor:
           cursor.close()
       if connection:
           connection.close()

