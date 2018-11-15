from django.core import serializers
from ..models import Students as StudentsModel
from ..serializers import StudentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class Students(APIView):

    def validateGet(self, request):
        if 'id' in request.query_params and not isinstance(request.query_params['id'], int):
            try:
                AttendanceItems.objects.get(pk=request.query_params['id'])
            except:
                return False
        else:
            return True
    
    # Get existing student data
    def get(self, request):
        if not self.validateGet(request):
            return Response({'error':'Invalid Parameters'}, status='400')

        students = StudentsModel.objects.all()
        print(students) 

        if 'id' in request.query_params:
            students = students.get(pk=request.query_params['id'])
        
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data, content_type='application/json')

    # Create a new student
    def post(self, request):


    # Update an existing student
    def patch(self, request:)
