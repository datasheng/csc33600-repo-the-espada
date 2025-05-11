from typing import List, Optional
import pymysql
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
        except Exception as e:
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

    def add_product(self, storeID: int, chain_type: str, chain_purity: str, chain_thickness: float, chain_length: float, chain_color: str, chain_weight: float, set_price: float) -> dict:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        try:
            cursor.execute(
                """
                INSERT INTO product (storeID, chain_type, chain_purity, chain_thickness, chain_length, chain_color, chain_weight, set_price)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (storeID, chain_type, chain_purity, chain_thickness, chain_length, chain_color, chain_weight, set_price)
            )
            connection.commit()
            new_id = cursor.lastrowid
            cursor.execute(
                "SELECT productID, storeID, chain_type, chain_purity, chain_thickness, chain_length, chain_color, chain_weight, set_price FROM product WHERE productID = %s",
                (new_id,)
            )
            return cursor.fetchone()
        except Exception as e:
            print(f"Error adding product: {e}")
            raise e
        finally:
            cursor.close()
            connection.close()

    def update_product_price(self, productID: int, set_price: float) -> None:
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(
                "UPDATE product SET set_price = %s WHERE productID = %s",
                (set_price, productID)
            )
            connection.commit()
        except Exception as e:
            print(f"Error updating product price: {e}")
            raise e
        finally:
            cursor.close()
            connection.close()
    
    def delete_product(self, productID: int) -> None:
        """Deletes a product by ID."""
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(
                "DELETE FROM product WHERE productID = %s",
                (productID,)
            )
            connection.commit()
        except Exception as e:
            print(f"Error deleting product: {e}")
            raise e
        finally:
            cursor.close()
            connection.close()