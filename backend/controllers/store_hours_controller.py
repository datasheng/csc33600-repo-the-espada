from typing import List, Optional
import pymysql
from db import get_db_connection

class StoreHoursController:
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