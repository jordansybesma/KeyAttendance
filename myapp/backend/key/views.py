from rest_framework import generics

from .models import Youth
from .serializers import YouthSerializer

# Create your views here.
class ListYouth(generics.ListCreateAPIView):
    queryset = Youth.objects.all()
    serializer_class = YouthSerializer


class DetailYouth(generics.RetrieveUpdateDestroyAPIView):
    queryset = Youth.objects.all()
    serializer_class = YouthSerializer
