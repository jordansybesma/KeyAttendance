from django.core import serializers
from ..models import Students as StudentsModel
from ..serializers import StudentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import time

class Students(APIView):

    def validateGet(self, request):
        if 'id' in request.query_params:
            try:
                StudentsModel.objects.get(pk=int(request.query_params['id']))
            except Exception as e:
                return False

        return True

    def validatePatch(self, request):
        try:
            StudentsModel.objects.get(pk=request.data['id'])
        except:
            return False
        return True
    
    # Validate input for the DELETE request of this endpoint - should reference a valid key
    def validateDelete(self, request):
        try:
            StudentsModel.objects.get(pk=request.data['id'])
        except:
            return False
        return True
      
    def delete(self, request):
        if not self.validateDelete(request):
            return Response({'error':'Invalid Parameters'}, status='400')
        studentItem = StudentsModel.objects.get(pk=request.data['id'])
        studentItem.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Get existing student data
    def get(self, request):
        if not request.user.has_perm('key.view_students') and not request.user.has_perm('key.view_attendanceitems'):
            return Response({'error':'You are not authorized to view students.'}, status='401')
        if not self.validateGet(request):
            return Response({'error':'Invalid Parameters'}, status='400')
        if 'id' in request.query_params:
            student = StudentsModel.objects.get(pk=request.query_params['id'])
            serializer = StudentSerializer(student)
        else:
            students = StudentsModel.objects.all()
            serializer = StudentSerializer(students, many=True)
        
        return Response(serializer.data, content_type='application/json')

    # Create a new student
    def post(self, request):
        if not request.user.has_perm('key.add_students'):
            return Response({'error':'You are not authorized to create students.'}, status='401')
        # Note: Until we convert student.id to an autofield/serial, this will require that we create a new student ID for new students.
        # So, for now we'll just assign them the UNIX timestamp, since that should be pretty unique.
        # This approach will break on January 17, 2038, when UNIX timestamps will exceed 32 bits, so we'll probably want to fix this.
        if not 'id' in request.data:
            request.data['id'] = round(time.time())
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update an existing student
    def patch(self, request):
        if not request.user.has_perm('key.change_students'):
            return Response({'error':'You are not authorized to update students.'}, status='401')
        if not self.validatePatch(request):
            return Response({'error':'Invalid Parameters'}, status='400')

        obj = StudentsModel.objects.get(pk=request.data['id'])
        serializer = StudentSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
