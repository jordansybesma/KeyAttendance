from django.core import serializers
from ..models import AttendanceItems
from ..models import Students
from ..serializers import AttendanceItemSerializer
from ..helpers import isValidDateTime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.db import IntegrityError

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

    def validatePost(self, request):
        if not 'student_id' in request.data or not 'activities' in request.data:
            return None
        #TODO: ideally .get() should suffice rather than .filter(), however it looks like there are currently 
        # duplicate student records (at least in my test DB)?
        if Students.objects.filter(id=request.data['student_id']).count() < 1:
            return None
        try:
            activities = request.data['activities'].split(',')
            for activity in activities:
                activity = int(activity)
        except:
            return None
        return activities 

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

    def post(self, request):
        activities = self.validatePost(request)
        if activities is None:
            return Response({'error':'Invalid Parameters'}, status='400')
        serializersData = []
        try:
            # add potentially multiple attendance items to DB as a single transaction - none will be saved if one fails
            with transaction.atomic():
                for activity in activities:
                    newData = {
                        'student_id': request.data['student_id'],
                        'date': request.data['date'],
                        'time': request.data['time'],
                        'activity_id': activity
                    }
                    serializer = AttendanceItemSerializer(data=newData)
                    if serializer.is_valid():
                        serializer.save()
                    else:
                        raise IntegrityError
                    serializersData.append(serializer.data)
        except IntegrityError:
            return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializersData)