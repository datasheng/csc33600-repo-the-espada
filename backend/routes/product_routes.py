from flask import Blueprint, jsonify, request
from controllers.product_controller import ProductController

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
        return jsonify(product)
    except Exception as e:
        print(f"Error getting product: {e}")
        return jsonify({"error": str(e)}), 500

@product_bp.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()
    try:
        created = product_controller.add_product(
            data.get('storeID'),
            data.get('chain_type'),
            data.get('chain_purity'),
            data.get('chain_thickness'),
            data.get('chain_length'),
            data.get('chain_color'),
            data.get('chain_weight'),
            data.get('set_price')
        )
        return jsonify(created), 201
    except Exception as e:
        print(f"Error adding product: {e}")
        return jsonify({"error": str(e)}), 500

@product_bp.route('/api/products/<int:productID>', methods=['PUT'])
def update_product_price(productID):
    data = request.get_json()
    try:
        product_controller.update_product_price(productID, data.get('set_price'))
        return jsonify({"message": "Product price updated"}), 200
    except Exception as e:
        print(f"Error updating product price: {e}")
        return jsonify({"error": str(e)}), 500

@product_bp.route('/api/products/<int:productID>', methods=['DELETE'])
def delete_product(productID):
    try:
        product_controller.delete_product(productID)
        return jsonify({"message": "Product deleted"}), 200
    except Exception as e:
        print(f"Error deleting product: {e}")
        return jsonify({"error": str(e)}), 500