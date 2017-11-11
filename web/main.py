import flask
from flask import request
import json
import psycopg2
import sys
import datetime



#flask automatically serves everything in the static folder for us, which is really nice
app = flask.Flask(__name__)

@app.route('/')
def send_index():
    return flask.redirect("static/index.html", code=302)

'''@app.route('/')
def loginPage():
    return flask.redirect("static/login.html", code=302)

@app.route('/main')
def main():
    return flask.redirect("static/index.html", code=302)'''

@app.route('/addText/', methods=['POST'])
def foo():
    #print(request.values)
    if request.method == 'POST':
        f = request.data
        print(f)
    return "hi front-end!"

def executeSingleQuery(query, params = [], fetch = False):
    print(query, params)
    conn = psycopg2.connect("dbname=compsTestDB user=ubuntu")
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
@app.route('/addNewStudent/', methods = ["POST"])
def addNewStudent():
    firstName = request.form.get('firstName')
    lastName  = request.form.get( 'lastName')
    executeSingleQuery("INSERT INTO testStudents VALUES (%s, %s)", [firstName, lastName])
    return "\nHello frontend:)\n"

@app.route('/updateStudentInfo/', methods = ["POST"])
def updateStudentInfo():
    name = request.form.get('name')
    nameList = name.split()
    first = nameList[0]
    last = nameList[1]
    column = request.form.get('column')
    value = request.form.get('value')
    if (value == "TRUE"):
        curVal = json.dumps(executeSingleQuery("SELECT " + column + " FROM testStudents WHERE firstname = '" + first + "' and lastName = '" + last + "';", []))
        print(curVal)
        if "true" in curVal:
            query = "UPDATE testStudents SET "+ column + " = 'FALSE' WHERE firstName = '" + first + "' AND lastName = '" + last + "';"
        else:
            query = "UPDATE testStudents SET "+ column + " = 'TRUE' WHERE firstName = '" + first + "' AND lastName = '" + last + "';"
    else:         
        query = "UPDATE testStudents SET "+ column + " = '" + value +"' WHERE firstName = '" + first + "' AND lastName = '" + last + "';"
    executeSingleQuery(query, [])
    return "all good"



@app.route('/getStudentInfo/<name>')
def getStudentInfo(name):
    print("got here")
    nameList = name.split()
    first = nameList[0]
    last = nameList[1]
    query = "SELECT * FROM testStudents WHERE firstName = '" + first + "' AND lastName = '" + last + "';"
    result = json.dumps(executeSingleQuery(query, fetch = True), indent=4, sort_keys=True, default=str)
    print(result)
    return result



@app.route('/tempStudentColumns', methods=["POST"])
def tempStudentColumns():
    query = query = "DROP TABLE IF EXISTS studentColumns;"
    query2 = "CREATE TABLE studentColumns (isShowing boolean, isQuick boolean, name varchar(255), type varchar(255),definedOptions varchar(1000), priority SERIAL UNIQUE)"

    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])


@app.route('/addStudentColumn', methods=["POST"])
def addStudentColumn():
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

@app.route('/alterStudentColumn', methods=["POST"])
def alterStudentColumn():
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

@app.route('/deleteStudentColumn', methods=["POST"])
def deleteStudentColumn():
    name = request.form.get("name")
    query = "DELETE FROM studentColumns WHERE name = '" + name + "';"
    query2 = "ALTER TABLE testStudents DROP COLUMN " + name + ";"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])

@app.route('/getStudentColumns')
def getStudentColumns():
    query = "SELECT * FROM studentColumns ORDER BY priority"
    return json.dumps(executeSingleQuery(query, fetch = True), indent=4, sort_keys=True, default=str)

@app.route('/sendFeedback', methods=["POST"])
def sendFeedback():
    feedback = request.form.get('feedback')
    date = request.form.get('date')
    query = "INSERT INTO feedback VALUES ('" + date +"', '" + feedback + "');"
    executeSingleQuery(query,[])


# strictly test for now
# going to get today's data later
@app.route('/getAttendance/<date>')
def getAttendance(date):
    queryColumns = "SELECT name FROM attendanceColumns ORDER BY priority;"
    cols = json.dumps(executeSingleQuery(queryColumns, fetch = True), indent=4, sort_keys=True, default=str)
    colList = json.loads(cols)
    query = "SELECT firstName, lastName, " + colList[0][0];
    for i in range(1, len(colList)):
        query = query + ", " + colList[i][0]
    query = query + " FROM dailyAttendance WHERE date= '" + date + "' ORDER BY lastName ASC;"

    queryResult = executeSingleQuery(query, fetch = True)
    result = json.dumps(queryResult, indent=4, sort_keys=True, default=str)
    return result

@app.route('/getLogin/<login>')
def getLogin(login):
    nameList = login.split()
    user = nameList[0]
    password = nameList[1]
    query = "SELECT * FROM login WHERE username = '" + user + "' AND password = '" + password + "';"
    return json.dumps(executeSingleQuery(query,
        fetch = True), indent=4, sort_keys=True, default=str)

@app.route('/getStudentAttendance/<student>/')
def getStudentAttendance(student):
    nameList = student.split()
    first = nameList[0]
    last = nameList[1]
    query = "SELECT * FROM dailyAttendance WHERE firstName = '" + first + "' AND lastName = '" + last + "' ORDER BY date DESC;"
    return json.dumps(executeSingleQuery(query,
        fetch = True), indent=4, sort_keys=True, default=str)

@app.route('/getMasterAttendance')
def getMasterAttendance():
    return json.dumps(executeSingleQuery("SELECT DISTINCT * FROM masterAttendance ORDER BY date DESC;",
        fetch = True)[:10], indent=4, sort_keys=True, default=str)


@app.route('/tempColumns', methods=["POST"])
def tempColumns():
    query = query = "DROP TABLE IF EXISTS attendanceColumns;"
    query2 = "CREATE TABLE attendanceColumns (inUse boolean, isShowing boolean, name varchar(255), type varchar(255), isParent boolean, isChild boolean, parent varchar(255), priority SERIAL UNIQUE)"
    query3 = "INSERT INTO attendanceColumns (inUse, isShowing, name, type, isParent, isChild, parent) VALUES ('true','true','art','boolean','false','false',''),('true','true','madeFood','boolean','false','false',''),('true','true','recievedFood','boolean','false','false',''),('true','true','leadership','boolean','false','false',''),('true','true','exersize','boolean','false','false',''),('true','true','mentalHealth','boolean','false','false',''),('true','true','volunteering','boolean','false','false',''),('true','true','oneOnOne','boolean','false','false',''),('true','false','comments','varchar','false','false','');"

    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])
    executeSingleQuery(query3, [])


@app.route('/addAttendanceColumn', methods=["POST"])
def addAttendanceColumn():
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

@app.route('/deleteAttendanceColumn', methods=["POST"])
def deleteAttendanceColumn():
    name = request.form.get("name")
    query = "DELETE FROM attendanceColumns WHERE name = '" + name + "';"
    queryAttendance = "ALTER TABLE dailyAttendance DROP COLUMN " + name + ";"
    queryMaster = "ALTER TABLE masterAttendance DROP COLUMN " + name + ";"

    executeSingleQuery(query, [])
    executeSingleQuery(queryAttendance, [])
    executeSingleQuery(queryMaster, [])


@app.route('/updateAttendanceColumn', methods=["POST"])
def updateAttendanceColumn():
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


@app.route('/getAttendanceColumns')
def getAttendanceColumns():
    query = "SELECT * FROM attendanceColumns ORDER BY priority"
    return json.dumps(executeSingleQuery(query, fetch = True), indent=4, sort_keys=True, default=str)

@app.route('/tempAlter', methods=["POST"])
def tempAlter():
    query = "ALTER TABLE attendanceColumns ADD priority int;"
    query2 = "UPDATE attendanceColumns set priority = '1' WHERE name = 'art';"
    query3 = "UPDATE attendanceColumns set priority = '2' WHERE name = 'madeFood';"
    query4 = "UPDATE attendanceColumns set priority = '3' WHERE name = 'recievedFood';"
    query5 = "UPDATE attendanceColumns set priority = '4' WHERE name = 'leadership';"
    query6 = "UPDATE attendanceColumns set priority = '5' WHERE name = 'exersize';"
    query7 = "UPDATE attendanceColumns set priority = '6' WHERE name = 'mentalHealth';"
    query8 = "UPDATE attendanceColumns set priority = '7' WHERE name = 'volunteering';"
    query9 = "UPDATE attendanceColumns set priority = '8' WHERE name = 'oneOnOne';"
    query10 = "UPDATE attendanceColumns set priority = '9' WHERE name = 'comments';"
    query11 = "UPDATE attendanceColumns set isShowing = 'false' WHERE name = 'comments';"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])
    executeSingleQuery(query3, [])
    executeSingleQuery(query4, [])
    executeSingleQuery(query5, [])
    executeSingleQuery(query6, [])
    executeSingleQuery(query7, [])
    executeSingleQuery(query8, [])
    executeSingleQuery(query9, [])
    executeSingleQuery(query10, [])
    executeSingleQuery(query11, [])

# must give start and end date separated by a space
@app.route('/getMasterAttendanceDate/<dates>')
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



@app.route('/deleteAttendant', methods = ["POST"])
def deleteAttendant():
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
        if rowData[0][3] == True:
            decreaseActivityCount("art", date, False)
        if rowData[0][4] == True:
            decreaseActivityCount("madeFood", date, False)
        if rowData[0][5] == True:
            decreaseActivityCount("recievedFood", date, False)
        if rowData[0][6] == True:
            decreaseActivityCount("leadership", date, False)
        if rowData[0][7] == True:
            decreaseActivityCount("exersize", date, False)
        if rowData[0][8] == True:
            decreaseActivityCount("mentalHealth", date, False)
        if rowData[0][9] == True:
            decreaseActivityCount("volunteering", date, False)
        if rowData[0][10] == True:
            decreaseActivityCount("oneOnOne", date, False)


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

@app.route('/getDates')
def getDates():
    query = "SELECT DISTINCT date FROM dailyAttendance ORDER BY date DESC"
    return json.dumps(executeSingleQuery(query,fetch = True)[:10], indent=4, sort_keys=True, default=str)

@app.route('/temp', methods=["POST"])
def temp():
    query = "DROP TABLE IF EXISTS dailyAttendance;"
    query2 = "CREATE TABLE dailyAttendance (id int, firstName varchar(255), lastName varchar(255), art boolean, madeFood boolean, recievedFood boolean, leadership boolean, exersize boolean, mentalHealth boolean, volunteering boolean, oneOnOne boolean, comments varchar(1000), date date, time time)"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])

@app.route('/tempAdd', methods=["POST"])
def tempAdd():
    query = "INSERT INTO masterAttendance VALUES ('2017-11-02', '55', '20', '4', '5', '2', '10', '5', '0', '1'), ('2017-11-01', '65', '23', '6', '5', '12', '5', '7', '2', '5'), ('2017-10-31', '88', '10', '30', '15', '0', '2', '6', '2', '0'), ('2017-10-30', '100', '22', '2', '10', '1', '11', '4', '1', '2');"
    executeSingleQuery(query, [])

@app.route('/tempMaster', methods=["POST"])
def tempMaster():
    query = "DROP TABLE IF EXISTS masterAttendance;"
    query2 = "CREATE TABLE masterAttendance (date date, numAttend int, art int, madeFood int, recievedFood int, leadership int, exersize int, mentalHealth int, volunteering int, oneOnOne int);"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])

@app.route('/tempFiller', methods=["POST"])
def tempFiller():
    query = "INSERT INTO dailyAttendance VALUES ('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-30','16:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-29','18:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-27','18:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-25','16:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-21','15:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-19','17:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-15','17:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-12','16:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-11','19:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-10','15:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-06','17:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-05','18:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-01','16:00:00');"
    executeSingleQuery(query, [])
    return ""
@app.route('/tempLogin', methods=["POST"])
def tempLogin():
    query = "DROP TABLE IF EXISTS login;"
    query2 = "CREATE TABLE login (username varchar(255), password varchar(255));"
    query3 = "INSERT INTO login values ('user1', 'password1');"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])
    executeSingleQuery(query3, [])
    return ""

@app.route('/tempFeedback', methods=["Post"])
def tempFeedback():
    query = "DROP TABLE IF EXISTS feedback;"
    query2 = "CREATE TABLE feedback (date date, comment varchar(2000));"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])
    return ""

@app.route('/selectActivity', methods=["POST"])
def selectActivity():
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


@app.route('/addAttendant/', methods = ["POST"])
def addAttendant():
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
@app.route('/autofill/<partialString>')
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

@app.route('/frequentPeers/<string>')
def frequentPeers(string):
    studentID = getJustID(string)
    query = "SELECT date FROM dailyAttendance WHERE id = '" + studentID + "';"
    # databaseResult = executeSingleQuery(query, fetch = True)
    # print(databaseResult)
    # result = str(databaseResult)
    # return(result)
    result = json.dumps(executeSingleQuery(query, fetch = True), indent=4, sort_keys=True, default=str)
    result = result.replace("\n","").replace(" ","").replace("[", "").replace("]", "").replace("\"","")
    result = result.split(",")



    for i in range(0, len(result)):
        print(result[i])
        query2 = "SELECT id, time FROM dailyAttendance WHERE date = '" + result[i] + "';"
        print(query2)
        curResult = json.dumps(executeSingleQuery(query2, fetch = True), indent=4, sort_keys=True, default=str)
        curResult = curResult.replace("\n", "").replace("[", "").replace(" ", "").replace("]","")
        curResult = curResult.split(",")
        print(curResult)

    return "HELLO"

@app.route('/studentProfile/<string>')
def studentProfile(string):
    nameList = string.split()
    first = nameList[0]
    last = nameList[1]
    query = "SELECT id FROM testStudents WHERE firstName LIKE '%" + first + "%' OR lastName LIKE '%" + last + "%';"
    databaseResult = executeSingleQuery(query, fetch = True)
    result = json.dumps(databaseResult)
    return result

# @app.route('/getID/<string>')
# def getStudentID(string):
#     nameList = string.split()
#     first = nameList[0].upper()
#     last = nameList[1].upper()
#     query = "SELECT id FROM teststudents WHERE UPPER(firstname) LIKE '%" + first + "%' AND UPPER(lastname) LIKE '%" + last + "%';"
#     databaseResult = executeSingleQuery(query, fetch = True)
#     return databaseResult;

@app.route('/getID/<string>')
def getStudentID(string):
    print("GetID called")
    return autofill(string)

@app.route('/getJustID/<string>')
def getJustID(string):
    nameList = string.split()
    first = nameList[0].upper()
    last = nameList[1].upper()
    query = "SELECT id FROM teststudents WHERE UPPER(firstname) LIKE '%" + first + "%' AND UPPER(lastname) LIKE '%" + last + "%';"
    databaseResult = executeSingleQuery(query, fetch = True)
    print(databaseResult[0][0])
    result = json.dumps(databaseResult[0][0])
    return result

@app.route('/getAlerts')
def getAlerts():
    query = "SELECT testStudents.firstName, testStudents.lastName, alerts.alert FROM testStudents, alerts WHERE alerts.completed = FALSE;"
    databaseResult = executeSingleQuery(query, fetch = True)
    return json.dumps(databaseResult)

@app.route('/addAlert', methods = ["POST"])
def addAlert():
    id = request.form.get('id')
    alert = request.form.get('alert')
    query = ("INSERT INTO alerts VALUES (%s, %s, %s)", [id, alert, 'FALSE'])
    databaseResult = executeSingleQuery(query, fetch = True)

@app.route('/checkAlert', methods = ["POST"])
def checkAlert():
    id = request.form.get('id')
    alert = request.form.get('alert')
    query = ("INSERT INTO alerts VALUES (%s, %s, %s)", [id, alert, 'FALSE'])
    databaseResult = executeSingleQuery(query, fetch = True)



if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "local":
        app.run()
    else:
        app.run(host='ec2-35-160-216-144.us-west-2.compute.amazonaws.com')
