from django.core import serializers
from ..models import StudentInfo as StudentInfoModel
from ..serializers import StudentInfoSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import time


class StudentInfo(APIView):

    def validateGet(self, request):
        if 'student_id' in request.query_params:
            try:
                StudentInfoModel.objects.filter(student_id=int(request.query_params['student_id']))
            except Exception as e:
                return False
        return True
      
    def validatePatch(self, request):
        try:
            StudentInfoModel.objects.get(pk=request.data['id'])
        except:
            return False
        return True

    # Get existing student data
    def get(self, request):
        if not self.validateGet(request):
            return Response({'error':'Invalid Parameters'}, status='400')
        
        info = StudentInfoModel.objects.filter(student_id=request.query_params['student_id'])
        serializer = StudentInfoSerializer(info, many=True)
        
        return Response(serializer.data, content_type='application/json')
      
    # Validate input for the DELETE request of this endpoint - should reference a valid key
    def validateDelete(self, request):
        print("this is the rq")
        print(request.data['id'])
        try:
            StudentInfoModel.objects.get(pk=request.data['id'])
        except:
            return False
        return True
      
    def delete(self, request):
        if not self.validateDelete(request):
            return Response({'error':'Invalid Parameters'}, status='400')

        studentItem = StudentInfoModel.objects.get(pk=request.data['id'])
        studentItem.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
      
    # Create a new student
    def post(self, request):
        # Note: Until we convert student.id to an autofield/serial, this will require that we create a new student ID for new students.
        # So, for now we'll just assign them the UNIX timestamp, since that should be pretty unique.
        # This approach will break on January 17, 2038, when UNIX timestamps will exceed 32 bits, so we'll probably want to fix this.
        if not 'student_id' in request.data:
            request.data['student_id'] = round(time.time())

        serializer = StudentInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update an existing student
    def patch(self, request):
        if not self.validatePatch(request):
            return Response({'error':'Invalid Paremeters'}, status='400')

        obj = StudentInfoModel.objects.get(pk=request.data['id'])
        serializer = StudentInfoSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
