from rest_framework import serializers
from .models import Youth

class YouthSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'name',
            'key',
        )
        model = Youth