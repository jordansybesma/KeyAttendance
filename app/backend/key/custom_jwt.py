from .serializers import UserSerializer
from datetime import datetime
from rest_framework_jwt.settings import api_settings

def jwt_payload_handler(user):
    return {
        'user_id': user.pk,
        'is_staff': user.is_staff,
        'username': user.username,
        'exp': datetime.utcnow() + api_settings.JWT_EXPIRATION_DELTA
    }

def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': UserSerializer(user, context={'request': request}).data
    }