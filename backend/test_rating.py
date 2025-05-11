from controllers.store_controller import StoreController
from db import get_db_connection
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_rating_update():
    connection = None
    cursor = None
    try:
        # Get database connection
        connection = get_db_connection()
        cursor = connection.cursor()
        
        controller = StoreController()
        logger.info("Starting rating update test for store ID 1")
        controller.update_store_rating(1, cursor, connection)
        logger.info("Rating update completed")
        
    except Exception as e:
        logger.error(f"Error during rating update: {e}")
        if connection:
            connection.rollback()
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == "__main__":
    test_rating_update()