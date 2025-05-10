from flask import Blueprint, request, jsonify

signup_bp = Blueprint('signup', __name__, url_prefix='/auth')

@signup_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    account_type = data.get('account_type')  # "business" or "customer"

    if not all([username, email, password, account_type]):
        return jsonify({'error': 'Missing required fields'}), 400

    if account_type == 'business':
        store_name = data.get('store_name')
        store_address = data.get('store_address')

        if not store_name or not store_address:
            return jsonify({
                'error': 'Business users must provide store name and store address.'
            }), 400

        return jsonify({
            'message': 'Business user registered successfully',
            'user': {
                'username': username,
                'email': email,
                'account_type': account_type,
                'store_name': store_name,
                'store_address': store_address
            }
        }), 201

    elif account_type == 'customer':
        return jsonify({
            'message': 'Customer user registered successfully',
            'user': {
                'username': username,
                'email': email,
                'account_type': account_type
            }
        }), 201

    else:
        return jsonify({'error': 'Invalid account type'}), 400
