from django.core import serializers
from ..models import Activity
from ..serializers import ActivitySerializer
from ..helpers import isValidDateTime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class Activities(APIView):

    def get(self, request):
        items = Activity.objects.all()

        serializer = ActivitySerializer(items, many=True)
        return Response(serializer.data, content_type='application/json')