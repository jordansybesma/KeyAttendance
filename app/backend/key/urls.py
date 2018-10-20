from django.urls import path

from . import views

urlpatterns = [
    path('', views.ListStudents.as_view()),
    path('<int:pk>/', views.DetailStudents.as_view()),
]