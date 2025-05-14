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


    def update_store_hours(self, storeID: int, hours_data: List[dict]):
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        try:
            for entry in hours_data:
                day = entry['day']
                open_time = entry['openTime']
                close_time = entry['closeTime']

                cursor.execute("""
                    SELECT storeHourID FROM store_hours 
                    WHERE storeID = %s AND day = %s
                """, (storeID, day))
                exists = cursor.fetchone()

                if exists:
                    cursor.execute("""
                        UPDATE store_hours SET openTime = %s, closeTime = %s
                        WHERE storeID = %s AND day = %s
                    """, (open_time, close_time, storeID, day))
                else:
                    cursor.execute("""
                        INSERT INTO store_hours (storeID, day, openTime, closeTime)
                        VALUES (%s, %s, %s, %s)
                    """, (storeID, day, open_time, close_time))

            connection.commit()
        except Exception as e:
            print(f"Error updating store hours: {e}")
            connection.rollback()
            raise e
        finally:
            cursor.close()
            connection.close()