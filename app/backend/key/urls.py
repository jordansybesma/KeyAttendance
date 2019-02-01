from django.urls import path, re_path

from key.views import attendance, students, activities, users, studentsuggestions

urlpatterns = [
    path('activities/', activities.Activities.as_view()),
    path('students/', students.Students.as_view()),
    path('attendance/', attendance.Attendance.as_view()),
    path('users/', users.Users.as_view()),
    re_path(r'^studentsuggestions/(?P<reqType>\w*)/$', studentsuggestions.StudentSuggestions.as_view())
] 