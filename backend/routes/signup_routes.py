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
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        account_type = data.get('account_type')  # 'customer' or 'business'

        if not all([username, email, password, account_type]):
            return jsonify({'error': 'Missing required fields'}), 400

        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)  # Use DictCursor like in auth_routes

        # Check for duplicate email
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'error': 'Email already exists'}), 409
        
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        if cursor.fetchone():
            return jsonify({'error': 'Username already exists'}), 409

        # Insert user
        cursor.execute("""
            INSERT INTO users (username, email, user_password)
            VALUES (%s, %s, %s)
        """, (username, email, password))
        user_id = cursor.lastrowid

        if account_type == 'business':
            store_name = data.get('store_name')
            store_address = data.get('store_address')

            if not store_name or not store_address:
                connection.rollback()
                return jsonify({'error': 'Missing store name or address'}), 400

            # Step 1: Insert into store_owners
            cursor.execute("INSERT INTO store_owners (userID) VALUES (%s)", (user_id,))
            owner_id = cursor.lastrowid

            # Step 2: Insert into store with dummy lat/lng for now
            cursor.execute("""
                INSERT INTO store (ownerID, store_name, address, rating, latitude, longitude)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (owner_id, store_name, store_address, 0.0, 0.0, 0.0))

        connection.commit()
        
         # Set session data like in auth_routes
        session['logged_in'] = True
        session['user_id'] = user_id
        session['email'] = email

        return jsonify({
            "message": f"{account_type.capitalize()} user registered successfully",
            "user": {
                "userID": user_id,
                "username": username,
                "email": email,
                "account_type": account_type
            }
        }), 201

    except Exception as e:
        print("Signup error:", e)
        if connection:
            connection.rollback()
        return jsonify({'error': 'Server error during signup'}), 500

    finally:
        if cursor: cursor.close()
        if connection: connection.close()
