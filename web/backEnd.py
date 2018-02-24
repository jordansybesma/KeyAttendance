import json
import psycopg2
import sys
import datetime
import flaskEnd

from flask import Flask, request, redirect, url_for
from werkzeug.utils import secure_filename






def executeSingleQuery(query, params = [], fetch = False):
    print(query, params)
    dbName = 'keyDB'
    user = 'ubuntu'
    password = 'keyComps'
    hostName = 'ec2-34-213-2-88.us-west-2.compute.amazonaws.com'
    conn = psycopg2.connect(database=dbName, user=user, password=password, host=hostName)
    cur = conn.cursor()
    if len(params) == 0:
        cur.execute(query)
    else:
        cur.execute(query, params)
    conn.commit()
    result = cur.fetchall() if fetch else  None
    cur.close()
    conn.close()
    return result


def getReports():
    return uniqueAttendance()





#assuming dailyAttendance will have new column number_attendances
# return the ids of students who attended the numAttenth time in the last numDays
def getNumberAttended(string):
    valueList = string.split()
    startDate = valueList[0]
    endDate = valueList[1]
    numAtten = valueList[2]

    '''now = datetime.datetime.now()
    today = transformDate(now)
    before = datetime.datetime.now() - datetime.timedelta(days=numDays)
    prev = transformDate(before)'''

    #Here we could grab actual student names - maybe thats what we want to do...

    queryCreate = "SELECT DISTINCT(student_id) INTO temp1 FROM dailyAttendance WHERE date <= \'" + endDate + "\' AND date >= \'" + startDate + "\' AND visit_number = " + str(numAtten) + ";"

    queryCreate = queryCreate + " SELECT temp1.student_id, students.first_name, students.last_name INTO temp2 FROM temp1 LEFT JOIN students ON temp1.student_id = students.id;"

    executeSingleQuery(queryCreate, [])
    querySelect = "SELECT * FROM temp2;"

    results = json.dumps(executeSingleQuery(querySelect, fetch = True), indent=4, sort_keys=True, default=str)
    queryDrop = "DROP TABLE temp1; DROP TABLE temp2;"
    executeSingleQuery(queryDrop, [])
    return results







def getFirstAttendanceDates(dates):
    
    dateList = dates.split()
    start = dateList[0]
    end = dateList[1]
    
    query = "SELECT first_name, last_name FROM students WHERE first_attendance <= \'" + end + "\' AND first_attendance >= \'" + start + "\';"
    
    return json.dumps(executeSingleQuery(query, fetch = True), indent=4, sort_keys=True, default=str)

#Could be combined with unique table probably...
def getFirstAttendance():
    #first - lets get unique students for the last week, month, 6 months, year
    now = datetime.datetime.now() - datetime.timedelta(days=1)
    today = transformDate(now)
    lastWeek = datetime.datetime.now() - datetime.timedelta(days=8)
    week = transformDate(lastWeek)
    lastMonth = datetime.datetime.now() - datetime.timedelta(days=31)
    month = transformDate(lastMonth)
    lastYear = datetime.datetime.now() - datetime.timedelta(days=366)
    year = transformDate(lastYear)



    dates = [week, month, year]

    queryWeek = "SELECT COUNT(DISTINCT id) FROM students WHERE first_attendance <= \'" + today + "\' AND first_attendance > \'" + week + "\'"
    queryMonth = "SELECT COUNT(DISTINCT id) FROM students WHERE first_attendance <= \'" + today + "\' AND first_attendance > \'" + month + "\'"
    queryYear = "SELECT COUNT(DISTINCT id) FROM students WHERE first_attendance <= \'" + today + "\' AND first_attendance > \'" + year + "\'"


    tableCreate = "CREATE TABLE firstAtten (week int, month int, year int);"
    addAttendees = "INSERT INTO firstAtten VALUES ((" + queryWeek + "), (" + queryMonth + "), (" + queryYear + "));"
    queryTotal = tableCreate + " " + addAttendees + " "


    executeSingleQuery(queryTotal, [])

    querySelect = "SELECT * FROM firstAtten;"

    returnVal = json.dumps(executeSingleQuery(querySelect, fetch = True), indent=4, sort_keys=True, default=str)

    queryDrop = "DROP TABLE firstAtten;"
    executeSingleQuery(queryDrop, [])

    return returnVal

def uniqueAttendance():

    #first - lets get unique students for the last week, month, 6 months, year
    now = datetime.datetime.now() - datetime.timedelta(days=1)
    today = transformDate(now)
    lastWeek = datetime.datetime.now() - datetime.timedelta(days=8)
    week = transformDate(lastWeek)
    lastMonth = datetime.datetime.now() - datetime.timedelta(days=31)
    month = transformDate(lastMonth)
    lastYear = datetime.datetime.now() - datetime.timedelta(days=366)
    year = transformDate(lastYear)

    queryColumns = "SELECT activity_id, name FROM activities WHERE is_showing = 'true' ORDER BY ordering;"
    columnResults = json.dumps(executeSingleQuery(queryColumns, fetch=True))
    columns =json.loads(columnResults)

    dates = [week, month, year]

    queryWeek = "SELECT COUNT(DISTINCT student_id) FROM dailyAttendance WHERE date <= \'" + today + "\' AND date > \'" + week + "\'"
    queryMonth = "SELECT COUNT(DISTINCT student_id) FROM dailyAttendance WHERE date <= \'" + today + "\' AND date > \'" + month + "\'"
    queryYear = "SELECT COUNT(DISTINCT student_id) FROM dailyAttendance WHERE date <= \'" + today + "\' AND date > \'" + year + "\'"


    tableCreate = "CREATE TABLE uniqueAtten (name varchar(100), week int, month int, year int);"
    addAttendees = "INSERT INTO uniqueAtten VALUES (\'Number Who Attended\', (" + queryWeek + "), (" + queryMonth + "), (" + queryYear + "));"
    queryTotal = tableCreate + " " + addAttendees + " "

    for i in range(len(columns)):
        colName = columns[i][1]
        colID = columns[i][0]
        queryInsert = "INSERT INTO uniqueAtten VALUES (\'" + colName + "\'"
        for j in range(3):
            date = dates[j]
            queryCount = "SELECT COUNT(DISTINCT student_id) FROM dailyAttendance WHERE date <= \'" + today + "\' AND date > \'" + date + "\'"
            queryCount = queryCount + " AND activity_id = " + str(colID) + ""
            queryInsert = queryInsert + ", (" + queryCount + ")"
        queryInsert = queryInsert + ");"
        queryTotal = queryTotal + " " + queryInsert + " "

    executeSingleQuery(queryTotal, [])

    querySelect = "SELECT * FROM uniqueAtten;"

    returnVal = json.dumps(executeSingleQuery(querySelect, fetch = True), indent=4, sort_keys=True, default=str)

    queryDrop = "DROP TABLE uniqueAtten;"
    executeSingleQuery(queryDrop, [])
    return returnVal





def transformDate(date):
    newDate = ""
    newDate = newDate + str(date.year)
    newDate = newDate + "-" + str(date.month)
    newDate = newDate + "-" + str(date.day)
    return newDate


# Gets student attendance data (date + time)
def getStudentAttendance(student):
    print("got here")
    nameList = student.split()
    first = nameList[0]
    last = nameList[1]
    queryID = "SELECT id FROM students WHERE first_name = \'" + first + "\' AND last_name = \'" + last + "\';"
    studentID = json.loads(json.dumps(executeSingleQuery(queryID, fetch=True)))[0][0]
    queryAttendance = "SELECT DISTINCT date, time FROM dailyattendance WHERE student_id = " + str(studentID) + ";"

    return json.dumps(executeSingleQuery(queryAttendance, fetch = True), indent=4, sort_keys=True, default=str)

    #return getStudentInfo(studentID)

def fixShit():
    queryStudData = "SELECT * FROM tempStudents;"
    students = json.loads(json.dumps(executeSingleQuery(queryStudData, fetch = True), indent=4, sort_keys=True, default=str))
    queryCreate = "CREATE TABLE students (first_name text NOT NULL, last_name text NOT NULL, id integer NOT NULL, first_attendance date, number_visits int);"
    executeSingleQuery(queryCreate, [])
    queryTotal = ""
    for i in range(len(students)):
        queryInsert = "INSERT INTO students VALUES (\'" + students[i][0]
        queryInsert = queryInsert + "\', \'" + students[i][1] + "\', " + students[i][2] + ", " + students[i][3] + ", " + students[i][4] + ");"
        queryTotal = queryTotal + " " + queryInsert
    executeSingleQuery(queryTotal, [])
    return "done"
            



# Put the data in a format similar to how it is presented in javascript
#Input: date
#Output: all activity data for a specific date
def getAttendance(date):
    totalQuery = "SELECT DISTINCT student_id, time INTO temp0 FROM dailyattendance WHERE date = \'" + date + "\' AND activity_id = -1;"
    queryAddName= "SELECT temp0.student_id, temp0.time, students.first_name, students.last_name INTO temp1 "
    queryAddName = queryAddName + "FROM temp0 LEFT JOIN students ON temp0.student_id = students.id;"
    totalQuery = totalQuery + queryAddName
    #executeSingleQuery(query1, [])

    queryColumns = "SELECT activity_id, name FROM activities WHERE is_showing = 'true' ORDER BY ordering;"
    columnResults = json.dumps(executeSingleQuery(queryColumns, fetch=True))
    columns =json.loads(columnResults)
    newTable = "temp1"
    tempCount = 1

    for i in range(len(columns)):
        name = columns[i][1]
        colID = columns[i][0]
        tempCount = tempCount + 1
        rightTable = "temp" + str(tempCount)

        queryTemp = "SELECT DISTINCT student_id, activity_id INTO " + rightTable + " FROM dailyattendance WHERE date = \'" + date
        queryTemp = queryTemp + "\' AND activity_id = " + str(colID) + ";"
        #executeSingleQuery(queryTemp, [])

        leftTable = newTable
        tempCount = tempCount + 1
        newTable = "temp" + str(tempCount)
        queryJoin = "SELECT " + leftTable + ".student_id, "+ leftTable + ".time, " + leftTable + ".first_name, " + leftTable + ".last_name, "


        if (i > 0):
            for act in range(1, i + 1):
                queryJoin = queryJoin + leftTable + ".act" + str(act) + ", "


        queryJoin = queryJoin + rightTable + ".activity_id as act" + str(i + 1) + " INTO "
        queryJoin = queryJoin + newTable + " FROM " + leftTable + " LEFT JOIN "
        queryJoin = queryJoin + rightTable + " ON " + leftTable + ".student_id = " + rightTable + ".student_id;"
        totalQuery = totalQuery + " " + queryTemp + " " + queryJoin

    executeSingleQuery(totalQuery, [])

    returnQuery = "SELECT * FROM " + newTable + " ORDER BY time;"

    result = json.dumps(executeSingleQuery(returnQuery, fetch = True), indent=4, sort_keys=True, default=str)
    print(result)
    #return result

    queryDrop = ""

    for table in range(0, tempCount + 1):
        queryDrop = queryDrop + "DROP TABLE temp" + str(table) + "; "
    executeSingleQuery(queryDrop, [])

    return result


#Add new student to system
#Input: first name and last name
#Output: none
def addNewStudent(request):
    firstName = request.form.get('firstName')
    lastName  = request.form.get('lastName')
    now = datetime.datetime.now()
    today = transformDate(now)

    
    
    queryIDs = "SELECT id FROM students ORDER BY id DESC"
    ids = json.loads(json.dumps(executeSingleQuery(queryIDs, fetch = True), indent=4, sort_keys=True, default=str))
    largeID = ids[0][0]
    newID = largeID + 1
    
    
    #executeSingleQuery("INSERT INTO students VALUES (\'" + firstName + "\', \'" + lastName + "\', " + str(newID) + ");", [])
    executeSingleQuery("INSERT INTO students VALUES (\'" + firstName + "\', \'" + lastName + "\');", [])
    
    
    #queryUpdateID = "UPDATE students SET id = " + newID + "WHERE first_name = \'" + firstName + "\', AND last_name = \'" + lastName + "\';"
    #executeSingleQuery(queryUpdateID, [])
    
    queryUpdate = "UPDATE students SET first_attendance = \'" + today + "\', number_visits = 0 WHERE first_name = \'" + firstName + "\' AND last_name = \'" + lastName + "\';"
    executeSingleQuery(queryUpdate, [])
    return "\nHello frontend:)\n"


#Add info on a student
#Input: name (first and last concatenated
#column name
#value - aka data to be entered for that column
#Output: None
def updateStudentInfo(request):
    name = request.form.get('name')
    nameList = name.split()
    first = nameList[0]
    last = nameList[1]
    col = request.form.get('column')
    value = request.form.get('value')
    queryColID = "SELECT info_id FROM studentcolumns WHERE name = \'" + col + "\';"

    colID = json.loads(json.dumps(executeSingleQuery(queryColID, fetch=True)))
    print(colID)
    colID = colID[0][0]


    queryID = "SELECT id FROM students WHERE first_name = \'" + first + "\' AND last_name = \'" + last + "\';"
    studentID = json.loads(json.dumps(executeSingleQuery(queryID, fetch=True)))[0][0]
    queryDelete = "DELETE FROM studentinfo WHERE student_id = " + str(studentID) + " AND info_id = " + str(colID) + ";"

    queryColumnName = "SELECT name, type FROM studentcolumns WHERE info_id = + " + str(colID) + ";"
    nameResult = json.dumps(executeSingleQuery(queryColumnName, fetch=True))
    columnInfo =json.loads(nameResult)
    columnName = columnInfo[0][0]
    columnType = columnInfo[0][1]

    colName = ""
    if (value == ""):
        value = "null"

    if (columnType == "varchar"):
        colName = "str_value"
        if (value != "null"):
            value = "\'" + value + "\'"
    elif (columnType == "int"):
        colName = "int_value"
    elif (columnType == "boolean"):
        colName = "bool_value"
        
        curVal = json.loads(json.dumps(executeSingleQuery("SELECT bool_value FROM studentInfo WHERE student_id = " + str(studentID) + " AND activity_id = " + str(colID) + ";", [])))
        if (len(curVal) == 0):
            value = 'true'
        else:
            if (curVal[0][0] == False):
                value = 'true'
            else:
                value = 'false'
                
        
    elif (columnType == "date"):
        colName = "date_value"
        if (value != "null"):
            value = "\'" + value + "\'"
    elif (columnType == "boolean"):
        colName = "time_value"
        if (value != "null"):
            value = "\'" + value + "\'"



    queryUpdate = "INSERT INTO studentinfo (student_id, info_id, " + colName
    queryUpdate = queryUpdate + ") VALUES (" + str(studentID) + ", " + str(colID) + ", " + value + ");"

    queryTotal = queryDelete + " " + queryUpdate
    executeSingleQuery(queryTotal,[])
    return "done"


# create full table for student data
##NEEDS to be implemented in flaskEnd.py
#Input: none
#Output: all student data concatenated in one table
def createStudentInfoTable(request):

    totalQuery = "SELECT DISTINCT id INTO temp1 FROM students;"
    #executeSingleQuery(query1, [])

    queryColumns = "SELECT info_id, name, type FROM studentcolumns WHERE is_showing = 'true' ORDER BY info_id;"
    columnResults = json.dumps(executeSingleQuery(queryColumns, fetch=True))
    columns =json.loads(columnResults)
    newTable = "temp1"
    tempCount = 1

    for i in range(len(columns)):
        name = columns[i][1]
        colID = columns[i][0]
        colType = columns[i][2]
        tempCount = tempCount + 1
        rightTable = "temp" + str(tempCount)
        # key difference - select from differnt column based on type
        colToSelect = ""
        if (colType == "varchar"):
            colToSelect = "str_value"
        elif (colType == "int"):
            colToSelect = "int_value"
        elif (colType == "boolean"):
            colToSelect = "bool_value"
        elif (colType == "date"):
            colToSelect = "date_value"
        elif (colType == "boolean"):
            colToSelect = "time_value"

        queryTemp = "SELECT DISTINCT student_id, " +  colToSelect + " INTO " + rightTable + " FROM studentinfo WHERE info_id = " + str(colID) + ";"
        #executeSingleQuery(queryTemp, [])

        leftTable = newTable
        tempCount = tempCount + 1
        newTable = "temp" + str(tempCount)
        queryJoin = "SELECT " + leftTable + ".id, "


        if (i > 0):
            for act in range(1, i + 1):
                queryJoin = queryJoin + leftTable + ".act" + str(act) + ", "


        queryJoin = queryJoin + rightTable + "." + colToSelect + " as act" + str(i + 1) + " INTO "
        queryJoin = queryJoin + newTable + " FROM " + leftTable + " LEFT JOIN "
        queryJoin = queryJoin + rightTable + " ON " + leftTable + ".id = " + rightTable + ".id;"
        totalQuery = totalQuery + " " + queryTemp + " " + queryJoin

    executeSingleQuery(totalQuery, [])

    returnQuery = "SELECT * FROM " + newTable + ";"

    result = json.dumps(executeSingleQuery(returnQuery, fetch = True), indent=4, sort_keys=True, default=str)
    print(result)
    #return result

    queryDrop = ""

    for table in range(1, tempCount + 1):
        queryDrop = queryDrop + "DROP TABLE temp" + str(table) + "; "
    executeSingleQuery(queryDrop, [])

    return result


# the same process as entire table, but for just one student
#Input: student ID
#Output: all info on said student - in one row
#totalQuery = "SELECT DISTINCT id INTO temp1 FROM students WHERE id = " + str(studID) + ";"
#queryTemp = "SELECT DISTINCT id, " +  columnToSelect + " INTO " + rightTable + " FROM students WHERE activity_id = " + str(colID)
#        queryTemp = queryTemp + " AND id = " + str(studID) +  ";"
def getStudentInfo(name):
    totalQuery = "SELECT DISTINCT id INTO temp1 FROM students;"
    #executeSingleQuery(query1, [])
    nameList = name.split()
    first = nameList[0]
    last = nameList[1]
    queryID = "SELECT id FROM students WHERE first_name = \'" + first + "\' AND last_name = \'" + last + "\';"
    studentID = json.loads(json.dumps(executeSingleQuery(queryID, fetch=True)))[0][0]

    queryColumns = "SELECT info_id, name, type FROM studentcolumns WHERE is_showing = 'true' ORDER BY info_id;"
    columnResults = json.dumps(executeSingleQuery(queryColumns, fetch=True))
    columns =json.loads(columnResults)
    newTable = "temp1"
    tempCount = 1

    for i in range(len(columns)):
        name = columns[i][1]
        colID = columns[i][0]
        colType = columns[i][2]
        tempCount = tempCount + 1
        rightTable = "temp" + str(tempCount)
        # key difference - select from differnt column based on type
        colToSelect = ""
        if (colType == "varchar"):
            colToSelect = "str_value"
        elif(colType == "varchar(500)"):
            colToSelect = "str_value"
        elif (colType == "int"):
            colToSelect = "int_value"
        elif (colType == "boolean"):
            colToSelect = "bool_value"
        elif (colType == "date"):
            colToSelect = "date_value"
        elif (colType == "boolean"):
            colToSelect = "time_value"

        queryTemp = "SELECT DISTINCT student_id, " +  colToSelect + " INTO " + rightTable + " FROM studentinfo WHERE info_id = " + str(colID) + ";"
        #executeSingleQuery(queryTemp, [])

        leftTable = newTable
        tempCount = tempCount + 1
        newTable = "temp" + str(tempCount)
        queryJoin = "SELECT " + leftTable + ".id, "


        if (i > 0):
            for act in range(1, i + 1):
                queryJoin = queryJoin + leftTable + ".act" + str(act) + ", "


        queryJoin = queryJoin + rightTable + "." + colToSelect + " as act" + str(i + 1) + " INTO "
        queryJoin = queryJoin + newTable + " FROM " + leftTable + " LEFT JOIN "
        queryJoin = queryJoin + rightTable + " ON " + leftTable + ".id = " + rightTable + ".student_id;"
        totalQuery = totalQuery + " " + queryTemp + " " + queryJoin

    executeSingleQuery(totalQuery, [])

    returnQuery = "SELECT * FROM " + newTable + " WHERE id = " + str(studentID) + ";"

    result = json.dumps(executeSingleQuery(returnQuery, fetch = True), indent=4, sort_keys=True, default=str)
    print(result)
    #return result

    queryDrop = ""

    for table in range(1, tempCount + 1):
        queryDrop = queryDrop + "DROP TABLE temp" + str(table) + "; "
    executeSingleQuery(queryDrop, [])

    return result


#Create new category for studentinfo
#input: name, type
#Output: nothing
def addStudentColumn(request):
    #make sure column name not in use
    name = request.form.get("name")
    colType = request.form.get("type")
    definedOptions = request.form.get("definedOptions")



    #query = "INSERT INTO studentColumns VALUES ('true','false', '" + name + "', '"+ colType + "', '" + definedOptions + "');"
    #queryAttendance = "ALTER TABLE students ADD " + name + " " + colType + ";"
    query = "INSERT INTO studentcolumns (is_showing, quick_add, name, type) VALUES ("
    query = query + "'true', 'false', '" + name + "', '" + colType + "');"

    executeSingleQuery(query, [])
    #executeSingleQuery(queryAttendance, [])
    return "done"


# INPUTS HAVE CHANGED
#Input: name = column name, column =  isshowing/isquick
#Output: nothing
def alterStudentColumn(request):
    name = request.form.get("name")
    column = request.form.get("column")

    queryStatus = "SELECT " + column + " FROM studentColumns WHERE name = '" + name + "';"
    result = json.dumps(executeSingleQuery(queryStatus,fetch = True))
    newResult =json.loads(result)
    isChecked = newResult[0][0]

    if (isChecked):
        query = "UPDATE studentColumns SET " + column + "  = 'false' WHERE name = '" + name + "';"
    else:
        query = "UPDATE studentColumns SET " + column + "  = 'true' WHERE name = '" + name + "';"
    executeSingleQuery(query, [])
    return "done"



#This method might not be neccessary anymore
def deleteStudentColumn(request):
    name = request.form.get("name")
    query = "DELETE FROM studentColumns WHERE name = '" + name + "';"
    query2 = "ALTER TABLE students DROP COLUMN " + name + ";"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])
    name = request.form.get("name")
    query = "UPDATE studentColumns SET is_showing  = 'false' WHERE name = '" + name + "';"
    query2 = "UPDATE studentColumns SET quick_add  = 'false' WHERE name = '" + name + "';"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])


#Get student column info
#Input: nothing
#Output: contents of studentColumns table
def getStudentColumns():
    query = "SELECT * FROM studentcolumns ORDER BY info_id"
    return json.dumps(executeSingleQuery(query, fetch = True), indent=4, sort_keys=True, default=str)


#Not sure if this will end up being in use
def sendFeedback(request):
    feedback = request.form.get('feedback')
    date = request.form.get('date')
    query = "INSERT INTO feedback VALUES ('" + date +"', '" + feedback + "');"
    executeSingleQuery(query,[])




# Theoretically not necessary anymore
# def getAttendance(date):
#     queryColumns = "SELECT name FROM attendanceColumns ORDER BY ordering;"
#     cols = json.dumps(executeSingleQuery(queryColumns, fetch = True), indent=4, sort_keys=True, default=str)
#     colList = json.loads(cols) # this is strange... anyone have any idea why?
#     query = "SELECT firstName, lastName, time, " + colList[0][0];
#     for i in range(1, len(colList)):
#         query = query + ", " + colList[i][0]
#     query = query + " FROM dailyAttendance WHERE date= '" + date + "' ORDER BY time ASC;"
#
#     queryResult = executeSingleQuery(query, fetch = True)
#     result = json.dumps(queryResult, indent=4, sort_keys=True, default=str)
#     return result




# Not currently in use I think
# def getLogin(login):
#     nameList = login.split()
#     user = nameList[0]
#     password = nameList[1]
#     query = "SELECT * FROM login WHERE username = '" + user + "' AND password = '" + password + "';"
#     return json.dumps(executeSingleQuery(query,
#         fetch = True), indent=4, sort_keys=True, default=str)


# NEEDS to either be taken out, or retrieve id and call other method
# def getStudentAttendance(student):
#     nameList = student.split()
#     first = nameList[0]
#     last = nameList[1]
#     queryID = "SELECT id FROM students WHERE first_name = \'" + first + "\' AND last_name = \'" + last + "\';"
#     studentID = json.loads(json.dumps(executeSingleQuery(queryID, fetch=True)))[0][0]
#
#
#     return getStudentInfo(student)


##NOT EVEN CLOSE TO DONE NEEDS TO BE IMPLEMENTED
def getMasterAttendance():
    getDates = "SELECT DISTINCT date FROM dailyattendance ORDER BY date DESC;"
    #executeSingleQuery(query1, [])
    dateResults = json.dumps(executeSingleQuery(getDates, fetch=True), indent=4, sort_keys=True, default=str)
    dates =json.loads(dateResults)
    print(dates)
    print(dates[0])

    queryColumns = "SELECT activity_id, name FROM activities WHERE is_showing = 'true' ORDER BY ordering;"
    columnResults = json.dumps(executeSingleQuery(queryColumns, fetch=True))
    columns =json.loads(columnResults)

    queryCreateEmpty = "CREATE TABLE master (\"date\" date, attendees int "
    for i in range(len(columns)):
        name = columns[i][1]
        queryCreateEmpty = queryCreateEmpty + ", " + name + " int "
    queryCreateEmpty = queryCreateEmpty + ");"
    totalQuery = queryCreateEmpty
    for i in range(len(dates)):

        queryInsertDate = "INSERT INTO master (date, attendees) VALUES (\'" + dates[i][0] + "\', (SELECT COUNT(DISTINCT student_id) FROM dailyattendance WHERE date = \'" + dates[i][0] + "\' AND activity_id = -1));"
        totalQuery = totalQuery + " " + queryInsertDate
        for j in range(len(columns)):
            name = columns[j][1]
            colID = columns[j][0]
            queryColumnCount = "UPDATE master set " + name + " = (SELECT COUNT(DISTINCT student_id) FROM dailyattendance WHERE date = \'" + dates[i][0] + "\' AND activity_id = " + str(colID) + ") WHERE "
            queryColumnCount = queryColumnCount + " date = \'" + dates[i][0] + "\';"
            totalQuery = totalQuery + " " + queryColumnCount

    executeSingleQuery(totalQuery, [])

    returnQuery = "SELECT * FROM master ORDER BY date DESC;"

    result = json.dumps(executeSingleQuery(returnQuery, fetch = True), indent=4, sort_keys=True, default=str)
    print(result)

    queryDrop = "DROP TABLE master;"
    executeSingleQuery(queryDrop, [])

    return result


#NOT EVEN CLOSE MUST BE REWRITTEN
def getMasterAttendanceDate(dates):
    dateList = dates.split()
    start = dateList[0]
    end = dateList[1]

    getDates = "SELECT DISTINCT date FROM dailyattendance ORDER BY date DESC;"
    #executeSingleQuery(query1, [])
    dateResults = json.dumps(executeSingleQuery(getDates, fetch=True), indent=4, sort_keys=True, default=str)
    dates =json.loads(dateResults)
    print(dates)
    print(dates[0])

    queryColumns = "SELECT activity_id, name FROM activities WHERE is_showing = 'true' ORDER BY ordering;"
    columnResults = json.dumps(executeSingleQuery(queryColumns, fetch=True))
    columns =json.loads(columnResults)

    queryCreateEmpty = "CREATE TABLE master (\"date\" date, attendees int "
    for i in range(len(columns)):
        name = columns[i][1]
        queryCreateEmpty = queryCreateEmpty + ", " + name + " int "
    queryCreateEmpty = queryCreateEmpty + ");"
    totalQuery = queryCreateEmpty
    for i in range(len(dates)):

        queryInsertDate = "INSERT INTO master (date, attendees) VALUES (\'" + dates[i][0] + "\', (SELECT COUNT(DISTINCT student_id) FROM dailyattendance WHERE date = \'" + dates[i][0] + "\' AND activity_id = -1));"
        totalQuery = totalQuery + " " + queryInsertDate
        for j in range(len(columns)):
            name = columns[j][1]
            colID = columns[j][0]
            queryColumnCount = "UPDATE master set " + name + " = (SELECT COUNT(DISTINCT student_id) FROM dailyattendance WHERE date = \'" + dates[i][0] + "\' AND activity_id = " + str(colID) + ") WHERE "
            queryColumnCount = queryColumnCount + " date = \'" + dates[i][0] + "\';"
            totalQuery = totalQuery + " " + queryColumnCount

    executeSingleQuery(totalQuery, [])

    returnQuery = "SELECT * FROM master WHERE date >= \'" + start + "\' AND date <= \'" + end + "\' ORDER BY date DESC;"

    result = json.dumps(executeSingleQuery(returnQuery, fetch = True), indent=4, sort_keys=True, default=str)
    print(result)

    queryDrop = "DROP TABLE master;"
    executeSingleQuery(queryDrop, [])

    return result



#Switch a column's placement with the column above it
#Input: column name
#Output: none
def moveAttendanceColumnUp(request):
    print("got to column up")
    name = request.form.get("name")
    query = "SELECT name, ordering FROM activities ORDER BY ordering;"
    result = json.dumps(executeSingleQuery(query,fetch = True))
    print(result)
    ids =json.loads(result)
    colID = 0
    prevCol = ""
    prevID = 0
    print(name)
    for i in range(1, len(ids)):
        print(ids[i][0])
        if (ids[i][0] == name):
            if (i < 2):
                return ""

            colID = ids[i][1]
            prevCol = ids[i-1][0]
            prevID = ids[i-1][1]
    if (colID == 0 or prevID == 0):
        print("did not find... oops!")
        return
    query1 = "UPDATE activities SET ordering = " + str(prevID) + " WHERE name = \'" + name + "\';"
    query2 = "UPDATE activities SET ordering = " + str(colID) + " WHERE name = \'" + prevCol + "\';"
    executeSingleQuery(query1, [])
    executeSingleQuery(query2, [])

    return "Done"

#Add new item to track in attendance
#INPUT HAS CHANGED - doesn't use coltype however for now we'll send it anyway
#Input: name
#Output: none
def addAttendanceColumn(request):
    #make sure column name not in use
    name = request.form.get("name")
    colType = request.form.get("type")
    isParent = "false"
    query = "INSERT INTO activities (is_showing, name, is_parent) VALUES ('true','" + name + "', '"+ isParent + "');"
    executeSingleQuery(query, [])
    query2 = "SELECT activity_id FROM activities WHERE name = \'" + name + "\'; "
    result = json.dumps(executeSingleQuery(query2,fetch = True))
    newResult =json.loads(result)
    prio = newResult[0][0]
    query3 = "UPDATE activities SET ordering = " + str(prio) + " WHERE name = \'" + name + "\'; "
    executeSingleQuery(query3, [])
    return "done"


#Should no longer be neccessary
def deleteAttendanceColumn(request):
    name = request.form.get("name")
    query = "DELETE FROM attendanceColumns WHERE name = '" + name + "';"
    queryAttendance = "ALTER TABLE dailyAttendance DROP COLUMN " + name + ";"
    queryMaster = "ALTER TABLE masterAttendance DROP COLUMN " + name + ";"

    executeSingleQuery(query, [])
    executeSingleQuery(queryAttendance, [])
    executeSingleQuery(queryMaster, [])
    query = "UPDATE activities SET is_showing  = 'false' WHERE name = '" + name + "';"
    executeSingleQuery(query, [])
    return "done"



#Not sure if this is currently being used...
def updateAttendanceColumn(request):
    name = request.form.get("name")

    queryMaster = "SELECT is_showing FROM activities WHERE name = '" + name + "';"
    result = json.dumps(executeSingleQuery(queryMaster,fetch = True))
    newResult =json.loads(result)
    isShowing = newResult[0][0]
    if (isShowing):
        query = "UPDATE activities SET is_showing = 'false' WHERE name = '" + name + "';"
    else:
        query = "UPDATE activities SET is_showing = 'true' WHERE name = '" + name + "';"

    executeSingleQuery(query, [])
    return "done"


#get attendance columns
#Input: none
#Output: all data from table...for now...NEED TO CHECK JAVASCRIPT
def getAttendanceColumns():
    query = "SELECT * FROM activities ORDER BY ordering;"
    return json.dumps(executeSingleQuery(query, fetch = True), indent=4, sort_keys=True, default=str)




# Should no longer be neccessary
# def decreaseActivityCount(column, date, increase):
#     queryMaster = "SELECT "+ column + " FROM masterAttendance WHERE date = '" + date + "';"
#     result = json.dumps(executeSingleQuery(queryMaster,fetch = True))
#     newResult =json.loads(result)
#     numAttend = newResult[0][0]
#     if increase:
#         numAttend += 1
#     else:
#         numAttend -= 1
#
#     alterQuery = "UPDATE masterAttendance SET " + column + " = '" + str(numAttend) + "' WHERE date = '" + date + "';"
#     executeSingleQuery(alterQuery, [])


#Delete someone from attendance sheet
#Input: name + date
#Output: none
def deleteAttendant(request):
    name = request.form.get("name")
    date = request.form.get("date")


    nameList = name.split()
    first = nameList[0]
    last = nameList[1]
    queryID = "SELECT id FROM students WHERE first_name = \'" + first + "\' AND last_name = \'" + last + "\';"

    studentID = json.loads(json.dumps(executeSingleQuery(queryID, fetch=True)))[0][0]

    queryVisits = "SELECT number_visits FROM students WHERE id = " + str(studentID) + ";"
    numVisits = json.loads(json.dumps(executeSingleQuery(queryVisits, fetch=True)))[0][0]
    newNum = numVisits - 1

    queryDelete = "DELETE FROM dailyattendance WHERE student_id = " + str(studentID) + " AND date = \'" + date + "\';"
    queryUpdate = "UPDATE students SET number_visits = " + str(newNum) + " WHERE id = " + str(studentID) + " ;"
    queryDelete = queryDelete + " " + queryUpdate
    executeSingleQuery(queryDelete, [])
    return "done"



# I don't think this is used...
# def getActiveCols():
#     query = "SELECT name FROM attendanceColumns ORDER BY isshowing DESC;"
#     colsRaw = json.dumps(executeSingleQuery(query, fetch = True), indent=4, sort_keys=True, default=str)
#     cols = json.loads(colsRaw)
#     activeCols = []
#     for i in range(len(cols)):
#         if cols[i][0]:
#             activeCols.append(cols[i][0])
#     return activeCols


# Don't think this is used either...
# def getColsStr(cols):
#     colsStr = ""
#     for i in range(len(cols)-1):
#         colsStr += cols[i] + ", "
#     colsStr += cols[len(cols)-1]
#     return colsStr



#Get attendance dates
#Input: none
#Output: list of dates
def getDates():
    query = "SELECT DISTINCT date FROM dailyattendance ORDER BY date DESC"
    return json.dumps(executeSingleQuery(query,fetch = True)[:10], indent=4, sort_keys=True, default=str)


#Select or de-select an activity
#Input: column (activity)
# date
# name of student
#Output: none
def selectActivity(request):
    column = request.form.get("column")
    #column = column.lower()
    date = request.form.get("date")
    name = request.form.get("name")
    nameList = name.split()

    first = nameList[0]
    last = nameList[1]
    queryID = "SELECT id FROM students WHERE first_name = \'" + first + "\' AND last_name = \'" + last + "\';"
    studentID = json.loads(json.dumps(executeSingleQuery(queryID, fetch=True)))[0][0]
    queryColID = "SELECT activity_id FROM activities WHERE name = \'" + column + "\';"

    colID = json.loads(json.dumps(executeSingleQuery(queryColID, fetch=True)))[0][0]


    query = "SELECT * FROM dailyattendance WHERE student_id = " + str(studentID) + " AND date = '" + date + "' AND activity_id = " + str(colID) + ";"
    result = executeSingleQuery(query, fetch=True)
    if (len(result) < 1):
        queryUpdate = "INSERT INTO dailyattendance VALUES (" + str(studentID) + ", '" + date + "', null, " + str(colID) + ");"
    else:
        queryUpdate = "DELETE FROM dailyattendance WHERE student_id = " + str(studentID) + " AND date = '" + date + "' AND activity_id = " + str(colID) + ";"
    executeSingleQuery(queryUpdate)

    return "done"

##Gets the path to a student's photo if one exists. Otherwise, gets the path to a default 'not found' image
def getPhoto(id):
    query = "SELECT * FROM studentinfo WHERE student_id = " + str(id) +  " AND info_id = 5;"
    result = executeSingleQuery(query, fetch=True)
    if (len(result) < 1):
        return "/static/resources/images/No-image-found.jpg"
    else:
        return result[0][3]






#Add someone new to an attendance sheet - mark them
# as attending the key
#Input: name, date, time
#Output: none
def addAttendant(request):
    #print(json.decode(request.data))
    first = request.form.get('firstName')
    last  = request.form.get( 'lastName')
    date = request.form.get('date')
    time = request.form.get('time')
    queryID = "SELECT id FROM students WHERE first_name = \'" + first + "\' AND last_name = \'" + last + "\';"
    studentID = json.loads(json.dumps(executeSingleQuery(queryID, fetch=True)))[0][0]
    queryVisits = "SELECT number_visits FROM students WHERE id = " + str(studentID) + ";"
    numVisits = json.loads(json.dumps(executeSingleQuery(queryVisits, fetch=True)))[0][0]
    newNum = numVisits + 1

    querykeyID = "SELECT activity_id FROM activities WHERE name = 'Key';"

    keyID = json.loads(json.dumps(executeSingleQuery(querykeyID, fetch=True)))[0][0]
    now = datetime.datetime.now()
    today = transformDate(now)
    if (len(date) == 9):
        date = date[0:5] + "0" + date[5:]
    if (len(today) == 9):
        today = today[0:5] + "0" + today[5:]
    print(date)
    print(today)
    if (today != date):
        queryTime = "SELECT time FROM dailyAttendance WHERE date = \'" + date + "\' ORDER BY time DESC;"
        lastTimes = json.loads(json.dumps(executeSingleQuery(queryTime,fetch = True)[:10], indent=4, sort_keys=True, default=str))
        print(lastTimes)
        if (len(lastTimes) == 0):
            time = "15:00:00"
        else:
            lastTime = lastTimes[0][0]
            print(lastTime)
            minutes = lastTime[3:5]
            if (int(minutes) > 50):
                newHour = str(int(lastTime[0:2]) + 1)
                newMinute = "00"
                newSecond = "00"
            else:
                newHour = lastTime[0:2]
                newMinute = str(int(lastTime[3:5]) + 5)
                newSecond= "00"
            time = newHour + ":" + newMinute + ":" + newSecond

    queryAdd = "INSERT INTO dailyattendance VALUES (" + str(studentID) + ", '" + date + "', '" + time +  "', -1, " + str(newNum) + ");"
    queryAddKey = "INSERT INTO dailyattendance VALUES (" + str(studentID) + ", '" + date + "', '" + time +  "', " + str(keyID) + ");"
    queryUpdate = "UPDATE students SET number_visits = " + str(newNum) + " WHERE id = " + str(studentID) + ";"
    queryTotal = queryAdd + " " + queryAddKey + " " + queryUpdate
    executeSingleQuery(queryTotal, [])




    return "done"


######################This is where I stopped editing ################


    # Literally just takes a string. Compares both first and last name.

def autofill(partialString):
    if(partialString == ""):
        return json.dumps([])
    nameList = partialString.split()
    if (len(nameList) > 1):
        first = nameList[0].upper()
        last = nameList[1].upper()
        query = "SELECT * FROM students WHERE UPPER(first_name) LIKE '%" + first + "%' OR UPPER(last_name) LIKE '%" + last + "%';"
    else:
        q = partialString.upper()
        query = "SELECT * FROM students WHERE UPPER(first_name) LIKE '%" + q + "%' OR UPPER(last_name) LIKE '%" + q + "%';"
    databaseResult = executeSingleQuery(query, fetch = True)
    suggestions = json.dumps(databaseResult[:10], indent=4, sort_keys=True, default=str)
    return suggestions

def frequentPeers(name):
    studentID = getJustID(name)
    query = "SELECT date, time FROM dailyattendance WHERE student_id = '" + studentID + "' AND activity_id = -1;"

    result = json.dumps(executeSingleQuery(query, fetch = True), indent=4, sort_keys=True, default=str)
    result = result.replace("\n","").replace(" ","").replace("[", "").replace("]", "").replace("\"","")
    result = result.split(",")


    studentDict = {}
    peersDict = {}

    for i in range(0, len(result), 2):
        if result[i] not in studentDict.keys():
            studentDict[result[i]] = []
        # studentDict[result[i]].append(result[i + 1])
        timeList = result[i + 1].replace("\"", "").replace("\'","").split(":")
        timeNum = int(timeList[0]) + (int(timeList[1]) / 60) + (int(timeList[2]) / 3600)
        studentDict[result[i]] = timeNum

    for key in studentDict:
        print(key)
        if key not in peersDict.keys():
            peersDict[key] = {}

        query2 = "SELECT student_id, time FROM dailyAttendance WHERE date = '" + key + "';"
        print(query2)
        curResult = json.dumps(executeSingleQuery(query2, fetch = True), indent=4, sort_keys=True, default=str)
        curResult = curResult.replace("\n", "").replace("[q", "").replace(" ", "").replace("]","").replace("[","")

        curResult = curResult.split(",")
        print(curResult)

        for i in range(0, len(curResult), 2):
            if curResult[i] not in peersDict[key].keys():
                peersDict[key][curResult[i]] = []
            timeList = curResult[i + 1].replace("\"", "").replace("\'","").split(":")
            try:
                timeNum = int(timeList[0]) + (int(timeList[1]) / 60) + (int(timeList[2]) / 3600)
                peersDict[key][curResult[i]] = timeNum
                print(timeList)
            except ValueError:
                print("Some data wasn't there. Sad. Very sad.")
            # peersDict[key][curResult[i]].append(curResult[i + 1])

    closeAppearancesDict = {}
    testString = ""

    for key in studentDict.keys():
        if key != studentID:
            curDate = key
            curTime = studentDict[key]
            for key2 in peersDict[curDate]:
                peerDate = key2
                peerTime = peersDict[curDate][key2]
                if abs(curTime - peerTime) < 2:
                    if key2 not in closeAppearancesDict:
                        closeAppearancesDict[key2] = 1
                    else:
                        closeAppearancesDict[key2] += 1


    closeAppearancesList = sorted(closeAppearancesDict.items(), key=lambda x: x[1])[::-1]
    frequentPeersList = []

    peerListLength = len(closeAppearancesList)
    if (peerListLength > 5):
        for i in range(5):
            frequentPeer = getStudentByID(closeAppearancesList[i][0])
            frequentPeersList.append(frequentPeer)
    else:
        for i in range(peerListLength):
            frequentPeer = getStudentByID(closeAppearancesList[i][0])
            frequentPeersList.append(frequentPeer)

    print("Hello, RUSS!")
    return str(frequentPeersList)

def studentProfile(string):
    nameList = string.split()
    first = nameList[0]
    last = nameList[1]
    query = "SELECT id FROM students WHERE first_name LIKE '%" + first + "%' OR last_name LIKE '%" + last + "%';"
    databaseResult = executeSingleQuery(query, fetch = True)
    result = json.dumps(databaseResult)
    return result

#
# def getStudentID(string):
#     nameList = string.split()
#     first = nameList[0].upper()
#     last = nameList[1].upper()
#     query = "SELECT id FROM students WHERE UPPER(firstname) LIKE '%" + first + "%' AND UPPER(lastname) LIKE '%" + last + "%';"
#     databaseResult = executeSingleQuery(query, fetch = True)
#     return databaseResult;

def getStudentID(string):
    print("GetID called")
    return autofill(string)

def getStudentByID(string):

    print("CALLED")

    query = "SELECT first_name FROM students WHERE id = '" + string + "';"
    databaseResult = executeSingleQuery(query, fetch = True)
    result = json.dumps(databaseResult[0][0]).replace("\"","")

    query2 = "SELECT last_name FROM students WHERE id = '" + string + "';"
    databaseResult2 = executeSingleQuery(query2, fetch = True)
    result2 = json.dumps(databaseResult2[0][0]).replace("\"","")

    print(result + " " +  result2)

    return result + " " +  result2

# WE SHOULD do a query that sees if fullName can be found from firstName+lastName in DB
# This would account for problems with multiple spaces in students' names.
def getJustID(string):
    nameList = string.split()
    first = nameList[0].upper()
    last = nameList[1].upper()
    query = "SELECT id FROM students WHERE UPPER(first_name) LIKE '%" + first + "%' AND UPPER(last_name) LIKE '%" + last + "%';"
    databaseResult = executeSingleQuery(query, fetch = True)
    print(databaseResult[0][0])
    result = json.dumps(databaseResult[0][0])
    return result

def getAlerts():
    query = "SELECT students.firstName, students.lastName, alerts.alert, alerts.studentid FROM students, alerts WHERE alerts.completed = FALSE AND alerts.studentid = students.id;"
    databaseResult = executeSingleQuery(query, fetch = True)
    return json.dumps(databaseResult)

def addAlert(request):
    id = request.form.get('id')
    alert = request.form.get('alertText')
    executeSingleQuery("INSERT INTO alerts VALUES (default, %s, %s, %s);", [alert, 'f', id])

def checkAlert(request):
    id = request.form.get('id')
    executeSingleQuery("UPDATE alerts SET completed = 't' WHERE studentid = %s;", [id])

def uploadPicture(studentid, name, imageObj):
    nameExt = name.rsplit('.')[-1].lower()
    pathString = "/static/resources/images/" + studentid + nameExt
    imageObj.save(pathString)
    executeSingleQuery("INSERT INTO studentinfo VALUES (%s, 6, null, %s, null, null, null);" [studentid, pathString])
    return 1
