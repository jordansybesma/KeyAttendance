from django.urls import path
from key.views import attendance, students, activities misc

urlpatterns = [
    path('', misc.ListStudents.as_view()),
    path('students/<int:pk>/', students.Students.as_view()),
    path('attendance', attendance.Attendance.as_view()),
    path('activities', activities.Activities.as_view()),
] 