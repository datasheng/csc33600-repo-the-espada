from flask import Blueprint, jsonify
from controllers.store_controller import StoreController

store_bp = Blueprint('store_bp', __name__)
store_controller = StoreController()

@store_bp.route('/api/stores', methods=['GET'])
def get_stores():
    try:
        stores = store_controller.get_all_stores()
        return jsonify(stores)
    except Exception as e:
        print(f"Error getting stores: {e}")
        return jsonify({"error": str(e)}), 500

@store_bp.route('/api/stores/<int:storeID>', methods=['GET'])
def get_store(storeID):
    try:
        store = store_controller.get_store_by_id(storeID)
        if store is None:
            return jsonify({"error": "Store not found"}), 404
        return jsonify(store)
    except Exception as e:
        print(f"Error getting store: {e}")
        return jsonify({"error": str(e)}), 500

@store_bp.route('/api/stores/<int:storeID>/hours', methods=['GET'])
def get_store_hours(storeID):
    try:
        hours = store_controller.get_store_hours(storeID)
        if not hours:
            return jsonify([]), 200  # Return empty array if no hours found
        return jsonify(hours)
    except Exception as e:
        print(f"Error getting store hours: {e}")
        return jsonify({"error": str(e)}), 500