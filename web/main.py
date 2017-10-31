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
@app.route('/getAttendance')
def getAttendance():
    return json.dumps(executeSingleQuery("SELECT * FROM testattendance",
        fetch = True))

@app.route('/addAttendant/', methods = ["POST"])
def addAttendant():
    print(json.decode(request.data))
    firstName = request.form.get('firstName')
    lastName  = request.form.get( 'lastName')
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
    #q = partialString.lower()
    nameList = string.split()
    first = nameList[0]
    last = nameList[1]
    query = "SELECT id FROM testStudents WHERE firstName LIKE '%" + first + "%' OR lastName LIKE '%" + last + "%';"
    databaseResult = executeSingleQuery(query, fetch = True)

    #query = "SELECT * FROM testStudents WHERE firstName LIKE '%" + q + "%' OR lastName LIKE '%" + q + "%';"
    databaseResult = executeSingleQuery(query, fetch = True)
    suggestions = json.dumps(databaseResult)
    return suggestions

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
    return autofill(string)

if __name__ == "__main__":
    app.run(host='ec2-35-160-216-144.us-west-2.compute.amazonaws.com')
    # if len(sys.args) > 1 and sys.args[1] == "local":
    #     #app.run()
    # else:
    #     app.run(host='ec2-35-160-216-144.us-west-2.compute.amazonaws.com')
