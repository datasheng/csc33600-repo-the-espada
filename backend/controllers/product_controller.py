from typing import List, Optional
from mysql.connector import Error
from db import get_db_connection

class ProductController:
    def get_all_products(self) -> List[dict]:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        products = []
        
        try:
            cursor.execute("SELECT * FROM product")
            products = cursor.fetchall()
        except Error as e:
            print(f"Error fetching products: {e}")
        finally:
            cursor.close()
            connection.close()
            
        return products

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