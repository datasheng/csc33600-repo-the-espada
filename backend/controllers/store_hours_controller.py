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
                SELECT 
                    storeHourID, 
                    storeID, 
                    daysOpen,
                    CASE 
                        WHEN openTime IS NULL THEN 'CLOSED'
                        ELSE TIME_FORMAT(openTime, '%h:%i %p')
                    END as openTime,
                    CASE 
                        WHEN closeTime IS NULL THEN 'CLOSED'
                        ELSE TIME_FORMAT(closeTime, '%h:%i %p')
                    END as closeTime
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