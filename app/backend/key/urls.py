from django.urls import path

from key.views import attendance, students, activities, users, groups, permissions

urlpatterns = [
    path('activities/', activities.Activities.as_view()),
    path('students/', students.Students.as_view()),
    path('attendance/', attendance.Attendance.as_view()),
    path('users/', users.Users.as_view()),
    path('groups/', groups.Groups.as_view()),
    path('permissions/', permissions.Permissions.as_view())
] 