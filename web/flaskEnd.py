import backEnd
import flask
from flask import request
import sys
#sys.stdout = open('output.logs', 'a')

#flask automatically serves everything in the static folder for us, which is really nice
app = flask.Flask(__name__)

@app.route('/')
def send_index():
    return flask.redirect("static/index.html", code=302)

'''
@app.route('/')
def loginPage():
    return flask.redirect("static/login.html", code=302)
'''

@app.route('/main')
def main():
    return flask.redirect("static/index.html", code=302)


@app.route('/addText/', methods=['POST'])
def foo():
    return backEnd.foo(request)


@app.route('/getReports')
def getReports():
    return backEnd.getReports()

@app.route('/createAttendanceData/', methods = ["POST"])
def createAttendanceData():
    return backEnd.createAttendanceData(request)

@app.route('/addNewStudent/', methods = ["POST"])
def addNewStudent():
    return backEnd.addNewStudent(request)

@app.route('/updateStudentInfo/', methods = ["POST"])
def updateStudentInfo():
    return backEnd.updateStudentInfo(request)


@app.route('/uniqueAttendance/')
def uniqueAttendance():
    return backEnd.uniqueAttendance()

@app.route('/getStudentInfo/<name>')
def getStudentInfo(name):
    return backEnd.getStudentInfo(name)

@app.route('/addStudentColumn', methods = ["POST"])
def addStudentColumn():
    return backEnd.addStudentColumn(request)

@app.route('/alterStudentColumn', methods = ["POST"])
def alterStudentColumn():
    return backEnd.alterStudentColumn(request)

@app.route('/deleteStudentColumn', methods = ["POST"])
def deleteStudentColumn():
    return backEnd.deleteStudentColumn(request)

@app.route('/getStudentColumns')
def getStudentColumns():
    return backEnd.getStudentColumns()

@app.route('/sendFeedback', methods = ["POST"])
def sendFeedback():
    return backEnd.sendFeedback(request)

@app.route('/getAttendance/<date>')
def getAttendance(date):
    return backEnd.getAttendance(date)

@app.route('/getLogin/<login>')
def getLogin(login):
    return backEnd.getLogin(login)

@app.route('/getStudentAttendance/<student>/')
def getStudentAttendance(student):
    return backEnd.getStudentAttendance(student)

@app.route('/getMasterAttendance')
def getMasterAttendance():
    return backEnd.getMasterAttendance()

@app.route('/addAttendanceColumn', methods = ["POST"])
def addAttendanceColumn():
    return backEnd.addAttendanceColumn(request)

@app.route('/deleteAttendanceColumn', methods = ["POST"])
def deleteAttendanceColumn():
    return backEnd.deleteAttendanceColumn(request)

@app.route('/updateAttendanceColumn', methods = ["POST"])
def updateAttendanceColumn():
    return backEnd.updateAttendanceColumn(request)

@app.route('/getAttendanceColumns')
def getAttendanceColumns():
    return backEnd.getAttendanceColumns()

@app.route('/moveAttendanceColumnUp', methods = ["POST"])
def moveAttendanceColumnUp():
    return backEnd.moveAttendanceColumnUp(request)

@app.route('/getMasterAttendanceDate/<dates>')
def getMasterAttendanceDate(dates):
    return backEnd.getMasterAttendanceDate(dates)

@app.route('/deleteAttendant', methods = ["POST"])
def deleteAttendant():
    return backEnd.deleteAttendant(request)

@app.route('/getDates')
def getDates():
    return backEnd.getDates()

@app.route('/selectActivity', methods = ["POST"])
def selectActivity():
    return backEnd.selectActivity(request)

@app.route('/addAttendant/', methods = ["POST"])
def addAttendant():
    return backEnd.addAttendant(request)

@app.route('/getNumberAttended/<string>')
def getNumberAttended(string):
    return backEnd.getNumberAttended(string)


@app.route('/autofill/<partialString>')
def autofill(partialString):
    return backEnd.autofill(partialString)

@app.route('/frequentPeers/<string>')
def frequentPeers(string):
    return backEnd.frequentPeers(string)

@app.route('/studentProfile/<string>')
def studentProfile(string):
    return backEnd.studentProfile(string)

@app.route('/getID/<string>')
def getStudentID(string):
    return backEnd.getStudentID(string)

@app.route('/getStudentByID/<string>')
def getStudentByID(string):
    return backEnd.getStudentByID(string)

@app.route('/getJustID/<string>')
def getJustID(string):
    return backEnd.getJustID(string)

@app.route('/getAlerts')
def getAlerts():
    return backEnd.getAlerts()

@app.route('/addAlert/', methods = ["POST"])
def addAlert():
    return backEnd.addAlert(request)

@app.route('/checkAlert/', methods = ["POST"])
def checkAlert():
    return backEnd.checkAlert(request)

@app.route('/getPhoto/<string>')
def getPhoto(string):
    return backEnd.getPhoto(string)

@app.route('/uploadPicture', methods = ["POST"])
def uploadPicture():
    studentid = request.form["id"]
    return backEnd.getPhoto(studentid)


if __name__ == "__main__":
   # print("Site booting up...")
    if len(sys.argv) > 1 and sys.argv[1] == "local":
        app.run()
    else:
        app.run(host='ec2-35-160-216-144.us-west-2.compute.amazonaws.com')
