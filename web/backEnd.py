import json
import psycopg2
import sys
import datetime
import flaskEnd

def foo(request):
    #print(request.values)
    if request.method == 'POST':
        f = request.data
        print(f)
    return "hi front-end!"

def executeSingleQuery(query, params = [], fetch = False):
    print(query, params)
    dbName = 'compsTestDB'
    user = 'ubuntu'
    password = 'keyComps'
    hostName = 'ec2-35-160-216-144.us-west-2.compute.amazonaws.com'
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


"""
{
    firstName : "Jack",
    lastName : "Wines"
}
"""


def addNewStudent(request):
    firstName = request.form.get('firstName')
    lastName  = request.form.get( 'lastName')
    executeSingleQuery("INSERT INTO testStudents VALUES (%s, %s)", [firstName, lastName])
        
    return "\nHello frontend:)\n"

def updateStudentInfo(request):
    name = request.form.get('name')
    nameList = name.split()
    first = nameList[0]
    last = nameList[1]
    column = request.form.get('column')
    value = request.form.get('value')
    if (value == "TRUE"):
        curVal = json.dumps(executeSingleQuery("SELECT " + column + " FROM testStudents WHERE firstName = '" + first + "' AND lastName = '" + last + "';", fetch=True), indent=4, sort_keys=True, default=str)
        newResult =json.loads(curVal)
        isChecked = newResult[0][0]
        print(curVal)
        if (isChecked):
            query = "UPDATE testStudents SET "+ column + " = 'FALSE' WHERE firstName = '" + first + "' AND lastName = '" + last + "';"
        else:
            query = "UPDATE testStudents SET "+ column + " = 'TRUE' WHERE firstName = '" + first + "' AND lastName = '" + last + "';"
    else:
        query = "UPDATE testStudents SET "+ column + " = '" + value +"' WHERE firstName = '" + first + "' AND lastName = '" + last + "';"
    executeSingleQuery(query, [])
    return "all good"



def getStudentInfo(name):
    print("got here")
    nameList = name.split()
    first = nameList[0]
    last = nameList[1]
    query = "SELECT * FROM testStudents WHERE firstName = '" + first + "' AND lastName = '" + last + "';"
    result = json.dumps(executeSingleQuery(query, fetch = True), indent=4, sort_keys=True, default=str)
    print(result)
    return result





def addStudentColumn(request):
    #make sure column name not in use
    name = request.form.get("name")
    colType = request.form.get("type")
    definedOptions = request.form.get("definedOptions")

    if (colType == "varchar"):
        colType = colType + "(500)"

    query = "INSERT INTO studentColumns VALUES ('true','false', '" + name + "', '"+ colType + "', '" + definedOptions + "');"
    queryAttendance = "ALTER TABLE testStudents ADD " + name + " " + colType + ";"

    executeSingleQuery(query, [])
    executeSingleQuery(queryAttendance, [])

def alterStudentColumn(request):
    name = request.form.get("name")
    column = request.form.get("column")
    queryStatus = "SELECT "+ column + " FROM studentColumns WHERE name = '" + name + "';"
    result = json.dumps(executeSingleQuery(queryStatus,fetch = True))
    newResult =json.loads(result)
    isChecked = newResult[0][0]

    if (isChecked):
        query = "UPDATE studentColumns SET "+ column + " = 'false' WHERE name = '" + name + "';"
    else:
        query = "UPDATE studentColumns SET "+ column + " = 'true' WHERE name = '" + name + "';"
    executeSingleQuery(query, [])

def deleteStudentColumn(request):
    name = request.form.get("name")
    query = "DELETE FROM studentColumns WHERE name = '" + name + "';"
    query2 = "ALTER TABLE testStudents DROP COLUMN " + name + ";"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])

def getStudentColumns():
    query = "SELECT * FROM studentColumns ORDER BY priority"
    return json.dumps(executeSingleQuery(query, fetch = True), indent=4, sort_keys=True, default=str)

def sendFeedback(request):
    feedback = request.form.get('feedback')
    date = request.form.get('date')
    query = "INSERT INTO feedback VALUES ('" + date +"', '" + feedback + "');"
    executeSingleQuery(query,[])


# strictly test for now
# going to get today's data later
def getAttendance(date):
    queryColumns = "SELECT name FROM attendanceColumns ORDER BY priority;"
    cols = json.dumps(executeSingleQuery(queryColumns, fetch = True), indent=4, sort_keys=True, default=str)
    colList = json.loads(cols) # this is strange... anyone have any idea why?
    query = "SELECT firstName, lastName, " + colList[0][0];
    for i in range(1, len(colList)):
        query = query + ", " + colList[i][0]
    query = query + " FROM dailyAttendance WHERE date= '" + date + "' ORDER BY time ASC;"

    queryResult = executeSingleQuery(query, fetch = True)
    result = json.dumps(queryResult, indent=4, sort_keys=True, default=str)
    return result

def getLogin(login):
    nameList = login.split()
    user = nameList[0]
    password = nameList[1]
    query = "SELECT * FROM login WHERE username = '" + user + "' AND password = '" + password + "';"
    return json.dumps(executeSingleQuery(query,
        fetch = True), indent=4, sort_keys=True, default=str)

def getStudentAttendance(student):
    nameList = student.split()
    first = nameList[0]
    last = nameList[1]
    query = "SELECT * FROM dailyAttendance WHERE firstName = '" + first + "' AND lastName = '" + last + "' ORDER BY date DESC;"
    query = """SELECT testStudents.firstName, testStudents.LastName, dailyAttendance.* FROM dailyAttendance, testStudents WHERE
                testStudents.firstName = '%s' AND
                testStudents.lastName = '%s' AND
                dailyAttendance.id = testStudents.id
                ORDER BY date DESC;""" % (first, last)
    queryResult = executeSingleQuery(query,fetch = True)
    queryResult = [row[:2] + row[5:] for row in queryResult]
    return json.dumps(queryResult, indent=4, sort_keys=True, default=str)

def getMasterAttendance():
    return json.dumps(executeSingleQuery("SELECT DISTINCT * FROM masterAttendance ORDER BY date DESC;",
        fetch = True)[:10], indent=4, sort_keys=True, default=str)





def addAttendanceColumn(request):
    #make sure column name not in use
    name = request.form.get("name")
    colType = request.form.get("type")
    #isParent = request.form.get("isParent")
    isParent = "false"
    #isChild = request.form.get("isChild")
    isChild = "false"
    #parent = request.form.get("parent")
    parent = ""
    if (colType == "varchar"):
        colType = colType + "(255)"

    query = "INSERT INTO attendanceColumns VALUES ('true','true', '" + name + "', '"+ colType + "', '"+ isParent + "', '" + isChild + "', '" + parent + "');"
    queryAttendance = "ALTER TABLE dailyAttendance ADD " + name + " " + colType + ";"
    queryMaster = "ALTER TABLE masterAttendance ADD " + name + " int;"
    executeSingleQuery(query, [])
    executeSingleQuery(queryAttendance, [])
    executeSingleQuery(queryMaster, [])

    queryCounts = "UPDATE masterAttendance SET "+ name+ "='0';"

    executeSingleQuery(queryCounts, [])

def deleteAttendanceColumn(request):
    name = request.form.get("name")
    query = "DELETE FROM attendanceColumns WHERE name = '" + name + "';"
    queryAttendance = "ALTER TABLE dailyAttendance DROP COLUMN " + name + ";"
    queryMaster = "ALTER TABLE masterAttendance DROP COLUMN " + name + ";"

    executeSingleQuery(query, [])
    executeSingleQuery(queryAttendance, [])
    executeSingleQuery(queryMaster, [])


def updateAttendanceColumn(request):
    name = request.form.get("name")


    queryMaster = "SELECT isShowing FROM attendanceColumns WHERE name = '" + name + "';"
    result = json.dumps(executeSingleQuery(queryMaster,fetch = True))
    newResult =json.loads(result)
    isShowing = newResult[0][0]
    if (isShowing):
        query = "UPDATE attendanceColumns SET isShowing = 'false' WHERE name = '" + name + "';"
    else:
        query = "UPDATE attendanceColumns SET isShowing = 'true' WHERE name = '" + name + "';"

    executeSingleQuery(query, [])


def getAttendanceColumns():
    query = "SELECT * FROM attendanceColumns ORDER BY priority"
    return json.dumps(executeSingleQuery(query, fetch = True), indent=4, sort_keys=True, default=str)



# must give start and end date separated by a space
def getMasterAttendanceDate(dates):
    dateList = dates.split()
    start = dateList[0]
    end = dateList[1]
    return json.dumps(executeSingleQuery("SELECT DISTINCT * FROM masterAttendance WHERE date >= '" + start + "' AND date <= '" + end + "' ORDER BY date ASC;",
        fetch = True), indent=4, sort_keys=True, default=str)


def decreaseActivityCount(column, date, increase):
    queryMaster = "SELECT "+ column + " FROM masterAttendance WHERE date = '" + date + "';"
    result = json.dumps(executeSingleQuery(queryMaster,fetch = True))
    newResult =json.loads(result)
    numAttend = newResult[0][0]
    if increase:
        newNumAttend = numAttend + 1
    else:
        newNumAttend = numAttend - 1

    alterQuery = "UPDATE masterAttendance SET " + column + " = '" + str(newNumAttend) + "' WHERE date = '" + date + "';"
    executeSingleQuery(alterQuery, [])


def deleteAttendant(request):
    name = request.form.get("name")
    date = request.form.get("date")
    nameList = name.split()
    first = nameList[0]
    last = nameList[1]
    query1 = "SELECT * FROM dailyAttendance WHERE date = '" + date + "' AND firstName = '" + first + "' AND lastName = '" + last + "';"
    row = json.dumps(executeSingleQuery(query1,fetch = True), indent=4, sort_keys=True, default=str)
    rowData = json.loads(row)
    if rowData == []:
        print("this is strange")
    else:
        headings = ["art", "madeFood", "recievedFood", "leadership", "exersize", "mentalHealth", "volunteering", "oneOnOne"]
        for i in range(len(headings)):
            rowIndex = i + 2
            if rowData[0][rowIndex]:
                decreaseActivityCount(headings[i], date, False)


    query = "DELETE FROM dailyAttendance WHERE date = '" + date + "' AND firstName = '" + first + "' AND lastName = '" + last + "';"
    executeSingleQuery(query, [])
    queryMaster = "SELECT numAttend FROM masterAttendance WHERE date = '" + date + "';"
        #result = executeSingleQuery(queryMaster)
    result = json.dumps(executeSingleQuery(queryMaster,fetch = True))
    newResult =json.loads(result)
    numAttend = newResult[0][0]

    print(numAttend)
    if (numAttend == 0):
        newNumAttend = 0
    else:
        newNumAttend = numAttend - 1
    alterQuery = "UPDATE masterAttendance SET numAttend = '" + str(newNumAttend) + "' WHERE date = '" + date + "';"
    executeSingleQuery(alterQuery, [])

def getDates():
    query = "SELECT DISTINCT date FROM dailyAttendance ORDER BY date DESC"
    return json.dumps(executeSingleQuery(query,fetch = True)[:10], indent=4, sort_keys=True, default=str)



def selectActivity(request):
    column = request.form.get("column")
    date = request.form.get("date")
    name = request.form.get("name")
    nameList = name.split()

    first = nameList[0]
    last = nameList[1]
    query1 = "SELECT "+ column + " FROM dailyAttendance WHERE date = '" + date + "' AND firstName = '" + first + "' AND lastName = '" + last + "';"
    #currentStatus = executeSingleQuery(query1)
    result1 = json.dumps(executeSingleQuery(query1,fetch = True), indent=4, sort_keys=True, default=str)

    queryMaster = "SELECT "+ column + " FROM masterAttendance WHERE date = '" + date + "';"
    result = json.dumps(executeSingleQuery(queryMaster,fetch = True))
    newResult =json.loads(result)
    numAttend = newResult[0][0]
    print(result)
    print(numAttend)


    if "true" in result1:
        if (numAttend == 0):
            newNumAttend = 0
        else:
            newNumAttend = numAttend - 1

        query = "UPDATE dailyAttendance SET " +  column + " = 'FALSE' WHERE date = '" + date + "' AND firstName = '" + first + "' AND lastName = '" + last + "';"
    else:
        newNumAttend = numAttend + 1
        query = "UPDATE dailyAttendance SET " +  column + " = 'TRUE' WHERE date = '" + date + "' AND firstName = '" + first + "' AND lastName = '" + last + "';"
    executeSingleQuery(query, [])

    alterQuery = "UPDATE masterAttendance SET " + column + " = '" + str(newNumAttend) + "' WHERE date = '" + date + "';"
    executeSingleQuery(alterQuery, [])
    return ""


def addAttendant(request):
    #print(json.decode(request.data))
    firstName = request.form.get('firstName')
    lastName  = request.form.get( 'lastName')
    date = request.form.get('date')
    time = request.form.get('time')
    activityNames = ["art", "madeFood", "recievedFood", "leadership", "exercise", "mentalHealth", "volunteering", "oneOnOne", "comments"]
    activities = [request.form.get(activityName) for activityName in activityNames]
    print(firstName,lastName, activityNames)
    id = request.form.get('id')
    if id != "":
        # time = datetime.datetime.now().time()
        # activities = activities.append(time, None)

        # add two more %s's for timeIn and timeOut. You won't.
        executeSingleQuery("INSERT INTO dailyAttendance VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
        [id] + activities)
        return "true"
    else:
        firstQuery = "SELECT * FROM dailyAttendance WHERE firstName = '" + firstName + "' AND lastName = '" + lastName + "' AND date = '" + date + "';"
        existingEntry = json.dumps(executeSingleQuery(firstQuery, fetch = True), indent=4, sort_keys=True, default=str)
        entries = json.loads(existingEntry)
        if entries != []:
            print("already added")
            return "false"


        query = "SELECT id FROM testStudents WHERE firstName LIKE '%" + firstName + "%' OR lastName LIKE '%" + lastName + "%';"
        databaseResult = executeSingleQuery(query, fetch = True)

        queryRows = "SELECT name from attendanceColumns"
        columns = json.dumps(executeSingleQuery(queryRows, fetch = True), indent=4, sort_keys=True, default=str)
        columnsData = json.loads(columns)
        numCols = len(columnsData);

        newString = "INSERT INTO dailyAttendance (id, firstName, lastName"
        for i in range(0, numCols):
            newString = newString + ", "+ columnsData[i][0]
            
        newString = newString + ", date, time) VALUES ('" + str(databaseResult[0][0]) + "', '" + firstName + "', '" +lastName + "', "
        for i in range(0, numCols):
            newString = newString + "'FALSE', "
        newString = newString + "'" + date + "','" + time + "');"
        #newString = "INSERT INTO dailyAttendance VALUES " + databaseResult[0] + ", " + firstName + ", " + lastName
        executeSingleQuery(newString, [])
        queryMaster = "SELECT numAttend FROM masterAttendance WHERE date = '" + date + "';"
        #result = executeSingleQuery(queryMaster)
        result = json.dumps(executeSingleQuery(queryMaster,fetch = True))
        newResult =json.loads(result)

        if newResult == []:
            newQuery = "INSERT INTO masterAttendance VALUES('" + date + "', '1', '0', '0', '0', '0', '0', '0', '0', '0');"
            executeSingleQuery(newQuery, [])
            return "false"
        else:
            print(newResult)
            numAttend = newResult[0][0]
            #print(result)
            print(numAttend)
            newNumAttend = numAttend + 1
            alterQuery = "UPDATE masterAttendance SET numAttend = '" + str(newNumAttend) + "' WHERE date = '" + date + "';"
            executeSingleQuery(alterQuery, [])
        
        return "true"
        
#        if(id != ""):
#            return id
#        else:
#            return getJustID(firstName + " " + lastName)
        

# If more than one "same name" student is available, return students

        if len(databaseResult) > 1:
            return json.dumps(databaseResult[:10])
        elif len(databaseResult) == 0:
            return "false"


"""
    Literally just takes a string. Compares both first and last name.
"""
def autofill(partialString):
    if(partialString == ""):
        return json.dumps([])
    nameList = partialString.split()
    if (len(nameList) > 1):
        first = nameList[0].upper()
        last = nameList[1].upper()
        query = "SELECT * FROM testStudents WHERE UPPER(firstName) LIKE '%" + first + "%' OR UPPER(lastName) LIKE '%" + last + "%';"
    else:
        q = partialString.upper()
        query = "SELECT * FROM testStudents WHERE UPPER(firstName) LIKE '%" + q + "%' OR UPPER(lastName) LIKE '%" + q + "%';"
    databaseResult = executeSingleQuery(query, fetch = True)
    suggestions = json.dumps(databaseResult[:10], indent=4, sort_keys=True, default=str)
    return suggestions

def frequentPeers(string):
    studentID = getJustID(string)
    query = "SELECT date, time FROM dailyAttendance WHERE id = '" + studentID + "';"

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

        query2 = "SELECT id, time FROM dailyAttendance WHERE date = '" + key + "';"
        print(query2)
        curResult = json.dumps(executeSingleQuery(query2, fetch = True), indent=4, sort_keys=True, default=str)
        curResult = curResult.replace("\n", "").replace("[q", "").replace(" ", "").replace("]","").replace("[","")

        curResult = curResult.split(",")
        print(curResult)

        for i in range(0, len(curResult), 2):
            if curResult[i] not in peersDict[key].keys():
                peersDict[key][curResult[i]] = []
            timeList = curResult[i + 1].replace("\"", "").replace("\'","").split(":")
            timeNum = int(timeList[0]) + (int(timeList[1]) / 60) + (int(timeList[2]) / 3600)
            print(timeList)
            # peersDict[key][curResult[i]].append(curResult[i + 1])
            peersDict[key][curResult[i]] = timeNum

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

    for i in range(5):
        frequentPeer = getStudentByID(closeAppearancesList[i][0])
        frequentPeersList.append(frequentPeer)

    return str(frequentPeersList)

def studentProfile(string):
    nameList = string.split()
    first = nameList[0]
    last = nameList[1]
    query = "SELECT id FROM testStudents WHERE firstName LIKE '%" + first + "%' OR lastName LIKE '%" + last + "%';"
    databaseResult = executeSingleQuery(query, fetch = True)
    result = json.dumps(databaseResult)
    return result

#
# def getStudentID(string):
#     nameList = string.split()
#     first = nameList[0].upper()
#     last = nameList[1].upper()
#     query = "SELECT id FROM teststudents WHERE UPPER(firstname) LIKE '%" + first + "%' AND UPPER(lastname) LIKE '%" + last + "%';"
#     databaseResult = executeSingleQuery(query, fetch = True)
#     return databaseResult;

def getStudentID(string):
    print("GetID called")
    return autofill(string)

def getStudentByID(string):

    print("CALLED")

    query = "SELECT firstname FROM teststudents WHERE id = '" + string + "';"
    databaseResult = executeSingleQuery(query, fetch = True)
    result = json.dumps(databaseResult[0][0]).replace("\"","")

    query2 = "SELECT lastname FROM teststudents WHERE id = '" + string + "';"
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
    query = "SELECT id FROM teststudents WHERE UPPER(firstname) LIKE '%" + first + "%' AND UPPER(lastname) LIKE '%" + last + "%';"
    databaseResult = executeSingleQuery(query, fetch = True)
    print(databaseResult[0][0])
    result = json.dumps(databaseResult[0][0])
    return result

def getAlerts():
    query = "SELECT testStudents.firstName, testStudents.lastName, alerts.alert, alerts.studentid FROM testStudents, alerts WHERE alerts.completed = FALSE AND alerts.studentid = testStudents.id;"
    databaseResult = executeSingleQuery(query, fetch = True)
    return json.dumps(databaseResult)

def addAlert(request):
    id = request.form.get('id')
    alert = request.form.get('alertText')
    executeSingleQuery("INSERT INTO alerts VALUES (default, %s, %s, %s);", [alert, 'f', id])

def checkAlert(request):
    id = request.form.get('id')
    executeSingleQuery("UPDATE alerts SET completed = 't' WHERE studentid = '%s';", [id])
    