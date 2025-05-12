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
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user and user['user_password'] == password:
            # Return user data in response
            return jsonify({
                'message': 'User logged in successfully',
                'user': {
                    'userID': user['userID'],
                    'email': user['email']
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