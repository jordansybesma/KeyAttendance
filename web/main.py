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


# strictly test for now
# going to get today's data later
@app.route('/getAttendance/<date>')
def getAttendance(date):
    return json.dumps(executeSingleQuery("SELECT * FROM dailyAttendance WHERE date= '" + date + "';",
        fetch = True), indent=4, sort_keys=True, default=str)

@app.route('/getLogin/<login>')
def getLogin(login):
    nameList = login.split()
    user = nameList[0]
    password = nameList[1]
    query = "SELECT * FROM login WHERE username = '" + user + "' AND password = '" + password + "';"
    return json.dumps(executeSingleQuery(query,
        fetch = True), indent=4, sort_keys=True, default=str)
@app.route('/getMasterAttendance')
def getMasterAttendance():
    return json.dumps(executeSingleQuery("SELECT DISTINCT * FROM masterAttendance ORDER BY date DESC;",
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

@app.route('/tempLogin', methods=["POST"])
def tempLogin():
    query = "DROP TABLE IF EXISTS login;"
    query2 = "CREATE TABLE login (username varchar(255), password varchar(255));"
    query3 = "INSERT INTO login values ('user1', 'password1');"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])
    executeSingleQuery(query3, [])

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
        query = "SELECT id FROM testStudents WHERE firstName LIKE '%" + firstName + "%' OR lastName LIKE '%" + lastName + "%';"
        databaseResult = executeSingleQuery(query, fetch = True)
        print(databaseResult[0][0])
        newString = "INSERT INTO dailyAttendance VALUES ('" + str(databaseResult[0][0]) + "', '" + firstName + "', '" +lastName +"', 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE', '" + date + "','" + time + "');"
        #newString = "INSERT INTO dailyAttendance VALUES " + databaseResult[0] + ", " + firstName + ", " + lastName
        executeSingleQuery(newString, [])
        queryMaster = "SELECT numAttend FROM masterAttendance WHERE date = '" + date + "';"
        #result = executeSingleQuery(queryMaster)
        result = json.dumps(executeSingleQuery(queryMaster,fetch = True))
        newResult =json.loads(result)

        if newResult == []:
            newQuery = "INSERT INTO masterAttendance VALUES('" + date + "', '1', '0', '0', '0', '0', '0', '0', '0', '0');"
            executeSingleQuery(newQuery, [])
        else:
            print(newResult)
            numAttend = newResult[0][0]
            #print(result)
            print(numAttend)
            newNumAttend = numAttend + 1
            alterQuery = "UPDATE masterAttendance SET numAttend = '" + str(newNumAttend) + "' WHERE date = '" + date + "';"
            executeSingleQuery(alterQuery, [])


# If more than one "same name" student is available, return students

        if len(databaseResult) > 1:
            return json.dumps(databaseResult[:10])
        elif len(databaseResult) == 0:
            return "false"

# Roughly informed by https://www.postgresql.org/docs/9.6/static/app-psql.html#APP-PSQL-META-COMMANDS-COPY
@app.route('/download/<tableName>')
def downloadAttendanceSheet(tableName):
    query = "SELECT * FROM " + tableName + ";"
    databaseResult = executeSingleQuery(query, fetch = True)
    result = json.dumps(databaseResult)

    # csv = ""
    # for attendee in result:
    #     csv = "#" + attendee[0] + "," + attendee[1] + "," + attendee[2] + csv
    # csv = csv[1:]
    # csv = csv.replace("#", "\n")

    return result

"""
    Literally just takes a string. Compares both first and last name.
"""
@app.route('/autofill/<partialString>')
def autofill(partialString):
    nameList = partialString.split()
    if (len(nameList) > 1):
        first = nameList[0].upper()
        last = nameList[1].upper()
        query = "SELECT * FROM testStudents WHERE UPPER(firstName) LIKE '%" + first + "%' OR UPPER(lastName) LIKE '%" + last + "%';"
    else:
        q = partialString.upper()
        query = "SELECT * FROM testStudents WHERE UPPER(firstName) LIKE '%" + q + "%' OR UPPER(lastName) LIKE '%" + q + "%';"
    databaseResult = executeSingleQuery(query, fetch = True)
    suggestions = json.dumps(databaseResult[:10])
    return suggestions

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

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "local":
        app.run()
    else:
        app.run(host='ec2-35-160-216-144.us-west-2.compute.amazonaws.com')
