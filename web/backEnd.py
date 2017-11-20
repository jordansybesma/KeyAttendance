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



def tempStudentColumns():
    query = query = "DROP TABLE IF EXISTS studentColumns;"
    query2 = "CREATE TABLE studentColumns (isShowing boolean, isQuick boolean, name varchar(255), type varchar(255),definedOptions varchar(1000), priority SERIAL UNIQUE)"

    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])


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
    query = query + " FROM dailyAttendance WHERE date= '" + date + "' ORDER BY time DESC;"

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


def tempColumns():
    query = query = "DROP TABLE IF EXISTS attendanceColumns;"
    query2 = "CREATE TABLE attendanceColumns (inUse boolean, isShowing boolean, name varchar(255), type varchar(255), isParent boolean, isChild boolean, parent varchar(255), priority SERIAL UNIQUE)"
    query3 = "INSERT INTO attendanceColumns (inUse, isShowing, name, type, isParent, isChild, parent) VALUES ('true','true','art','boolean','false','false',''),('true','true','madeFood','boolean','false','false',''),('true','true','recievedFood','boolean','false','false',''),('true','true','leadership','boolean','false','false',''),('true','true','exersize','boolean','false','false',''),('true','true','mentalHealth','boolean','false','false',''),('true','true','volunteering','boolean','false','false',''),('true','true','oneOnOne','boolean','false','false',''),('true','false','comments','varchar','false','false','');"

    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])
    executeSingleQuery(query3, [])


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

def tempAlter():
    query = """
        ALTER TABLE attendanceColumns ADD priority int;
        UPDATE attendanceColumns set priority = '1' WHERE name = 'art';
        UPDATE attendanceColumns set priority = '2' WHERE name = 'madeFood';
        UPDATE attendanceColumns set priority = '3' WHERE name = 'recievedFood';
        UPDATE attendanceColumns set priority = '4' WHERE name = 'leadership';
        UPDATE attendanceColumns set priority = '5' WHERE name = 'exersize';
        UPDATE attendanceColumns set priority = '6' WHERE name = 'mentalHealth';
        UPDATE attendanceColumns set priority = '7' WHERE name = 'volunteering';
        UPDATE attendanceColumns set priority = '8' WHERE name = 'oneOnOne';
        UPDATE attendanceColumns set priority = '9' WHERE name = 'comments';
        UPDATE attendanceColumns set isShowing = 'false' WHERE name = 'comments';
    """
    executeSingleQuery(query, [])
    return ""

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
            rowIndex = i + 3
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

def temp():
    query = "DROP TABLE IF EXISTS dailyAttendance;"
    query2 = "CREATE TABLE dailyAttendance (id int, firstName varchar(255), lastName varchar(255), art boolean, madeFood boolean, recievedFood boolean, leadership boolean, exersize boolean, mentalHealth boolean, volunteering boolean, oneOnOne boolean, comments varchar(1000), date date, time time)"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])

def tempAdd():
    query = "INSERT INTO masterAttendance VALUES ('2017-11-02', '55', '20', '4', '5', '2', '10', '5', '0', '1'), ('2017-11-01', '65', '23', '6', '5', '12', '5', '7', '2', '5'), ('2017-10-31', '88', '10', '30', '15', '0', '2', '6', '2', '0'), ('2017-10-30', '100', '22', '2', '10', '1', '11', '4', '1', '2');"
    executeSingleQuery(query, [])

def tempMaster():
    query = "DROP TABLE IF EXISTS masterAttendance;"
    query2 = "CREATE TABLE masterAttendance (date date, numAttend int, art int, madeFood int, recievedFood int, leadership int, exersize int, mentalHealth int, volunteering int, oneOnOne int);"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])

def tempFiller():
    query = "INSERT INTO dailyAttendance VALUES ('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-30','16:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-29','18:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-27','18:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-25','16:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-21','15:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-19','17:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-15','17:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-12','16:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-11','19:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-10','15:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-06','17:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-05','18:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-01','16:00:00');"
    executeSingleQuery(query, [])
    return ""

def tempLogin():
    query = "DROP TABLE IF EXISTS login;"
    query2 = "CREATE TABLE login (username varchar(255), password varchar(255));"
    query3 = "INSERT INTO login values ('user1', 'password1');"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])
    executeSingleQuery(query3, [])
    return ""

def tempFeedback():
    query = "DROP TABLE IF EXISTS feedback;"
    query2 = "CREATE TABLE feedback (date date, comment varchar(2000));"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])
    return ""

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
        print(databaseResult[0][0])

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
    executeSingleQuery("INSERT INTO alerts VALUES (default, %s, %s, %s);", [id, alert, 'f'])

def checkAlert(request):
    id = request.form.get('id')
    executeSingleQuery("UPDATE alerts SET completed = 't' WHERE id = %s;", [id])
    
    
def sneakyTempAddingStudents():
    namesRaw = "Acevedo, Albar.Adams, Marie.Agapito Romero, Daherik	.Albrecht, Luke.Almendinger, Morgan.Anderson, Blake	.Anderson, Katelyn	.Anderson, Kiara.Anderson, Noah.Andrade, Abigail	.Andrew, Ella.Anfinson, Andrew	.Anthony, Charles	.Armstrong, Alex.Ascencio Bravo, Mindy	.Atkinson, Blake	.Ayers, James	.Bahm, Madelyn	.Bahm, Marissa.Baker, Seveth	.Baker, Taj	.Baker, Zoey.Bakken, Crystal.Baltazar, Luis (Angel).Baltazar, Michael	.Bamonte-Grebis, India	.Bandy, Raymond.Basina, Marcus.Basina, Savanna	.Bathen, Isabella.Bauernfeind, Gabe.Beardsley, Mason	.Beckstrom, Kathryn.Beimers, Ann.Beiser, Evra (Hailey).Bells, Katie.Benjamin, Alivia	.Benjamin, Connor	.Berg, Nicholas	.Bergman, Levi	.Bielenberg, Rachel.Billmeyer, Tori.Bolton, Hunter.Borene, Nick	.Boudreau, Jennifer	.Boutan, Noah.Bouton, Noah.Bradford, Gina.Branham, Alexis	.Branham, Amber.Branham, Robbie	.Brastad, Lisa	.Brennan, Mady	.Breyer, Sam.Brice, Martin.Brown, Alden	.Brown, Demetrius	.Bruestle, Noah.Brust, Katie.Bull, James.Burbank, Bryn.Burciaga, Evelyn.Burwell, Rhianna.Callery, Bella (Isabella).Calvario, Frank	.Calvario, Luis	.Calvario, Nicte-ha	.Camacho, Brenda	.Camay, Paul.Cameron, Lindsay.Campos Mijares, Alex	.Canning, Camryn.Canning, Shay.Carey, Brooke.Carey, Tanner	.carlson, Gustaf.Carlson, Rachel.Carlson, Sam.Carr, Alexis	.Carriel, Casey	.Carrington-May, Paul	.Carroll, Timothy	.Carter, Seth.Casillas, Oliver	.Caspers, Rachel.Castillo, Melanny	.Castro, Adan Yadel	.Celis, Damian	.Champ, Greenwood.Chapman, Ahna.Chavez, Angel.Chavez, Daniel.Chavez, Joshua.Chester, Jasmine	.Chester, Sydney	.Childress, Regan.Chlan, Josh.Christianson, Lars.Christianson, Liam.Christianson, Nissa.Church, Forest.Church, Leonardo (Leo)	.Church, Tom.Chyacek, Austin.Chytracek, Austen.Clay, Evan.Clerebout, Jimmy.Closser, Thomas.Clouse, Trevor.Coffey, Matt.Cogan, Rafaela.Colangelo, Lina.Coleman, Landy.Coleman, Sam.Colling, Evan.Colling, Rowen.Conde Arenas, Wilberto	.Condon, Garrett	.Condon, Zoe	.Connolly, Chelsie.Contreras, Luis Miguel Angel.Cooney, Keara.Corneilson, Sofia.Cornelio, Vanessa	.Corona, Irvin	.Corona Olivares, Irvin.Cortes, Jackie	.Cortez, Karla	.Costa, Hannah.Coudret, Trey.Coutermash, Tyler	.Craft, Michael	.Craig, Liam.Cristofaro Hark, Alden.Cristofaro Hark, Antonia.Cristofaro Hark, Arlo	.Cuddy, Jack.Curry, Dane.Dahl, Elliott.Dahl, Nathaniel.Dahle, Sam.Dahlquist, Kaylen.Dalton, Austin	.Davide, Kendra	.Davis, Jill	.De La Torre, Emiliano	.DeGroot, Kohl.Dehart, Tawna.Delacruz, Andres	.Delacruz, Tony.Delgado, Aaron	.Dell, Bailey.Dempsey, Joey.Dempsey, Nicholas.Denny, Logan.Detling, Phillip.Dice, Alida.Dickerson, Daniel.Dickerson, Leiah.Dimick, Vanessa.Dittrich, Augustine (Augy).Dittrich, River	.Diveris, John.Dobmeier, Brooke	.Dobmeier, Dayna.Dobmeier, Morgan.Dobmeier, Nick.Dobrow, Danny	.Dobrow, Joe	.Dobrow, Tom	.Docken, Ryan.Donkers, Alex	.Dorr, Aaron.Doughdy, Christina.Dougherty, Anna	.Dougherty, Chad	.Dreypac, Anderson.Drummer, Cole.Duba, Irene	.Duffney, Lily.Dulski, Josh.Dupont, Sydney.Duque, Isai	.Duque, Yamileth	.Dwyer, Sam.Ebert, Maisie	.Eddy, Sydnee.Edwards, Ari.Edwards, Hannah.Eicher, Emily.Ell, Evan	.Ell, Owin.Embertson, Angel.Embertson, Erika.Embertson, Nicolas	.Emerfoll, Crystal	.Emery, Mairin	.Epps, Taz'ante	.Ernste, Tanner.Ernste, Taylor.Estrada, Gabriella	.Etzell, Eric.Evans, Sage.Fahey, Courtney	.Fauble, Max.Feemster, Marek Matthew	.Feemster, River	.Feidt, Mariah.Felton, Lily.Fessler, Coltin	.Fields, Jordan.Fierke, Josh.Figueroa, Daniel	.Fink, Claire.Fink, Will.Fischer, Cortney	.Fischer, Marie.Fisher, Annika.Fisher, Liam.Flores, Armando	.Foldes, Bori.Forsythe, Helen.Fox, Grace.Fox, Jack	.Fox, Kenzie (Mackenzi)	.Fox, Molly.Francis, Linzie	.Frankenhauser, Lea.Frederick, Aaron.Fredrickson, Emilia.Fredrickson, Isabella.Fredrickson, Nick.Fredrickson, Spencer.Freundschuh, Karissa.Fried, Leander.Fuentes Ramos, Alejandro	.Fuentes Rivera, Cristian	.Fugate, Cody.Fullerton, Jessica.Gable-Wenner, Katelyn	.Gage, Jeremiah.Gallagher, Tommy.Gannon, Nathan.Garcia, Andy.Garcia, Beatriz	.Garcia, David	.Garcia, Dylan.Garcia, Melanie	.Garcia Rosas, Jose (Ever)	.Gardner, Ashley.Garofalo, Mariah.Garrity, Keaton.Garry, Logan.Gartzke, Maddie.Garvey, Jace	.Garvey, Jake	.Garza Miranda, Karen	.Gasdeski, Alison.Gehring, Jaida.Geissler, Nikita	.Gersemehl, Mike.Getchell, Breanna.Gilbertson, Cole	.Gilitiuk, Samantha (Morgan)	.Ginn, Donovan.Giza, Renee.Goetz, Delaney.Goetz, Riley.Gomez, Arthur.Gomez, Daisy	.Gonzales, Randy.Gonzales Sandoval, Rihanna.Gonzalez, Francisco	.Gonzalez Benitez, Marchaal	.Goodfellow, Connor.Goodfellow, Shelby.Goodwin, Chris	.Gordon, Austin	.Graff, Andrew	.Graham, Collin.Graham, Luke.Gramley, Camie.Granneman, Carter.Gransee Bowman, Daniel	.Gransee Bowman, Hunter	.Graske, Lucas.Grawe, Hannah.Gray, Brynne.Gray, Caroline.Gray, Isabel.Gray, Kylie.Green, Audrey.Grobe, Austin	.Grobe, Brittany.Grobe, Keagan.Grobe, T.J.	.Grosser, Garrett.Gruenhagen, Ava.Gruenhagen, Renn.Gruenwald, Anna (Anna-Clare).Guerber, Luc.Guggisburg, Isaac.Guyott, Madeline	.Guzman Castillo, Aldo	.Haagensen, Taylor.Haan, Blake.Haan, Raelyn.Hagen, Kara.Haileab, Delina.Halverson, Avea	.Halverson, Tara	.Hamilton, Katherine	.Hansen, Selena	.Hansen, Sierra	.Hanson, Seth	.Hardy, Peter	.Hargis, Anne.Harman, Brady.Harman, Zach.Harris, Amir.Harris, Jolee.Harron, Blayne.Hartley, Desarae.Haslett, Nicktae.Hassig, Delina.Hatfield, Brandon	.Hatfield, Dawson.Haugan, Brody	.Hayes, May.Heil, Noah.Hendershot, Draven.Henrickson, Roger.Hensley, Ashley.Hernandez, Alexandra	.Hernandez, Gabrielle	.Hernandez, Kimberly	.Hernandez, Priscila.Heyda, Josh.Higgins, Austin.Hines, Stefan.Hirdler, Katherine	.Hoban, Jena.Hodel, Julia.Hoekstra, Dayton.Hoff, Bergen.Hoffer, Preston	.Hofrenning, Theo	.Hohrman, Abigail	.Hollinger, Timmy	.Holman, Karl.Holman, Kate.Holzschuh, Dane	.Horn, Amy.Houts, Connor.Houts, Lainey.Hoyer, Sam.Hruza, Anna.Huber, Ethan.Huber, John (Jack).Hubert-peterson, Lydia.Huerta Garcia, Euciel	.Hummel, Greta.Huntington, Kayla	.Hurlbert, Emily.Hurlbert, Kindra.Ingersoll, Faith.Ingraham, Chase.Irwin, Matt.Israel, Jake.Iverson, Emma.Jackson, Taz'Ana	.James, Seth.Javner, Luke	.Jayceen, Jordan.Jeffrey, Brian	.Jeno, Brandon	.Jensen, Destiny.Jensen, Jon	.Jensen (graduated), Zach	.Jewison, Bethany.Jimmy, Samuel.Johnson, Andrew.Johnson, Andrew.Johnson, Chelsea	.Johnson, Kajsa.Johnson, Micahela.Jones, Collin	.Jones, Courteney.Jones, Dustin	.Jones, Dylan.Jones, Gwendalyn	.Jones, Hunter.Jones, Jayden.Jones, Lindsey.Kamish, Rose.Kane, Matt.Karins, Nick.Kasal, James.Kastan, Tristan.Kasten, Jens.Kayser, Drennan.Kayser, Nyah.Keilen, Miranda	.Keilen, Samantha	.Keiser, Alana	.Keita, Mimi (Maryam).Kell, Andrew	.Kell, Javier	.Kelley, Caitlin	.Kelly, Brendon.Kelly, Nick.Kelly, Peter	.Kennedy, Maggie.Keppers, Josh.Kersey, Madison	.Kidd, Kaylyn	.Kidd, Kimberly	.Kiefer, Alexis.Kimber, Cassidy.King, Carver	.King, Dylan.King, Logan	.Kinney, John.Kirchberg, Kellen.Kluttz, Shaheem.Kmoch, Willa.Knight, Brooklyn.Knight, Kalley.Knight, Lincoln	.Knight, Owen.Knutson, Julia	.Kocina, Brodey.Kocina, Tristin.Kokach, Frank.Koktavy, Caitlin.Kolb, Cassidy	.Kopas, Robert.Kovachev (Casulla), Kathryn	.Kramer, Jennifer.Kramer, Vivien.Krejce, Zoe.Kruger, Paige.Kruse, Elias.Kryzda, Cecilia.Kubes, Kayla.Kubes, Kaylee	.Kuehl, Osker.Kvestad, Amanda.Laabs, Brett	.Lafontaine, Kyle.Lager, Isaac.Lamont, Alyssa.Landsom, Taylor.Lane-getaz, Audrey.Lant, Zach.Larkin, Evan.Larkin, Veronica.Larock, Madison.Larscheid, Joseph.Larsen, Alex.Larson, Jared.Larson, Reianna.Larson, Reine.Lauseng, Trevor.Lazaro Marcial, Juan.Leal, Jenna.Lecaros, Marcelo.Ledman, Logan.Lee, Alex (Cookie).Lee, Allie.Lee, Asdis.Lee, Sarah.Legvold, Kai.Lenore, Gavin.Leonard, Isaac.Lepinski, Rachel.Lewis, Preston.Lien, Gabby.Line, Averie.Lino, Kaylee.Lino, Nick.Lombardi, Sophia.Lopez, Juan.Lopez Evje, Aaron.Lopez Evje, Nicholas.Lovestrand, Arye.Lovoll, Jon.Lucas, Ben.Luiken, Jayden.Lundgren, Kaylie.Lundgren, Landen.Lundstrom, Erik.Lundstrom, Fred.Lundstrom, Henry (David Henry).Luther, Brittney.Lutsky, Rosalind.Maas, Maddie.Mace, Skylar.Maciel, Bri.Madderom, Lily.Mahle, Isaac.Maki-waller, Halle.Maki-Waller, Saija.Malecha, Ryan	.Malek, Chelsea.Mandsager, Erik.Mandy, Andrew.Maniglia, Grace.Mansfield, Beau	.Mansfield, Payton.Marcum, Chalin	.Marek, Ashley.Marek, Nate.Marroquin-Haslett, Niktae.Marroquin-Haslett, William.Marshall, Avery.Martin, Cliff	.Martin, Easton.Martinez, Odalys	.Math, Oliver.Matson, Logan.Matson, Rachel	.Mattson, Theo.Mazurek, Elizabeth	.McCallum, Hannah	.McCallum, Isabell.McCracken, Brian.McCracken, Jenny (Jennifer).McDermott, Madeline.McDonnell, Anthony.McGaffey, Olivia	.McGahee, Daniel	.McGahee, Devontae	.McGovern, Jamie.McGregor, Connor.McLaughlin, Andrew.McMahon, Amanda.Mcnamara, Caitie.McNicholl, Tyler	.Meehan, Jordan	.Melendez, Armando	.Melendez, Christian	.Mendes, Joe.Merritt, Ricardo.Mesagna, Tre.Metcalf, Marissa.Meyer, Frank	.Meyers, Luke	.Mielke, Dustin.Miesen, Kaycie.Mikula, Sam.Miller, Christy	.Miller, Evan	.Miller, James.Miller, John.Moad, Audrey.Modtland Hughes, Nation.Mogren, Paul.Mohring, Piper.Mollenhauer, Mia.Montero, Diana.Moore, Bridget.Moore, Hannah.Moore, Kaylee.Moore, Lily.Moran Nieves, Yailyn	.Moravec, Devin.Morello, Jamie.Morello, Serena.Moreno, Jim	.Moreno Sanchez, Vania	.Morgan-Rush, Georgina.Morildo, Shay.Morris, Grace.Morris, Luke.Morrison, Scott	.Moses, Chelsea	.Moyer, Noah	.Muhlenbruck, Erik	.Muhlenbruck, Lauren.Muir, Mason.Mulford, Jake	.Munoz, Gaby	.Murillo Rosas, Jamielyn	.Murtha, Gabrielle.Nadav, Jayden.Nadeau, Tayden	.Namanny, Cohltin.Natold, Kayla.Naveja, Xochitl.Nelson, Ashlynn	.Nelson, Cassie	.Nelson, Haylee.Nelson, Piper.Neufeldt, Joseph	.Nguyen, Paul	.Nielsen, Chloe.Noel, Armando	.Noetzel, Ole	.North, Emily.Nustad, Monica.O'Connor, Brady.O'Donnel, Mariah.O'Donnell, Sonny.O'Leary, John	.Odette, Billy	.Odette, Jacob	.Oelkers, Rachel	.Ojala, Sullivan (Sully)	.Olien, Jenna.Olivo, Cynthia.Olivo, Mya.Olivo, Pedro.Olsen, Leif	.Olsen, Roy.Olson, Blane.Olson, Colby.Olson, Dylan.Olson, Hunter	.Olson, Jeremiah	.Olson, Jessica	.Olson, Josiah	.Olson, Maddie.Olson, Max.Olson, Micah.Olson, Todd.Olson, Trenton.Olsson, Ashley.Omoro, Elijah.Orozco, Mikayla Grace	.Orozco, Pablo	.Ortiz, Aldo	.Ortiz, Carmela	.Ortiz Jr., Rodrigo	.Osorio, Anthony	.Osorio, Christian	.Osorio, Jesus	.Otis, Simone	.Otten, Jakob.Overstreet, Jack.Ovol, Orvin.Paetzel, Evan	.Pahs, A.J..Pahs, Hannah.Pak, Lia.Parsons, Ethan	.Parsons, Skyler	.Paschall Zimbel, Merlin.Paulson, Geo (Treyvon)	.Payes, Alex.Payne, Max.Pedersen, Jeffrey	.Peine, Chris.Pepel, Alexandra.Pepel, Katie (Kaitlyn).Peralta Arroyo, Luis Antonio	.Perez, Alex.Perez, Claudia	.Perry, Nicholas (Nick).Pesta, Amanda.Peters, Jack.Peterson, Danielle.Peterson, Emma.Peterson, Kyrene.Picka, Isabel.Pietrzak, Brett.Pitz, Melissa	.Plank Arroyo, Elijah	.Playter, Hannah Grace.Poegel, Jesse	.Ponder, Annaleah (Annie).Ponder, Sami.Pontow, Haley.Pontow, Isaac.Price, Brett.Price, Kyra.Pritchard, Caroline.Prue, Sebastian.Pumper, Joshua	.Quintero, Jose Ivis	.Quiroga, Liliana.Quiroga, Viviana	.Radtke, Julia.Ramirez, Emmanuel (Manny)	.Ramirez, Rodolfo.Read, Elia	.Read, Isaiah.Rebhan, Jake.Rech, Darrion.Reese, Millie (Amelia).Regnier, Eli.Regnier, Griffen.Reiland, Joseph.Reiland, Rachel.Reineke, Michael	.Reller, Justin.Rendon, Sigwan	.Ress, Collin.Rezac, Elizabeth	.Rezac, Emma.Rezac, Jacob	.Rhodes, Austin.Rhyss, Kahee.Rice, Jaime	.Richardson, Annika.Richmond, Rayanah.Riehm, Matthew.Rienhe, Michael.Riggins, Isaac.Riggins, Olivia	.Riley, Cody.Riley, Nathan.Riley, Tessa.Ringdahl, Lucas.Ringlien, Hannah.Ripley, Lars.Rippentrop, Ariana.Rippentrop, Casey.Ritley, Josh.Rivera, Ella.Rivera, Ismael	.Rivera, Reyna	.Rodenberg, Anna.Roethle, Josh.Rohda, Brandon.Rom, Alex.Rosas, Abraham (AJ)	.Rosas, Linda	.Rosas Bermudez, Jeniffer	.Rosas Gomez, Juan.Rosener, Tasha.Ross, Andrew.Rowell, Kayla.Rozga, Chloe.Russel, Ricky.Ryan, Cole.Ryden, Sam.Rynkiewicz, Matt.Salaba, Kaitlin	.Salinas, Jorge	.Salzman, Cydney	.Sanchez, Francisco (Paco)	.Sanford, Andrea.Savage, Connor.Sayner, Emma.Scheuerman, Zach.Schiffer, Maddy.Schiller, Kane.Schlosser, David	.Schmelzer, Andrew.Schmidt, Liv.Schmitt, Olivia.Schmoll, Gabrielle.Schuerman, Jackson.Schultz, Brooke.Schultz, Tyler	.Schultz, Zachary	.Schuster, Seth.Schwartz, Alyssa.Schwartz, Jeanine.Schwartz, Mady.Schwartz, Megan.Schwieger, Alayna.Schwietz, Annika.Schwietz, Chloe.Scofield, Maya.Searcy, Cori	.Sears, Tanis.Seitz, John	.Seitz, Zoe.Sevcik, Jacob.Severson, Jordan.Shaff, Jeremy.Shannon, Mariah	.Sheehy, Will.Shelby, David.Shelby, Will.Sherman, Emily.Simonson, Emily	.Simonson, Sarah	.Sivanich, Katie.Sjolund, Abby.Skog, Rae.Skoglund, Andrew.Skoglund, Peter.Skroch, Sarah.Sletten, Kylie	.Slinger, Bridget.Smalley, Josiah.Smith, Bella.Smith, Connor.Smith, Courtney.Smith, Hunter.Smith, Tasha.Sokheng, Vichaney.Spillman, Trevor	.Stadler, Cooper	.Stadler, Isaac.Stadler, Isabelle.Stadler, Zach.Standfuss, Alexa.Stanton, Alexander	.Stanton, Jack	.Stanton, Mackenzie.Stegall, Caitlyn	.Stevenson, Tiana.Stinnett, Cameron.Studsdahl, Christian.Stulken, Benjamin	.Stulken, Jacob	.Suarez, Emanuel	.Suarez, Isaiah	.Suarez, Nico.Suarez Martinez, Jose	.Suhl, Tyreese.Suhl, Tyrone.Sullivan, Ana	.Sullivan, Jessica.Sullivan, Peyton.Sullivan, Ryan (W.M. Ryan).Svendahl, Jacob.Svendall, Jacob.Swanson, Oliver	.Swanson, Samantha.Swedin, Mariah	.Swenson, Cierra	.Swenson, Robert.Switzer, Alannah	.Tamayo, Leslie.Tarka, Josh.Taylor, Devin.Taylor, Steven.Tello, Noel.Thibodeau, Allen	.Thimsen, Jaykob	.Thomas, Taylor.Thompson, Nick.Tiger, Julian.Tilstra, Elijah.Tisdale, Christoph.Tisdale, Giselle	.Tisdale, Sienna	.Tjaden, Millie.Tmani, Colton.Tollefson, Savanah.Tolson, Eric.Tomonari, Megumi.Towley, Austin.Trahan, Ashley.Tran, Bao.Tranby, Leslie	.Trebelhorn, Alex	.Trnka, Nathan.Trujillo, Mariah	.Truong, Thao Da	.Tuchtenhagen, Talin	.Tuma, Gage	.Tuma, Megan	.Tuomala, Scott	.Underdahl, Brandon	.Urke, Nathaniel.Valdez, Armando	.Valek, Isac.Valeriano, Alexis	.Vander Martin, Levi.VanderArde, Mark	.VanRoekel, Jonathan.Vargas, Alexis.Vargas, Christian	.Vargas, Jefferson.Vasquez, Nicky.Vazquez, Jose (Junior)	.Vazquez, Yanessa	.Vega, Adrian	.Veil, Eleena.Velishaek, Angelina.Verdeja, Damien.Viola, Elijah.Viola, Isabella.Virgil, Isaiah	.Virgil, Jeremiah	.Voracek, Kyle	.Vosejpka, Elizabeth.Wachtler, Stevie	.Wagner, Kyle.Wagner, Lucy	.Waldron, Jade	.Waldron, Jasmine.Walker, Keegan.Wallin, Ashley.Walser Kuntz, Ryan.Walters, Lauren.Waltman, Jesse	.Wang (Glander Wang), Kaylee.Ward, Aspenn	.Warden, Jack	.Warren, Ellie.Weaver, Lila.Weber, Anna.Webster, Griffin.Weeks, Joshua.Weeks, River	.Wefel, Jayden.Wefel, Rylie.Wefel Cordes, Taylor	.Weimholt, Izzy.Weisberg, Benjamin	.Weise, Allison.Welbaum, Gustaf.Welch, Savannah.Welch, Toby.Wellentin, Shayden.Wells, Nelson.Weselmann, Evan	.Wesling, Connor (John Connor).Whitcomb, McKenna.Whitcomb, Nadia	.Whitcomb, Taliyah	.White, Chayce.Whitt, Travis.Wick, Mitchell.Wicklund, Nikolas	.Wierson, Kayla	.Williams, Maximillian.Willis, Gavin	.Winkelman, Katerina.Winkels, Nicholas.Winter, Bobby.Winter, Tom.Wiskus, Luke.Witron, Sydney.Woitalla, Jason.Woitalla, Jenna.Woitalla, Jessica.Wolf, Katlyn.Woods, Olivia	.Worden, Anna	.Worden, Dominick	.Wykes, Alice.Wykes, Amelia	.Xiao, Haowen (Steven).Yciano, Gabriella	.Yciano, Luis (Nico).Young, Julia.Younger, Cole.Zillmer, Rikka.Zubia, Adrian	.Zuccolotto, George"

    namesMediumRare = namesRaw.split('.')
    for nameUneditted in namesMediumRare:
        nameMedium = nameUneditted.rstrip()
        name = nameMedium.split(',')
        firstName = name[1]
        lastName = name[0]
        executeSingleQuery("INSERT INTO testStudents VALUES (%s, %s)", [firstName, lastName])

    