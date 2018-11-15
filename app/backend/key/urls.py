from django.urls import path

from key.views import attendance, students

urlpatterns = [
    path('students/', students.Students.as_view()),
    path('attendance/', attendance.Attendance.as_view()),
] 
