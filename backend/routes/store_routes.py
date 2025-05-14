from flask import Blueprint, request, jsonify
from controllers.store_controller import StoreController
from db import get_db_connection
import pymysql.cursors

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

@store_bp.route('/api/stores', methods=['POST'])
def create_store():
    connection = None
    cursor = None

    try:
        data = request.get_json()
        
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # Start transaction
        connection.begin()

        try:
            # Create store
            cursor.execute("""
                INSERT INTO store (ownerID, store_name, rating, address, latitude, longitude, phone, email)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                data['ownerID'],
                data['store_name'],
                0.00,  # default rating
                data['address'],
                data['latitude'],
                data['longitude'],
                data['phone'],
                data['email']
            ))
            
            store_id = cursor.lastrowid

            # Insert store hours
            for hour in data['hours']:
                cursor.execute("""
                    INSERT INTO store_hours (storeID, daysOpen, openTime, closeTime)
                    VALUES (%s, %s, %s, %s)
                """, (
                    store_id,
                    hour['daysOpen'],
                    hour['openTime'],
                    hour['closeTime']
                ))

            connection.commit()

            return jsonify({
                'message': 'Store created successfully',
                'storeID': store_id
            }), 201

        except Exception as e:
            connection.rollback()
            raise e

    except Exception as e:
        print("Store creation error:", e)
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor: cursor.close()
        if connection: connection.close()