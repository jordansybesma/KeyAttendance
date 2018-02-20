import newBackEnd
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
    return newBackEnd.foo(request)


@app.route('/getReports')
def getReports():
    return newBackEnd.getReports()

@app.route('/createAttendanceData/', methods = ["POST"])
def createAttendanceData():
    return newBackEnd.createAttendanceData(request)

@app.route('/addNewStudent/', methods = ["POST"])
def addNewStudent():
    return newBackEnd.addNewStudent(request)

@app.route('/updateStudentInfo/', methods = ["POST"])
def updateStudentInfo():
    return newBackEnd.updateStudentInfo(request)

@app.route('/getStudentInfo/<name>')
def getStudentInfo(name):
    return newBackEnd.getStudentInfo(name)

@app.route('/addStudentColumn', methods = ["POST"])
def addStudentColumn():
    return newBackEnd.addStudentColumn(request)

@app.route('/alterStudentColumn', methods = ["POST"])
def alterStudentColumn():
    return newBackEnd.alterStudentColumn(request)

@app.route('/deleteStudentColumn', methods = ["POST"])
def deleteStudentColumn():
    return newBackEnd.deleteStudentColumn(request)

@app.route('/getStudentColumns')
def getStudentColumns():
    return newBackEnd.getStudentColumns()

@app.route('/sendFeedback', methods = ["POST"])
def sendFeedback():
    return newBackEnd.sendFeedback(request)

@app.route('/getAttendance/<date>')
def getAttendance(date):
    return newBackEnd.getAttendance(date)

@app.route('/getLogin/<login>')
def getLogin(login):
    return newBackEnd.getLogin(login)

@app.route('/getStudentAttendance/<student>/')
def getStudentAttendance(student):
    return newBackEnd.getStudentAttendance(student)

@app.route('/getMasterAttendance')
def getMasterAttendance():
    return newBackEnd.getMasterAttendance()

@app.route('/addAttendanceColumn', methods = ["POST"])
def addAttendanceColumn():
    return newBackEnd.addAttendanceColumn(request)

@app.route('/deleteAttendanceColumn', methods = ["POST"])
def deleteAttendanceColumn():
    return newBackEnd.deleteAttendanceColumn(request)

@app.route('/updateAttendanceColumn', methods = ["POST"])
def updateAttendanceColumn():
    return newBackEnd.updateAttendanceColumn(request)

@app.route('/getAttendanceColumns')
def getAttendanceColumns():
    return newBackEnd.getAttendanceColumns()

@app.route('/moveAttendanceColumnUp', methods = ["POST"])
def moveAttendanceColumnUp():
    return newBackEnd.moveAttendanceColumnUp(request)

@app.route('/getMasterAttendanceDate/<dates>')
def getMasterAttendanceDate(dates):
    return newBackEnd.getMasterAttendanceDate(dates)

@app.route('/deleteAttendant', methods = ["POST"])
def deleteAttendant():
    return newBackEnd.deleteAttendant(request)

@app.route('/getDates')
def getDates():
    return newBackEnd.getDates()

@app.route('/selectActivity', methods = ["POST"])
def selectActivity():
    return newBackEnd.selectActivity(request)

@app.route('/addAttendant/', methods = ["POST"])
def addAttendant():
    return newBackEnd.addAttendant(request)

@app.route('/getNumberAttended/<string>')
def getNumberAttended(string):
    return newBackEnd.getNumberAttended(string)


@app.route('/autofill/<partialString>')
def autofill(partialString):
    return newBackEnd.autofill(partialString)

@app.route('/frequentPeers/<string>')
def frequentPeers(string):
    return newBackEnd.frequentPeers(string)

@app.route('/studentProfile/<string>')
def studentProfile(string):
    return newBackEnd.studentProfile(string)

@app.route('/getID/<string>')
def getStudentID(string):
    return newBackEnd.getStudentID(string)

@app.route('/getStudentByID/<string>')
def getStudentByID(string):
    return newBackEnd.getStudentByID(string)

@app.route('/getJustID/<string>')
def getJustID(string):
    return newBackEnd.getJustID(string)

@app.route('/getAlerts')
def getAlerts():
    return newBackEnd.getAlerts()

@app.route('/addAlert/', methods = ["POST"])
def addAlert():
    return newBackEnd.addAlert(request)

@app.route('/checkAlert/', methods = ["POST"])
def checkAlert():
    return newBackEnd.checkAlert(request)

@app.route('/getPhoto/<string>')
def getPhoto():
    return newBackEnd.getPhoto(string)


if __name__ == "__main__":
   # print("Site booting up...")
    if len(sys.argv) > 1 and sys.argv[1] == "local":
        app.run()
    else:
        app.run(host='ec2-35-160-216-144.us-west-2.compute.amazonaws.com')
