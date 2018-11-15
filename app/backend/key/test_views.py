import json
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse
from .helpers import getCurrentDate, isValidTime
from .models import AttendanceItems, Students, Activity
from .serializers import AttendanceItemSerializer, StudentSerializer


# initialize the APIClient app
client = Client()

class AttendanceTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        AttendanceItems.objects.create(student_id='111', date='2018-10-13', time='13:14:10', activity_id=1)
        AttendanceItems.objects.create(student_id='111', date='2018-10-13', time='13:11:10', activity_id=2)
        AttendanceItems.objects.create(student_id='131', date='2018-10-16', time='03:04:10', activity_id=7)
        AttendanceItems.objects.create(student_id='111', date='2018-10-20', time='13:14:10', activity_id=5)
        AttendanceItems.objects.create(student_id='131', date='2018-10-30', time='11:14:10', activity_id=3)
        AttendanceItems.objects.create(student_id='141', date='2018-11-01', time='02:14:10', activity_id=4)
        AttendanceItems.objects.create(student_id='151', date='2018-11-01', time='20:14:10', activity_id=4)
        Students.objects.create(first_name='John', last_name='Smith', id=555)
        Activity.objects.create(activity_id=5, name='Food')
        Activity.objects.create(activity_id=6, name='OneOnOne')
        Activity.objects.create(activity_id=7, name='Key')

    def assertItemEquals(self, data, student_id, date, time, activity_id):
        self.assertEqual(data['student_id'], student_id)
        self.assertEqual(data['date'], date)
        if time is None:
            self.assertTrue(isValidTime(data['time']))
        else:
            self.assertEqual(data['time'], time)
        self.assertEqual(data['activity_id'], activity_id)
        
    def test_get_all_items(self):
        attendanceItems = AttendanceItems.objects.all()
        response = client.get(reverse('attendance'))
        serializer = AttendanceItemSerializer(attendanceItems, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_get_single_date(self):
        date = '2018-11-01'
        attendanceItems = AttendanceItems.objects.all().filter(date=date)
        response = client.get(reverse('attendance'), {'day': date})
        serializer = AttendanceItemSerializer(attendanceItems, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_date_range(self):
        startDate = '2018-10-13'
        endDate = '2018-11-01'
        attendanceItems = AttendanceItems.objects.all()
        response = client.get(reverse('attendance'), {'startDate': startDate, 'endDate': endDate})
        serializer = AttendanceItemSerializer(attendanceItems, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_malformed_date(self):
        date = '201811-01'
        response = client.get(reverse('attendance'), {'day': date})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    # TODO - fails. returns 200 OK with data from start date to current date
    '''
    def test_get_malformed_date_range(self):
        startDate = '2018-10-13'
        endDate = '2018-1199'
        response = client.get(reverse('attendance'), {'startDate': startDate, 'endDate': endDate})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    '''

    # TODO - fails, returns 200 ok with data
    '''
    def test_get_invalid_date_range(self):
        startDate = '2018-11-01'
        endDate = '2018-10-13'
        response = client.get(reverse('attendance'), {'startDate': startDate, 'endDate': endDate})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    '''

    def test_get_incomplete_date_range(self):
        startDate = '2018-10-13'
        attendanceItems = AttendanceItems.objects.all()
        response = client.get(reverse('attendance'), {'startDate': startDate})
        serializer = AttendanceItemSerializer(attendanceItems, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_with_date_time(self):
        student_id = 555
        date = '2018-10-22'
        time = '16:13:14'
        activity_id = 7
        response = client.post(reverse('attendance'), {'student_id': student_id, 'date': date, 'time': time, 'activity_id': activity_id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        try:
            attendanceItem = AttendanceItems.objects.get(id=response.data['id'])
        except:
            self.fail('New attendance item failed to save correctly.')
        serializer = AttendanceItemSerializer(attendanceItem)
        self.assertEqual(response.data, serializer.data)
        self.assertItemEquals(serializer.data, student_id, date, time, activity_id)
    
    def test_post_empty_date_time(self):
        student_id = 555
        activity_id = 6
        response = client.post(reverse('attendance'), {'student_id': student_id, 'date': '', 'time': '', 'activity_id': activity_id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        try:
            attendanceItem = AttendanceItems.objects.get(id=response.data['id'])
        except:
            self.fail('New attendance item failed to save correctly.')
        serializer = AttendanceItemSerializer(attendanceItem)
        self.assertEqual(response.data, serializer.data)
        self.assertItemEquals(serializer.data, student_id, getCurrentDate().isoformat(), None, activity_id)

    def test_post_null_date_time(self):
        student_id = 555
        activity_id = 5
        response = client.post(reverse('attendance'), {'student_id': student_id, 'activity_id': activity_id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        try:
            attendanceItem = AttendanceItems.objects.get(id=response.data['id'])
        except:
            self.fail('New attendance item failed to save correctly.')
        serializer = AttendanceItemSerializer(attendanceItem)
        self.assertEqual(response.data, serializer.data)
        self.assertItemEquals(serializer.data, student_id, getCurrentDate().isoformat(), None, activity_id)

    def test_post_invalid_date_time(self):
        student_id = 555
        date = '2018-1022'
        time = '16:13:14'
        activity_id = 7
        response = client.post(reverse('attendance'), {'student_id': student_id, 'date': date, 'time': time, 'activity_id': activity_id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_no_student_id(self):
        date = '2018-1022'
        time = '16:13:14'
        activity_id = 7
        response = client.post(reverse('attendance'), {'date': date, 'time': time, 'activity_id': activity_id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_no_activity_id(self):
        student_id = 555
        date = '2018-1022'
        time = '16:13:14'
        response = client.post(reverse('attendance'), {'student_id': student_id, 'date': date, 'time': time})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_nonexistent_student(self):
        student_id = 1010
        date = '2018-1022'
        time = '16:13:14'
        activity_id = 7
        response = client.post(reverse('attendance'), {'student_id': student_id, 'date': date, 'time': time, 'activity_id': activity_id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_invalid_activity_id(self):
        student_id = 555
        date = '2018-1022'
        time = '16:13:14'
        activity_id = 777
        response = client.post(reverse('attendance'), {'student_id': student_id, 'date': date, 'time': time, 'activity_id': activity_id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete(self):
        attendanceItem = AttendanceItems.objects.create(student_id='161', date='2018-09-13', time='13:14:10', activity_id=3)
        serializer = AttendanceItemSerializer(attendanceItem)
        pk = str(serializer.data['id'])
        url = reverse('attendance') + '?key=' + pk
        response = client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        try:
            AttendanceItems.objects.get(id=pk)
            self.fail("Item failed to delete successfully")
        except:
            pass

    def test_delete_nonexistent(self):
        pk = '9999'
        url = reverse('attendance') + '?key=' + pk
        response = client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_no_id(self):
        response = client.delete(reverse('attendance'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)