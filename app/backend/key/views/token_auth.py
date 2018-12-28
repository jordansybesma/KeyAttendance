from django.contrib.auth.models import update_last_login
from rest_framework_jwt.views import ObtainJSONWebToken
from rest_framework.authtoken.models import Token
from rest_framework import permissions
from rest_framework.decorators import permission_classes

class TokenAuth(ObtainJSONWebToken):
    permission_classes = (permissions.AllowAny,)
    def post(self, request,  *args, **kwargs):
        result = super().post(request, *args, **kwargs)
        print(result.data['user'])
        #token = Token.objects.get(key=result.data['token'])
        #update_last_login(None, token.user)
        return result