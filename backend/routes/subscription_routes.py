from flask import Blueprint, request, jsonify
from db import get_db_connection
from datetime import datetime, timedelta
import pymysql.cursors

subscription_bp = Blueprint('subscription_bp', __name__)

@subscription_bp.route('/api/subscriptions', methods=['POST'])
def create_subscription():
    connection = None
    cursor = None

    try:
        data = request.get_json()
        user_id = data.get('userID')
        subscription_type = data.get('subscriptionType')
        join_fee = data.get('joinFee')

        if not all([user_id, subscription_type, join_fee]):
            return jsonify({'error': 'Missing required fields'}), 400

        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # Start transaction
        connection.begin()

        try:
            # Create store owner entry first
            cursor.execute("""
                INSERT INTO store_owners (userID)
                VALUES (%s)
            """, (user_id,))
            owner_id = cursor.lastrowid

            # Calculate subscription dates
            start_date = datetime.now()
            if subscription_type == "1 MONTH":
                end_date = start_date + timedelta(days=30)
            elif subscription_type == "3 MONTHS":
                end_date = start_date + timedelta(days=90)
            elif subscription_type == "12 MONTHS":
                end_date = start_date + timedelta(days=365)

            # Create subscription with ownerID
            cursor.execute("""
                INSERT INTO subscriptions (ownerID, start_date, end_date, join_fee)
                VALUES (%s, %s, %s, %s)
            """, (owner_id, start_date, end_date, join_fee))
            
            subscription_id = cursor.lastrowid
            
            # Commit transaction
            connection.commit()

            # Return success response with ownerID
            return jsonify({
                'message': 'Subscription created successfully',
                'data': {
                    'ownerID': owner_id,
                    'subscription': {
                        'subscriptionID': subscription_id,
                        'type': subscription_type,
                        'start_date': start_date.isoformat(),
                        'end_date': end_date.isoformat(),
                        'join_fee': float(join_fee)
                    }
                }
            }), 201

        except Exception as e:
            connection.rollback()
            print("Database error:", str(e))  # Add more detailed error logging
            raise e

    except Exception as e:
        print("Subscription creation error:", str(e))  # Add more detailed error logging
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

@subscription_bp.route('/api/subscriptions/<int:ownerID>', methods=['GET'])
def get_subscription(ownerID):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        cursor.execute("""
            SELECT * FROM subscriptions 
            WHERE ownerID = %s 
            ORDER BY start_date DESC 
            LIMIT 1
        """, (ownerID,))
        
        subscription = cursor.fetchone()
        
        if not subscription:
            return jsonify({'error': 'No subscription found'}), 404

        return jsonify(subscription), 200

    except Exception as e:
        print(f"Error fetching subscription: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()