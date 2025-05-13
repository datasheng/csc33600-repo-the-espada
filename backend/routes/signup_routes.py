import pymysql.cursors
from flask import Blueprint, request, jsonify, session
from db import get_db_connection

signup_bp = Blueprint('signup_bp', __name__)

@signup_bp.route('/signup', methods=['POST'])
def signup():
    connection = None
    cursor = None
    try:
        data = request.get_json()
        print("Received signup data:", data)  # Debug log
        
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        account_type = data.get('account_type')

        if not all([username, email, password, account_type]):
            missing_fields = []
            if not username: missing_fields.append('username')
            if not email: missing_fields.append('email')
            if not password: missing_fields.append('password')
            if not account_type: missing_fields.append('account_type')
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

        # Get database connection
        try:
            connection = get_db_connection()
            cursor = connection.cursor(pymysql.cursors.DictCursor)
        except Exception as e:
            print(f"Database connection error: {e}")
            return jsonify({'error': 'Database connection failed'}), 500

        # Check if email already exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'error': 'Email already registered'}), 409

        # Insert new user
        try:
            cursor.execute("""
                INSERT INTO users (username, email, user_password, account_type)
                VALUES (%s, %s, %s, %s)
            """, (username, email, password, account_type))
            
            user_id = cursor.lastrowid
            print(f"User created with ID: {user_id}")  # Debug log

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
                """, (user_id, store_name, store_address, 0.0))
                print(f"Store created for user {user_id}")  # Debug log

            connection.commit()
            print("Transaction committed successfully")  # Debug log

            # Set session data
            session['logged_in'] = True
            session['user_id'] = user_id
            session['email'] = email

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
            print(f"Database operation error: {e}")
            if connection:
                connection.rollback()
            return jsonify({'error': f'Database operation failed: {str(e)}'}), 500

    except Exception as e:
        print(f"Unexpected error during signup: {e}")
        if connection:
            connection.rollback()
        return jsonify({'error': f'Failed to register user: {str(e)}'}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()