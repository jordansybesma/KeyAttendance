from django.http import HttpResponseRedirect
from django.contrib.auth.models import Group
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from ..serializers import GroupSerializer

class Groups(APIView):

    def get(self, request):
        groups = Group.objects.all()
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data, content_type='application/json')

    def patch(self, request):
        group = Group.objects.get(pk=request.data['id'])
        serializer = GroupSerializer(group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)