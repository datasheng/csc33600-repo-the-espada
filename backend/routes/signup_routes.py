import pymysql.cursors
from flask import Blueprint, request, jsonify, session
from db import get_db_connection

signup_bp = Blueprint('signup_bp', __name__)

@signup_bp.route('/api/signup', methods=['POST'])
def signup():
    connection = None
    cursor = None

    try:
        data = request.get_json()
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        is_business = data.get('is_business', False)

        if not all([first_name, last_name, email, password]):
            return jsonify({'error': 'Missing required fields'}), 400

        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # Check for duplicate email
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'error': 'Email already exists'}), 409

        # Start transaction
        connection.begin()

        try:
            # Insert into users table first
            cursor.execute("""
                INSERT INTO users (first_name, last_name, email, user_password)
                VALUES (%s, %s, %s, %s)
            """, (first_name, last_name, email, password))
            
            user_id = cursor.lastrowid
            
            # Commit transaction
            connection.commit()

            # Set session data
            session['logged_in'] = True
            session['user_id'] = user_id
            session['email'] = email

            response_data = {
                "message": "User registered successfully",
                "user": {
                    "userID": user_id,
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email
                }
            }

            return jsonify(response_data), 201

        except Exception as e:
            connection.rollback()
            raise e

    except Exception as e:
        print("Signup error:", e)
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor: cursor.close()
        if connection: connection.close()
