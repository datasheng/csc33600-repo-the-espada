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
        cursor = connection.cursor(pymysql.cursors.DictCursor)  # Changed from dictionary=True
        
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
    
    def get_purchases(self, product_id: int):
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        try:
            cursor.execute("""
                SELECT 
                    CONCAT(
                        u.first_name, 
                        ' ', 
                        LEFT(u.last_name, 1), 
                        '.'
                    ) AS full_name, 
                    ph.latest_price, 
                    ph.purchase_date
                FROM 
                    price_history ph
                JOIN 
                    users u ON ph.userID = u.userID
                WHERE 
                    ph.productID = %s
                ORDER BY 
                    ph.purchase_date DESC
                LIMIT 5;
            """, (product_id,))
            return cursor.fetchall()
        except Exception as e:
            print(f"Database error: {e}")
            raise e
        finally:
            cursor.close()
            connection.close()

    def cleanup_price_history(self, product_id: int, connection, cursor):
        """Helper method to maintain only 5 most recent entries per product"""
        try:
            # Get historyIDs of entries to keep
            cursor.execute("""
                SELECT historyID 
                FROM price_history 
                WHERE productID = %s 
                ORDER BY purchase_date DESC 
                LIMIT 5
            """, (product_id,))
            keep_ids = [row['historyID'] for row in cursor.fetchall()]
            
            if keep_ids:
                # Delete older entries
                cursor.execute("""
                    DELETE FROM price_history 
                    WHERE productID = %s 
                    AND historyID NOT IN ({})
                """.format(','.join(['%s'] * len(keep_ids))), 
                (product_id, *keep_ids))
                
                # Reset auto increment if needed
                cursor.execute("ALTER TABLE price_history AUTO_INCREMENT = 1")
                
                connection.commit()
        except Exception as e:
            print(f"Error cleaning up price history: {e}")
            connection.rollback()

    def submit_purchase(self, user_id: int, product_id: int, store_id: int, price: float, purchase_date: str):
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        try:
            # Convert ISO datetime string to MySQL datetime format
            formatted_date = purchase_date.replace('T', ' ').replace('Z', '')
            
            # Check if user already submitted a price for this product today
            cursor.execute("""
                SELECT historyID 
                FROM price_history 
                WHERE userID = %s 
                AND productID = %s 
                AND DATE(purchase_date) = DATE(%s)
            """, (user_id, product_id, formatted_date))
            
            existing_entry = cursor.fetchone()
            
            if existing_entry:
                # Update existing entry
                cursor.execute("""
                    UPDATE price_history 
                    SET latest_price = %s, purchase_date = %s
                    WHERE historyID = %s
                """, (price, formatted_date, existing_entry['historyID']))
            else:
                # Insert new entry
                cursor.execute("""
                    INSERT INTO price_history 
                    (userID, productID, storeID, latest_price, purchase_date)
                    VALUES (%s, %s, %s, %s, %s)
                """, (user_id, product_id, store_id, price, formatted_date))

                # Delete oldest entry if more than 5 entries exist for this product
                cursor.execute("""
                    DELETE FROM price_history 
                    WHERE productID = %s 
                    AND historyID NOT IN (
                        SELECT historyID FROM (
                            SELECT historyID 
                            FROM price_history 
                            WHERE productID = %s 
                            ORDER BY purchase_date DESC 
                            LIMIT 5
                        ) as latest_five
                    )
                """, (product_id, product_id))
            
            connection.commit()
            return True

        except Exception as e:
            print(f"Error submitting purchase: {e}")
            connection.rollback()
            return False
        finally:
            cursor.close()
            connection.close()