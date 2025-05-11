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
        rating = data.get('rating')

        logger.info(f"Received rating submission for store {storeID}: {rating} (type: {type(rating)})")

        if not all([userID, rating]):
            return jsonify({'error': 'Missing required fields'}), 400

        rating = int(rating)  # Ensure rating is numeric

        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        logger.info(f"\u2192 Inserting rating for storeID: {storeID}, userID: {userID}")

        connection.begin()

        cursor.execute("""
            INSERT INTO user_update (userID, storeID, rating)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE
            rating = VALUES(rating),
            submitted_at = CURRENT_TIMESTAMP
        """, (userID, storeID, rating))

        connection.commit()
        logger.info("Rating saved to user_update table")

        # Re-open cursor to ensure data visibility for store rating update
        cursor.close()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        try:
            store_controller.update_store_rating(storeID, cursor, connection)
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
