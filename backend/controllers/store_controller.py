from typing import List, Optional
import pymysql
from db import get_db_connection

class StoreController:
    def __init__(self):
        # Temporary in-memory storage until database is set up
        self.stores = []

    def get_all_stores(self) -> List[dict]:
        connection = get_db_connection()
        if connection is None:
            raise Exception("Database connection failed")
            
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        try:
            cursor.execute("""
                SELECT s.storeID, s.ownerID, s.store_name, s.rating, 
                       s.address, s.latitude, s.longitude, s.phone, s.email
                FROM store s
                JOIN store_owners o ON s.ownerID = o.ownerID
            """)
            stores = cursor.fetchall()
            return stores
            
        except Exception as e:
            print(f"Database error: {e}")
            raise e
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
                SELECT storeHourID, storeID, day, 
                       TIME_FORMAT(openTime, '%%h:%%i %%p') as openTime,
                       TIME_FORMAT(closeTime, '%%h:%%i %%p') as closeTime
                FROM store_hours 
                WHERE storeID = %s
                ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 
                             'Thursday', 'Friday', 'Saturday', 'Sunday')
            """, (storeID,))
            return cursor.fetchall()
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
                    SELECT storeHourID, storeID, day,
                           TIME_FORMAT(openTime, '%h:%i %p') as openTime,
                           TIME_FORMAT(closeTime, '%h:%i %p') as closeTime
                    FROM store_hours
                    WHERE storeID = %s
                    ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday',
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