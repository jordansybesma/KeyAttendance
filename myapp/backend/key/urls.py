from django.urls import path

from . import views

urlpatterns = [
    path('', views.ListYouth.as_view()),
    path('<int:pk>/', views.DetailYouth.as_view()),
]