from .serializers import UserSerializer

def jwt_payload_handler(user):
    return {
        'user_id': user.pk,
        'is_staff': user.is_staff,
        'username': user.username
    }

def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': UserSerializer(user, context={'request': request}).data
    }