from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from ..serializers import UserSerializer, UserSerializerCreate
from rest_framework.decorators import permission_classes


class Users(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


    def post(self, request, format=None):
        serializer = UserSerializerCreate(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)