from controllers.store_controller import StoreController
from db import get_db_connection
import pymysql
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def insert_test_rating(storeID: int, userID: int, productID: int, rating: int):
    connection = get_db_connection()
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    
    try:
        # Insert test rating
        cursor.execute("""
            INSERT INTO user_update (userID, productID, storeID, rating)
            VALUES (%s, %s, %s, %s)
        """, (userID, productID, storeID, rating))
        
        connection.commit()
        logger.info(f"Inserted test rating: {rating} for store {storeID}")
        
    except Exception as e:
        logger.error(f"Error inserting test rating: {e}")
        connection.rollback()
        raise e
    finally:
        cursor.close()
        connection.close()

def test_rating_update():
    try:
        # Insert test rating
        insert_test_rating(storeID=1, userID=1, productID=1, rating=4)
        
        # Update store rating
        controller = StoreController()
        controller.update_store_rating(1)
        
        logger.info("Rating update test completed successfully")
        
    except Exception as e:
        logger.error(f"Error during rating update test: {e}")

if __name__ == "__main__":
    test_rating_update()