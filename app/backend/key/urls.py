from django.urls import path, re_path

from key.views import attendance, students, misc, reports

urlpatterns = [
    path('', misc.ListStudents.as_view()),
    path('students/<int:pk>/', students.Students.as_view()),
    path('attendance', attendance.Attendance.as_view()),
    re_path(r'^reports/(?P<vizType>\w*)/$', reports.Reports.as_view())
    #above regex maps to: /api/reports/vizType/?arg1=blah&arg2=blah
] 
