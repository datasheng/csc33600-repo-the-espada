import pymysql.cursors
from flask import Blueprint, request, jsonify
from db import get_db_connection

signup_bp = Blueprint('signup', __name__, url_prefix='/auth')

@signup_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        account_type = data.get('account_type')

        if not all([username, email, password, account_type]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Get database connection
        connection = get_db_connection()
        cursor = connection.cursor()

        # Check if email already exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'error': 'Email already registered'}), 409

        # Insert new user
        cursor.execute("""
            INSERT INTO users (username, email, user_password, account_type)
            VALUES (%s, %s, %s, %s)
        """, (username, email, password, account_type))
        
        user_id = cursor.lastrowid

        if account_type == 'business':
            store_name = data.get('store_name')
            store_address = data.get('store_address')

            if not store_name or not store_address:
                connection.rollback()
                return jsonify({
                    'error': 'Business users must provide store name and store address.'
                }), 400

            # Create store entry
            cursor.execute("""
                INSERT INTO store (ownerID, store_name, address, rating)
                VALUES (%s, %s, %s, %s)
            """, (user_id, store_name, store_address, 0.0))  # Default rating 0.0

        connection.commit()
        return jsonify({
            'message': f'{account_type.capitalize()} user registered successfully',
            'user': {
                'userID': user_id,
                'username': username,
                'email': email,
                'account_type': account_type
            }
        }), 201

    except Exception as e:
        print(f"Error during signup: {e}")
        if connection:
            connection.rollback()
        return jsonify({'error': 'Failed to register user'}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()