from django.core import serializers
from ..models import Reports as ReportsModel
from ..models import AttendanceItems, Activity
from ..serializers import ReportSerializer, AttendanceItemSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..helpers import isValidDateTime, isValidTime
from django.db.models import Count
from django.db import models as models
from django.db.models import Q
import datetime

class Reports(APIView):

    # Creates a new datetime that matches the original datetime's hour
    def roundHour(self, dt):
        return datetime.time(hour=dt.hour)

    # Validate input for the.query_params request of this endpoint
    def validateGet(self, request, vizType):
        #need to check if vizType is a valid visualization type,
        #and check if params are valid against the selected vizType
        validateBool = False
        if(vizType == "individualHeatmap"):
            if 'startdate' in request.query_params and 'enddate' in request.query_params and 'student_id' in request.query_params:
                if isValidDateTime(request.query_params['startdate']) and isValidDateTime(request.query_params['enddate']):
                    if request.query_params['student_id'].isnumeric():
                        validateBool = True
        elif(vizType == "byHourAttendance"):
            if 'startdate' in request.query_params and 'enddate' in request.query_params:
                if isValidDateTime(request.query_params['startdate']) and isValidDateTime(request.query_params['enddate']):
                    validateBool = True
        elif(vizType == "byDayAttendance"):
            if 'startdate' in request.query_params and 'enddate' in request.query_params:
                if isValidDateTime(request.query_params['startdate']) and isValidDateTime(request.query_params['enddate']):
                    validateBool = True
        elif(vizType == "alternativeVizType"):
            if 'startdate' in request.query_params and 'enddate' in request.query_params:
                if isValidDateTime(request.query_params['startdate']) and isValidDateTime(request.query_params['enddate']):
                    validateBool = True
        elif(vizType == "byActivityAttendance"):
            if "startdate" in request.query_params and "enddate" in request.query_params and "activity" in request.query_params:
                if isValidDateTime(request.query_params['startdate']) and isValidDateTime(request.query_params['enddate']):
                    try:
                        Activity.objects.get(activity_id = request.query_params['activity'])
                        validateBool = True
                    except:
                        validateBool = False
        elif(vizType == "newStudents"):
            if "startdate" in request.query_params and "enddate" in request.query_params:
                if isValidDateTime(request.query_params['startdate']) and isValidDateTime(request.query_params['enddate']):
                    validateBool = True

        elif(vizType == "milestones"):
            if "startdate" in request.query_params and "enddate" in request.query_params and "milestone" in request.query_params:
                if isValidDateTime(request.query_params['startdate']) and isValidDateTime(request.query_params['enddate']):
                    try:
                        x = int(request.query_params['milestone'])
                        validateBool = True
                    except:
                        validateBool = False
                
        return validateBool
     
    def get(self, request, vizType):
        if not request.user.has_perm('key.view_reports'):
            return Response({'error':'You are not authorized to view reports.'}, status='401')
        if not self.validateGet(request, vizType):
            return Response({'error':'Invalid Parameters'}, status='400')

        if(vizType == "individualHeatmap"):
            student_id = request.query_params['student_id']
            startdate = request.query_params['startdate']
            enddate = request.query_params['enddate']
            #debugging
            # print("vizType: " + vizType)
            # print("params: " + student_id + ", " + startdate + ", " + enddate)
            #for value in request.query_params:
                #print ("%s" % (value))
            return self.retrieveIndividualHeatmapData(student_id, startdate, enddate)
        
        elif(vizType == "byHourAttendance"):
            startdate = request.query_params['startdate']
            enddate = request.query_params['enddate']
            return self.retrievebyHourAttendanceData(startdate, enddate)

        elif(vizType == "byDayAttendance"):
            startdate = request.query_params['startdate']
            enddate = request.query_params['enddate']
            return self.retrievebyDayAttendanceData(startdate, enddate)
            
        elif(vizType == "alternativeVizType"):
            startdate = request.query_params['startdate']
            enddate = request.query_params['enddate']
            return self.retrieveAttendanceDataInDateRange(startdate, enddate)

        elif (vizType == "byActivityAttendance"):
            startdate = request.query_params['startdate']
            enddate = request.query_params['enddate']
            activity = request.query_params['activity']
            return self.retrieveAttendanceByActivity(startdate, enddate, activity)

        elif (vizType == "newStudents"):
            startdate = request.query_params['startdate']
            enddate = request.query_params['enddate']
            return self.retrieveNewStudentIDs(startdate, enddate)

        elif (vizType == "milestones"):
            startdate = request.query_params['startdate']
            enddate = request.query_params['enddate']
            milestone = request.query_params['milestone']
            return self.retrieveAttendanceMilestones(startdate, enddate, milestone)

    # Get students who attended the key for the nth time between startdate and enddate
    def retrieveAttendanceMilestones(self, startdate, enddate, milestone):
        milestoneStudentIDs = []
        counts = {}
        inRange = AttendanceItems.objects.filter(activity_id=7).filter(date__range=[startdate, enddate])
        outOfRange = AttendanceItems.objects.filter(activity_id=7).filter(date__lt=startdate)
        for item in inRange:
            if counts.get(item.student_id, None) == None:
                outRangeCount = len(outOfRange.filter(student_id = item.student_id))
                counts[item.student_id] = {'inRange': 1, 'outRange': outRangeCount}
            else:
                counts[item.student_id]['inRange'] += 1
        
        for k,v in counts.items():
            if int(milestone) > v['outRange'] and int(milestone) <= v['outRange'] + v['inRange']:
                milestoneStudentIDs.append(k)

        return Response({"milestoneStudents": milestoneStudentIDs}, content_type='application/json')

    # Get students who attended the key for the first time within range
    def retrieveNewStudentIDs(self, startdate, enddate):
        newStudentIDs = []
        inRange = AttendanceItems.objects.filter(date__range=[startdate, enddate])
        outOfRange = AttendanceItems.objects.filter(date__lt=startdate)
        for item in inRange:
            # Try to find an attendance item outside of range
            if len(outOfRange.filter(student_id=item.student_id)) == 0:
                newStudentIDs.append(item.student_id)
        return Response({"newStudents": newStudentIDs}, content_type='application/json')
    
    # Get attendance items with a given activity_id within a given date range, return to client
    def retrieveAttendanceByActivity(self, startdate, enddate, activity):
        items = AttendanceItems.objects.filter(activity_id=activity).filter(date__range=[startdate, enddate])
        serializer = AttendanceItemSerializer(items, many=True)
        return Response(serializer.data, content_type='application/json')

    # Query databases for data pertaining to a particular student's attendance heatmap
    # Could possibly use attendance model + view here ... instead of reports model
    # as (reports model is basically a copy of attendance model, querying dailyattendance db)
    def retrieveIndividualHeatmapData(self, student_id, startdate, enddate):
        allAttendanceItems = ReportsModel.objects.all().values("student_id", "date")
        allAttendanceItems = allAttendanceItems.order_by('date')
        studentItems = allAttendanceItems.filter(student_id=student_id)
        studentItems = studentItems.filter(date__range=[startdate, enddate])
        studentItems = studentItems.values('date').annotate(daily_visits = Count('student_id'))
        serializer = ReportSerializer(studentItems, many=True)
        return Response(serializer.data, content_type='application/json')

    # Query databases for Key-wide attendance data, aggregated by hour in a specified one wk timeframe
    # Could possibly use attendance model + view here ... instead of reports model
    # as (reports model is basically a copy of attendance model, querying dailyattendance db)
    def retrievebyHourAttendanceData(self, startdate, enddate):
        lookup = {}
        toReturn = []
        allAttendanceItems = ReportsModel.objects.all().values("student_id", "date", "time")
        allAttendanceItems = allAttendanceItems.filter(date__range=[startdate, enddate])

        # Group by date and rounded time and count
        for item in allAttendanceItems:
            roundedTime = self.roundHour(item['time'])
            if lookup.get(item['date']) == None:
                lookup[item['date']] = {}
            if lookup[item['date']].get(roundedTime) == None:
                lookup[item['date']][roundedTime] = 0
            lookup[item['date']][roundedTime] += 1

        # Create list item from computed aggregates
        for date,v in lookup.items():
            for time, count in v.items():
                toReturn.append({'date':date, 'time':time, 'count':count})

        # Sort the resulted list by date then time, ascending
        toReturn = sorted(toReturn, key=lambda item: (item['date'], item['time']))
        return Response(toReturn, content_type='application/json')

    def retrievebyDayAttendanceData(self, startdate, enddate):
        allAttendanceItems = ReportsModel.objects.all().values("date")
        allAttendanceItems = allAttendanceItems.order_by('date')
        allAttendanceItems =  allAttendanceItems.filter(date__range=[startdate, enddate])
        allAttendanceItems =  allAttendanceItems.values('date').annotate(daily_visits = Count('student_id'))
        serializer = ReportSerializer( allAttendanceItems, many=True)
        return Response(serializer.data, content_type='application/json')
    
    #Test method to represent an alternative visualization type
    def retrieveAttendanceDataInDateRange(self, startdate, enddate):
        allAttendanceItems = ReportsModel.objects.all().order_by('date')
        allAttendanceItems = allAttendanceItems.filter(date__range=[startdate, enddate])
        serializer = ReportSerializer(allAttendanceItems, many=True)
        return Response(serializer.data, content_type='application/json')


