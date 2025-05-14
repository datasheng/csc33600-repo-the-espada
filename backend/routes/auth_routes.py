import pymysql.cursors
from flask import Blueprint, request, jsonify, session
from db import get_db_connection

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # First check users table
        cursor.execute("""
            SELECT users.*, store_owners.ownerID 
            FROM users 
            LEFT JOIN store_owners ON users.userID = store_owners.userID 
            WHERE users.email = %s
        """, (email,))
        user = cursor.fetchone()

        if user and user['user_password'] == password:
            # Determine if user is a business owner
            is_business = user['ownerID'] is not None

            return jsonify({
                'message': 'User logged in successfully',
                'user': {
                    'userID': user['userID'],
                    'email': user['email'],
                    'role': 'business' if is_business else 'shopper',
                    'ownerID': user['ownerID'] if is_business else None
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@auth_bp.route('/api/logout')  # Changed from '/logout' to '/api/logout'
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'})

@auth_bp.route('/api/users/<int:userId>', methods=['GET'])
def get_user(userId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT first_name, last_name, email FROM users WHERE userID = %s", (userId,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify(user), 200

    except Exception as e:
        print(f"Error fetching user: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@auth_bp.route('/api/users/<int:userId>', methods=['PUT'])
def update_user(userId):
    try:
        data = request.get_json()
        field = data.get('field')
        value = data.get('value')

        if not all([field, value]):
            return jsonify({'error': 'Missing required fields'}), 400

        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # Map frontend field names to database column names
        field_mapping = {
            'firstName': 'first_name',
            'lastName': 'last_name',
            'email': 'email',
            'password': 'user_password'
        }

        db_field = field_mapping.get(field)
        if not db_field:
            return jsonify({'error': 'Invalid field'}), 400

        # Update the specified field
        cursor.execute(f"""
            UPDATE users 
            SET {db_field} = %s
            WHERE userID = %s
        """, (value, userId))
        
        connection.commit()

        # Fetch updated user data
        cursor.execute("SELECT first_name, last_name, email FROM users WHERE userID = %s", (userId,))
        updated_user = cursor.fetchone()

        return jsonify(updated_user), 200

    except Exception as e:
        print(f"Error updating user: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()