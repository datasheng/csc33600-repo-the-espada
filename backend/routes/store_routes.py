from flask import Blueprint, jsonify, request
from controllers.store_controller import StoreController

store_bp = Blueprint('stores', __name__)
store_controller = StoreController()

@store_bp.route('/stores', methods=['GET'])
def get_stores():
    stores = store_controller.get_all_stores()
    return jsonify([{
        'id': store.id,
        'name': store.name,
        'address': store.address,
        'lat': store.lat,
        'lng': store.lng,
        'rating': store.rating,
        'numReviews': store.num_reviews,
        'phone': store.phone,
        'email': store.email,
        'website': store.website,
        'hours': [{
            'day': h.day,
            'open': h.open,
            'close': h.close,
            'isClosed': h.is_closed
        } for h in store.hours]
    } for store in stores])

@store_bp.route('/stores/<string:store_id>', methods=['GET'])
def get_store(store_id):
    store = store_controller.get_store_by_id(store_id)
    if not store:
        return jsonify({'error': 'Store not found'}), 404
    
    return jsonify({
        'id': store.id,
        'name': store.name,
        'address': store.address,
        'lat': store.lat,
        'lng': store.lng,
        'rating': store.rating,
        'numReviews': store.num_reviews,
        'phone': store.phone,
        'email': store.email,
        'website': store.website,
        'hours': [{
            'day': h.day,
            'open': h.open,
            'close': h.close,
            'isClosed': h.is_closed
        } for h in store.hours]
    })