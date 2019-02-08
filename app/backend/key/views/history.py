from django.http import HttpResponseRedirect
from ..models import AttendanceItems, Students, Activity
from simple_history.models import HistoricalRecords
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ..serializers import GroupSerializer, HistoricalRecordSerializer

class History(APIView):

    def buildActionString(self, history_type, model):
        action = ''
        if (history_type == '+'):
            action = 'Create'
        elif (history_type == '-'):
            action = 'Delete'
        elif (history_type == '~'):
            action = 'Update'
        return '{} {}'.format(action, model)

    def buildAttendanceValuesString(self, item, activity, student_name):
        activity_value = ''
        if (activity.type == 'string'):
            activity_value = ' | Text Value: {}'.format(item['str_value'])
        elif (activity.type == 'float'):
            number = int(item['num_value']) if item['num_value'].is_integer() else item['num_value']
            activity_value = ' | Number Value: {}'.format(number)
        return 'Date: {} | Time: {} | Student Name: {} | Activity: {}{}'.format(str(item['date']), 
                    str(item['time']), student_name, activity.name, activity_value)

    def get(self, request):
        history = AttendanceItems.history.all().filter(history_user_id=request.query_params['user_id'])
        activities = Activity.objects.all()
        students = Students.objects.all()
        compiled_history = []
        for item in history.values():
            entry = {}
            activity = activities.get(pk=item['activity_id'])
            student = students.get(pk=item['student_id'])
            student_name = student.first_name + ' ' + student.last_name
            entry['datetime'] = str(item['history_date']).split('.')[0]
            entry['action'] = self.buildActionString(item['history_type'], 'attendance item')
            entry['values'] = self.buildAttendanceValuesString(item, activity, student_name)
            compiled_history.append(entry)
        return Response(compiled_history)
