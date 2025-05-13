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
