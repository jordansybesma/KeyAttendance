import flask 
from flask import request
import json
import psycopg2
import sys


#flask automatically serves everything in the static folder for us, which is really nice
app = flask.Flask(__name__)

@app.route('/')
def send_index():
    return flask.redirect("static/index.html", code=302)
    # this works, but then the app fails to get the other things in the static folder :(
    #return flask.current_app.send_static_file('index.html')

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
@app.route('/addStudent/', methods = ["POST"])
def addAttendee():
    firstName = request.form.get('firstName')
    lastName  = request.form.get( 'lastName')
    executeSingleQuery("INSERT INTO testStudents VALUES (%s, %s)", [firstName, lastName])
    return "\nHello frontend:)\n"

"""
    Literally just takes a string. Compares both first and last name.
"""
@app.route('/autofill/<partialString>')
def autofill(partialString):
    q = partialString.lower()
    query = "SELECT * FROM testStudents WHERE firstname LIKE '%" + q + "%' OR lastname LIKE '%" + q + "%';"
    databaseResult = executeSingleQuery(query, fetch = True)
    suggestions = json.dumps(databaseResult[:10])
    return suggestions



if __name__ == "__main__":
    app.run(host= '0.0.0.0')
#sample function to make attendance sheet in database
if __name__ == '__main__':
    addAttendee('{"text": "AAAAAAAAHHH"}')

