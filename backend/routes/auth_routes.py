from flask import Blueprint, request, jsonify, session
from db import get_db_connection

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        connection = get_db_connection()
        if connection is None:
            return jsonify({'message': 'Database connection failed'}), 500

        # Check if user exists
        connection.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = connection.fetchone()
        print(f"User fetched from database: {user}")

        if not user:
            return jsonify({'message': 'Incorrect email and password'}), 404

        print(f"Stored password: {user['user_password']}, Provided password: {password}")

        if user['user_password'] != password:
            return jsonify({'message': 'Incorrect password'}), 401

        # Set session data
        session['logged_in'] = True
        session['user_id'] = user['userID']
        session['email'] = user['email']

        return jsonify({'message': 'User logged in successfully'}), 200

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({'error': 'Failed to login'}), 500

@auth_bp.route('/logout')
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'})

