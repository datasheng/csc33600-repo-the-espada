from flask import Blueprint, jsonify, request
from controllers.store_hours_controller import StoreHoursController

store_hours_bp = Blueprint('store_hours_bp', __name__)
store_hours_controller = StoreHoursController()

@store_hours_bp.route('/api/store-hours/<int:storeID>', methods=['GET'])
def get_store_hours(storeID):
    try:
        hours = store_hours_controller.get_store_hours(storeID)
        return jsonify(hours)
    except Exception as e:
        print(f"Error getting store hours: {e}")
        return jsonify({"error": str(e)}), 500
    
@store_hours_bp.route('/api/store-hours/<int:storeID>', methods=['PUT'])
def update_store_hours(storeID):
    try:
        data = request.get_json()
        store_hours_controller.update_store_hours(storeID, data)
        return jsonify({"message": "Store hours updated"}), 200
    except Exception as e:
        print(f"Error updating store hours: {e}")
        return jsonify({"error": str(e)}), 500
