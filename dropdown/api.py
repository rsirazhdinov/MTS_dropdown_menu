
"""
api.py
- provides the API endpoints for consuming and producing
  REST requests and responses
"""

from datetime import datetime, timedelta
from functools import wraps

import jwt
from flask import Blueprint, jsonify, request, current_app

from .models import db, User, City

api = Blueprint('api', __name__)

def token_required(f):
    @wraps(f)
    def _verify(*args, **kwargs):
        auth_headers = request.headers.get('Authorization', '').split()

        invalid_msg = {
            'message': 'Invalid token. Registeration and / or authentication required',
            'authenticated': False
        }
        expired_msg = {
            'message': 'Expired token. Reauthentication required.',
            'authenticated': False
        }

        if len(auth_headers) != 2:
            return jsonify(invalid_msg), 401

        try:
            token = auth_headers[1]
            data = jwt.decode(token, current_app.config['SECRET_KEY'])
            user = User.query.filter_by(email=data['sub']).first()
            if not user:
                raise RuntimeError('User not found')
            return f(user, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify(expired_msg), 401 # 401 is Unauthorized HTTP status code
        except (jwt.InvalidTokenError, Exception) as e:
            print(e)
            return jsonify(invalid_msg), 401

    return _verify


@api.route('/register/', methods=('POST',))
def register():
    data = request.get_json()
    user = User(**data)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201


@api.route('/login/', methods=('POST',))
def login():
    data = request.get_json()
    user = User.authenticate(**data)

    if not user:
        return jsonify({ 'message': 'Invalid credentials', 'authenticated': False }), 401

    token = jwt.encode({
        'sub': user.email,
        'iat':datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(minutes=30)},
        current_app.config['SECRET_KEY'])
    return jsonify({ 'token': token.decode('UTF-8') })


@api.route('/cities/', methods=('GET',))
@token_required
def fetch_cities(user):
    cities = City.query.all()
    city = user.user_city
    return jsonify({"user_city": city, "cities": [s.city for s in cities]})

@api.route('/save_city/', methods=('POST',))
@token_required
def save_city(user):
    data = request.get_json()
    city = City.query.filter_by(city=data['current_city']).first()
    user.city = city
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201
