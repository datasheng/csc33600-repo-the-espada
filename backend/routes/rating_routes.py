from flask import Blueprint, request, jsonify
from controllers.store_controller import StoreController
from db import get_db_connection
import pymysql
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

rating_bp = Blueprint('rating_bp', __name__)
store_controller = StoreController()

@rating_bp.route('/api/ratings/<int:storeID>', methods=['POST'])
def submit_rating(storeID):
    connection = None
    cursor = None
    try:
        data = request.get_json()
        userID = data.get('userID')
        productID = data.get('productID')
        rating = data.get('rating')

        logger.info(f"Received rating submission for store {storeID}: {rating} (type: {type(rating)})")

        if not all([userID, productID, rating]):
            return jsonify({'error': 'Missing required fields'}), 400

        rating = int(rating)  # Ensure rating is numeric

        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        logger.info(f"\u2192 Updating rating for storeID: {storeID}, productID: {productID}, userID: {userID}")

        # First check if a rating exists
        cursor.execute("""
            SELECT updateID 
            FROM user_update 
            WHERE userID = %s AND storeID = %s AND productID = %s
        """, (userID, storeID, productID))
        
        existing_rating = cursor.fetchone()

        if existing_rating:
            # Update existing rating
            cursor.execute("""
                UPDATE user_update 
                SET rating = %s, submitted_at = CURRENT_TIMESTAMP
                WHERE updateID = %s
            """, (rating, existing_rating['updateID']))
            logger.info(f"Updated existing rating (updateID: {existing_rating['updateID']})")
        else:
            # Insert new rating
            cursor.execute("""
                INSERT INTO user_update (userID, productID, storeID, rating)
                VALUES (%s, %s, %s, %s)
            """, (userID, productID, storeID, rating))
            logger.info("Inserted new rating")

        connection.commit()
        
        # Update store's average rating
        try:
            store_controller.update_store_rating(storeID)  # Remove cursor and connection parameters
            logger.info("Store rating updated successfully")
        except Exception as e:
            logger.error(f"Failed to update store rating: {e}")

        return jsonify({'message': 'Rating submitted successfully'}), 200

    except Exception as e:
        logger.error(f"Error in submit_rating: {e}")
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@rating_bp.route('/api/ratings/<int:storeID>/user/<int:userID>', methods=['GET'])
def get_user_rating(storeID, userID):
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        
        # Query to get the user's most recent rating for the store
        query = """
            SELECT rating 
            FROM user_update 
            WHERE storeID = %s AND userID = %s 
            ORDER BY submitted_at DESC 
            LIMIT 1
        """
        
        cursor.execute(query, (storeID, userID))
        result = cursor.fetchone()
        
        if result:
            return jsonify({'rating': float(result['rating'])}), 200
        else:
            return jsonify({'rating': 0}), 200

    except Exception as e:
        print(f"Error fetching user rating: {e}")
        return jsonify({'error': str(e)}), 500
    
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()