from typing import List, Optional
import pymysql
from db import get_db_connection
import logging

logger = logging.getLogger(__name__)

class StoreController:
    def __init__(self):
        # Temporary in-memory storage until database is set up
        self.stores = []

    def get_all_stores(self) -> List[dict]:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        try:
            cursor.execute("""
                SELECT s.storeID, s.ownerID, s.store_name, s.rating, 
                       s.address, s.latitude, s.longitude, s.phone, s.email,
                       COUNT(u.rating) as rating_count
                FROM store s
                JOIN store_owners o ON s.ownerID = o.ownerID
                LEFT JOIN user_update u ON s.storeID = u.storeID
                GROUP BY s.storeID
            """)
            stores = cursor.fetchall()
            return stores
        except Exception as e:
            print(f"Database error: {e}")
            raise e
        finally:
            cursor.close()
            connection.close()

    def get_store_by_id(self, storeID: int) -> Optional[dict]:
        connection = get_db_connection()
        if connection is None:
            raise Exception("Database connection failed")
            
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        try:
            # Get store details
            cursor.execute("""
                SELECT s.storeID, s.ownerID, s.store_name, s.rating,
                       s.address, s.latitude, s.longitude, s.phone, s.email
                FROM store s
                WHERE s.storeID = %s
            """, (storeID,))
            store = cursor.fetchone()
            
            if store:
                # Get store hours
                cursor.execute("""
                    SELECT storeHourID, storeID, daysOpen,
                           TIME_FORMAT(openTime, '%h:%i %p') as openTime,
                           TIME_FORMAT(closeTime, '%h:%i %p') as closeTime
                    FROM store_hours
                    WHERE storeID = %s
                    ORDER BY FIELD(daysOpen, 'Monday', 'Tuesday', 'Wednesday',
                                 'Thursday', 'Friday', 'Saturday', 'Sunday')
                """, (storeID,))
                store['hours'] = cursor.fetchall()
            
            return store
            
        except Exception as e:
            print(f"Database error: {e}")
            raise e
        finally:
            cursor.close()
            connection.close()

    def create_store(self, store_data: dict) -> dict:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        
        try:
            cursor.execute("""
                INSERT INTO store (ownerID, store_name, rating, address, 
                                 latitude, longitude, phone, email)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                store_data['ownerID'],
                store_data['store_name'],
                store_data['rating'],
                store_data['address'],
                store_data['latitude'],
                store_data['longitude'],
                store_data['phone'],
                store_data['email']
            ))
            
            connection.commit()
            store_id = cursor.lastrowid
            
            cursor.execute("""
                SELECT * FROM store WHERE storeID = %s
            """, (store_id,))
            
            return cursor.fetchone()
            
        except Exception as e:
            print(f"Database error: {e}")
            raise e
        finally:
            cursor.close()
            connection.close()

    def update_store_rating(self, storeID: int) -> None:
        """Calculate and update store rating based on user reviews"""
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        
        try:
            # Calculate new average rating
            cursor.execute("""
                SELECT COUNT(*) as rating_count, 
                       COALESCE(ROUND(AVG(rating), 2), 0.00) as avg_rating
                FROM user_update
                WHERE storeID = %s AND rating IS NOT NULL
            """, (storeID,))
            
            result = cursor.fetchone()
            rating_count = result['rating_count']
            avg_rating = float(result['avg_rating'])
            
            logger.info(f"Calculated new rating for store {storeID}: {avg_rating} from {rating_count} ratings")

            # Update store rating
            cursor.execute("""
                UPDATE store
                SET rating = %s
                WHERE storeID = %s
            """, (avg_rating, storeID))
            
            connection.commit()
            logger.info(f"Updated store {storeID} rating to {avg_rating}")

        except Exception as e:
            logger.error(f"Error updating store rating: {e}")
            connection.rollback()
            raise
        finally:
            cursor.close()
            connection.close()

    def get_store_hours(self, storeID: int) -> List[dict]:
        connection = get_db_connection()
        if connection is None:
            raise Exception("Database connection failed")
            
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        try:
            cursor.execute("""
                SELECT 
                    storeHourID,
                    storeID,
                    daysOpen,
                    openTime,
                    closeTime
                FROM store_hours 
                WHERE storeID = %s 
                ORDER BY FIELD(daysOpen, 'Monday', 'Tuesday', 'Wednesday',
                             'Thursday', 'Friday', 'Saturday', 'Sunday')
            """, (storeID,))
            
            hours = cursor.fetchall()
            
            # Convert time objects to strings without formatting
            formatted_hours = []
            for hour in hours:
                # If either time is NULL, both should be 'CLOSED'
                is_closed = hour['openTime'] is None or hour['closeTime'] is None
                formatted_hour = {
                    'storeHourID': hour['storeHourID'],
                    'storeID': hour['storeID'],
                    'daysOpen': hour['daysOpen'],
                    'openTime': 'CLOSED' if is_closed else str(hour['openTime']),
                    'closeTime': 'CLOSED' if is_closed else str(hour['closeTime'])
                }
                formatted_hours.append(formatted_hour)
                
            return formatted_hours
            
        except Exception as e:
            print(f"Database error: {e}")
            raise e
        finally:
            cursor.close()
            connection.close()