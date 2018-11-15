from django.core import serializers
from ..models import Students as StudentsModel
from ..serializers import StudentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class Students(APIView):

    # Validate input for the.query_params request of this endpoint - if there are parameters that we care 
    # about, they should be valid dates that won't make django yell at me.
    def validateGet(self, pk):
        if isinstance(pk, int):
            return True
        else:
            return False
            
    def get(self, request, pk):
        if not self.validateGet(pk):
            return Response({'error':'Invalid Parameters'}, status='400')

        student = StudentsModel.objects.get(pk = pk)
        
        serializer = StudentSerializer(student)
        return Response(serializer.data, content_type='application/json')
