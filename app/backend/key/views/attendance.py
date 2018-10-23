from django.core import serializers
from ..models import AttendanceItems
from ..serializers import AttendanceItemSerializer
from ..helpers import isValidDateTime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class Attendance(APIView):

    # Validate input for the.query_params request of this endpoint - if there are parameters that we care 
    # about, they should be valid dates that won't make django yell at me.
    def validateGet(self, request):
        if 'day' in request.query_params and not isValidDateTime(request.query_params['day']):
            return False
        elif 'startdate' in request.query_params and not isValidDateTime(request.query_params['startdate']):
            return False
        elif 'enddate' in request.query_params and not isValidDateTime(request.query_params['enddate']):
            return False
        return True

    # Validate input for the PATCH request of this endpoint - should reference a valid key
    def validatePatch(self, request):
        if not 'key' in request.query_params:
            return False
        try:
            AttendanceItems.objects.get(pk=request.query_params['key'])
        except:
            return False
        return True     

    def get(self, request):
        if not self.validateGet(request):
            return Response({'error':'Invalid Parameters'}, status='400')

        items = AttendanceItems.objects.all()
        if 'day' in request.query_params:
            items = items.filter(date=request.query_params['day'])
        if 'startdate' in request.query_params:
            items = items.filter(date__gte=request.query_params['startdate'])
        if 'enddate' in request.query_params:
            items = items.filter(date__lte=request.query_params['enddate'])

        serializer = AttendanceItemSerializer(items, many=True)
        return Response(serializer.data, content_type='application/json')

    def patch(self, request):
        if not self.validatePatch(request):
            return Response({'error':'Invalid Parameters'}, status='400')

        attendanceItem = AttendanceItems.objects.get(pk=request.query_params['key'])
        serializer = AttendanceItemSerializer(attendanceItem, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)