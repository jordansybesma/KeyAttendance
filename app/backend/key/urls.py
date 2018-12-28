from django.urls import path

from key.views import attendance, students, misc, users

urlpatterns = [
    path('', misc.ListStudents.as_view()),
    path('students/<int:pk>/', students.Students.as_view()),
    path('attendance', attendance.Attendance.as_view()),
    path('users/', users.Users.as_view())
] 
