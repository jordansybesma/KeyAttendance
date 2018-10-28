from django.urls import path

from key.views import attendance, misc

urlpatterns = [
    path('', misc.ListStudents.as_view()),
    path('<int:pk>/', misc.DetailStudents.as_view()),
    path('attendance', attendance.Attendance.as_view()),
] 