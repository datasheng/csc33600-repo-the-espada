from flask import Blueprint, jsonify, request
from controllers.product_controller import ProductController
from db import get_db_connection
import pymysql.cursors
import logging

product_bp = Blueprint('product_bp', __name__)
product_controller = ProductController()

@product_bp.route('/api/products', methods=['GET'])
def get_products():
    try:
        store_id = request.args.get('storeID')
        if store_id:
            store_id = int(store_id)
            products = product_controller.get_products_by_store(store_id)
        else:
            products = product_controller.get_all_products()
        return jsonify(products)
    except Exception as e:
        print(f"Error getting products: {e}")
        return jsonify({"error": str(e)}), 500

@product_bp.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = product_controller.get_product_by_id(product_id)
        if product is None:
            return jsonify({"error": "Product not found"}), 404

        purchases = product_controller.get_purchases(product_id)
        
        return jsonify({
            "product": product,
            "purchases": purchases
        }), 200
    except Exception as e:
        print(f"Error getting product: {e}")
        return jsonify({"error": str(e)}), 500

@product_bp.route('/api/products/<int:productID>/purchases', methods=['POST'])
def submit_purchase(productID):
    try:
        data = request.get_json()
        userID = data.get('userID')
        storeID = data.get('storeID')
        latest_price = data.get('latest_price')
        purchase_date = data.get('purchase_date')

        if not all([userID, productID, storeID, latest_price, purchase_date]):
            return jsonify({'error': 'Missing required fields'}), 400

        product_controller = ProductController()
        success = product_controller.submit_purchase(
            userID, productID, storeID, latest_price, purchase_date
        )

        if success:
            return jsonify({'message': 'Purchase submitted successfully'}), 200
        else:
            return jsonify({'error': 'Failed to submit purchase'}), 500

    except Exception as e:
        print(f"Error submitting purchase: {e}")
        return jsonify({'error': str(e)}), 500

@product_bp.route('/api/products', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['storeID', 'chain_type', 'chain_purity', 'chain_thickness', 
                         'chain_length', 'chain_color', 'chain_weight', 'set_price']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        try:
            # Insert product
            cursor.execute("""
                INSERT INTO product (
                    storeID, chain_type, chain_purity, chain_thickness,
                    chain_length, chain_color, chain_weight, set_price
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                data['storeID'],
                data['chain_type'],
                data['chain_purity'],
                data['chain_thickness'],
                data['chain_length'],
                data['chain_color'],
                data['chain_weight'],
                data['set_price']
            ))

            connection.commit()
            product_id = cursor.lastrowid

            # Return the created product
            cursor.execute("""
                SELECT * FROM product WHERE productID = %s
            """, (product_id,))
            
            new_product = cursor.fetchone()
            return jsonify(new_product), 201

        except Exception as e:
            connection.rollback()
            print(f"Database error: {e}")
            return jsonify({'error': 'Failed to create product'}), 500
        finally:
            cursor.close()
            connection.close()

    except Exception as e:
        print(f"Error creating product: {e}")
        return jsonify({'error': str(e)}), 500

@product_bp.route('/api/products/<int:productID>', methods=['PUT'])
def update_product(productID):
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['chain_type', 'chain_purity', 'chain_thickness', 
                         'chain_length', 'chain_color', 'chain_weight', 'set_price']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        try:
            # Update product
            cursor.execute("""
                UPDATE product 
                SET chain_type = %s, 
                    chain_purity = %s, 
                    chain_thickness = %s,
                    chain_length = %s, 
                    chain_color = %s, 
                    chain_weight = %s, 
                    set_price = %s
                WHERE productID = %s
            """, (
                data['chain_type'],
                data['chain_purity'],
                data['chain_thickness'],
                data['chain_length'],
                data['chain_color'],
                data['chain_weight'],
                data['set_price'],
                productID
            ))

            connection.commit()

            # Return the updated product
            cursor.execute("""
                SELECT * FROM product WHERE productID = %s
            """, (productID,))
            
            updated_product = cursor.fetchone()
            return jsonify(updated_product), 200

        except Exception as e:
            connection.rollback()
            print(f"Database error: {e}")
            return jsonify({'error': 'Failed to update product'}), 500
        finally:
            cursor.close()
            connection.close()

    except Exception as e:
        print(f"Error updating product: {e}")
        return jsonify({'error': str(e)}), 500

@product_bp.route('/api/products/<int:productID>', methods=['DELETE'])
def delete_product(productID):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        try:
            # Delete product
            cursor.execute("DELETE FROM product WHERE productID = %s", (productID,))
            connection.commit()
            
            return jsonify({'message': 'Product deleted successfully'}), 200

        except Exception as e:
            connection.rollback()
            print(f"Database error: {e}")
            return jsonify({'error': 'Failed to delete product'}), 500
        finally:
            cursor.close()
            connection.close()

    except Exception as e:
        print(f"Error deleting product: {e}")
        return jsonify({'error': str(e)}), 500
