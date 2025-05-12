from typing import List, Optional
import pymysql
import pymysql.cursors
from mysql.connector import Error
from db import get_db_connection

class ProductController:
    def get_all_products(self) -> List[dict]:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        try:
            cursor.execute("""
                SELECT productID, storeID, chain_type, chain_purity, 
                       chain_thickness, chain_length, chain_color,
                       chain_weight, set_price
                FROM product
            """)
            return cursor.fetchall()
        except Exception as e:
            print(f"Database error: {e}")
            raise e
        finally:
            cursor.close()
            connection.close()

    def get_product_by_id(self, product_id: int) -> Optional[dict]:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        try:
            cursor.execute("SELECT * FROM product WHERE productID = %s", (product_id,))
            product = cursor.fetchone()
            return product
        except Error as e:
            print(f"Error fetching product: {e}")
            return None
        finally:
            cursor.close()
            connection.close()

    def get_products_by_store(self, store_id: int) -> List[dict]:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        try:
            cursor.execute("""
                SELECT productID, storeID, chain_type, chain_purity, 
                       chain_thickness, chain_length, chain_color,
                       chain_weight, set_price
                FROM product
                WHERE storeID = %s
            """, (store_id,))
            return cursor.fetchall()
        except Exception as e:
            print(f"Database error: {e}")
            raise e
        finally:
            cursor.close()
            connection.close()
    
    def get_purchases(self, product_id: int):
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        try:
            cursor.execute("""
                SELECT 
                    CONCAT(u.first_name, ' ', u.last_name) AS full_name, 
                    uu.latest_price, 
                    uu.submitted_at
                FROM 
                    user_update uu
                JOIN 
                    users u ON uu.userID = u.userID
                WHERE 
                    uu.productID = %s
                ORDER BY 
                    uu.latest_price ASC, 
                    uu.submitted_at DESC
                LIMIT 10;     
            """, (product_id,))
            return cursor.fetchall()
        except Exception as e:
            print(f"Database error: {e}")
            raise e
        finally:
            cursor.close()
            connection.close()