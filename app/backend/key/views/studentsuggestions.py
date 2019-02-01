from django.core import serializers
from ..models import Students as StudentModel
from ..models import StudentSuggestions, CitySpanStudents
from ..serializers import StudentSerializer, SuggestionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import time;

## TODO ##
# Implement patch - should save cityspan db from the csv austin puts in and avoid duplicate students
# Implement suggestion generator - needs to grab cityspan student names.
# Implement web interface - just place on admin page for now to test. Should have a search bar and a table of students with an edit button, 
#   where the edit button opens a modal that gives suggestions, allows users to search the cityspan students, or manually paste in the new
#   student key.
# Modify attendance sheet download function to grab and download student keys.

# Levenschtein implementation ruthlessly borrowed from https://www.python-course.eu/levenshtein_distance.php
def memoize(func):
    mem = {}
    def memoizer(*args, **kwargs):
        key = str(args) + str(kwargs)
        if key not in mem:
            mem[key] = func(*args, **kwargs)
        return mem[key]
    return memoizer

# This is fairly inefficient, but it works well for this purpose.
@memoize    
def levenshtein(s, t):
    if s == "":
        return len(t)
    if t == "":
        return len(s)
    if s[-1] == t[-1]:
        cost = 0
    else:
        cost = 1
        
    res = min([levenshtein(s[:-1], t)+1,
            levenshtein(s, t[:-1])+1, 
            levenshtein(s[:-1], t[:-1]) + cost])
    return res

def generateSuggestions(name, students):
    suggestions = []
    for student in students.keys():
        result = {"name":student, "editDistance":levenshtein(name, student)}
        suggestions.append(result)

    suggestions = sorted(suggestions, key=lambda item: item["editDistance"])
    return suggestions[0:3]

class StudentSuggestions(APIView):

    def validateGet(self, request, reqType):
        if reqType == 'suggestions':
            if 'id' in request.query_params:
                try:
                    # There needs to be a matching student to get suggestions.
                    StudentModel.objects.get(pk=int(request.query_params['id'])) 
                except Exception as e:
                    return False
        return True

    def get(self, request, reqType):
        if not self.validateGet(request, reqType):
            return Response({'error':'Invalid Parameters'}, status='400')

        if reqType == 'unmatchedStudents':
            students = StudentModel.objects.get(pk=request.query_params['id']).filter(student_key = None)
            serializer = StudentSerializer(students)
            Response(serializer.data, content_type='application/json')
        elif reqType == 'suggestions':
            return self.suggestions(request)
        else: # unknown request
            return Response({'error':'Not Found'}, status='404')

    def patch(self, request, reqType):
        if not self.validatePatch(request, reqType):
            return Response({'error':'Invalid Parameters'}, status='400')
        

    def suggestions(self, request):
        suggestions = StudentSuggestions.objects.get(pk=request.query_params['id'])
        if suggestions.count > 0:
            serializer = SuggestionSerializer(suggestions)
            return Response(serializer.data, content_type='application/json')
        else: # Generate our own suggestions
            print('t')