from django.core import serializers
from ..models import Students
from ..serializers import StudentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class Students(APIView):

    # Validate input for the.query_params request of this endpoint - if there are parameters that we care 
    # about, they should be valid dates that won't make django yell at me.
    def validateGet(self, request):
        if 'student_id' in request.query_params and isInstance(request.query_params['student_id'], int):
            return True
        else:
            return False
            
    def get(self, request):
        if not self.validateGet(request):
            return Response({'error':'Invalid Parameters'}, status='400')

        student = Students.get(student_id=request.query_params['student_id'])
        
        serializer = StudentSerializer(student, many=True)
        return Response(serializer.data, content_type='application/json')
