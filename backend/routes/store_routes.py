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

@store_bp.route('/api/stores/<int:storeID>/hours', methods=['PUT'])
def update_store_hours(storeID):
    connection = None
    cursor = None

    try:
        data = request.get_json()
        hours = data.get('hours', [])
        
        connection = get_db_connection()
        cursor = connection.cursor()

        # Start transaction
        connection.begin()

        try:
            # Delete existing hours
            cursor.execute("DELETE FROM store_hours WHERE storeID = %s", (storeID,))
            
            # Insert new hours
            for hour in hours:
                cursor.execute("""
                    INSERT INTO store_hours (storeID, daysOpen, openTime, closeTime)
                    VALUES (%s, %s, %s, %s)
                """, (
                    storeID,
                    hour['daysOpen'],
                    hour['openTime'],
                    hour['closeTime']
                ))

            connection.commit()
            return jsonify({'message': 'Store hours updated successfully'}), 200

        except Exception as e:
            connection.rollback()
            raise e

    except Exception as e:
        print("Error updating store hours:", e)
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

@store_bp.route('/api/stores/<int:storeID>', methods=['PUT'])
def update_store(storeID):
    try:
        data = request.get_json()
        field = data.get('field')
        value = data.get('value')

        if not all([field, value]):
            return jsonify({'error': 'Missing required fields'}), 400

        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # Map frontend field names to database field names
        field_mapping = {
            'name': 'store_name',
            'address': 'address',
            'latitude': 'latitude',
            'longitude': 'longitude',
            'phone': 'phone',
            'email': 'email'  # This is the key fix - ensuring email maps correctly
        }

        db_field = field_mapping.get(field)
        if not db_field:
            return jsonify({'error': f'Invalid field: {field}'}), 400

        # Update the store table with the new value
        cursor.execute(f"""
            UPDATE store 
            SET {db_field} = %s
            WHERE storeID = %s
        """, (value, storeID))
        
        connection.commit()

        # Return updated store data
        cursor.execute("SELECT * FROM store WHERE storeID = %s", (storeID,))
        updated_store = cursor.fetchone()
        
        return jsonify(updated_store), 200

    except Exception as e:
        print(f"Error updating store: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()