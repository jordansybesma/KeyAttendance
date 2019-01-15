from rest_framework import serializers
from .models import Students, AttendanceItems, Reports

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'first_name',
            'last_name',
            'id',
            'first_attendance',
            'number_visits',
        )
        model = Students

class AttendanceItemSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'student_id',
            'date',
            'time',
            'activity_id',
            'id',
        )
        model = AttendanceItems


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'date',
            'daily_visits',
        )
        model = Reports