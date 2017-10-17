import flask 
from flask import request
import json
import psycopg2
import sys


#flask automatically serves everything in the static folder for us, which is really nice
app = flask.Flask(__name__)

@app.route('/')
def send_index():
    return "use /static/index.html instead"
    # this works, but then the app fails to get the other things in the static folder :(
    #return flask.current_app.send_static_file('index.html')

@app.route('/addText/', methods=['POST'])
def foo():
    #print(request.values)
    if request.method == 'POST':
        f = request.data
        print(f)
    return "hi front-end!"

"""
{
    firstName : "Jack",
    lastName : "Wines"
}
"""
@app.route('/addStudent/<firstName>/<lastName>')
def addAttendee(firstName):
    firstName = request.form.get('firstName')
    lastName  = request.form.get( 'lastName')
    print(firstName, lastName)
    
    conn = psycopg2.connect("dbname=compsTestDB user=ubuntu")
    cur = conn.cursor()
    cur.execute("INSERT INTO testStudents VALUES (%s, %s)", [firstName, lastName])
    conn.commit()
    cur.close()
    conn.close()
    return "\nHello frontend:)\n"


@app.route('/addStudent/<partialString>')
def autofill(partialString):
    print(partialString)
    
    conn = psycopg2.connect("dbname=compsTestDB user=ubuntu")
    cur = conn.cursor()
    
    q = lower(partialString)
    query = "SELECT * FROM testStudents WHERE firstname LIKE %" + q + "% OR lastname LIKE %" + q + "%;"
    cur.execute(query)
    databaseResult = databaseCursor.fetchall()
    suggestions = json.dumps(databaseResult[:10])
    
    conn.commit()
    cur.close()
    conn.close()
    return suggestions

def autofill(cur, conn, partialString):


if __name__ == "__main__":
    app.run(host= '0.0.0.0')
#sample function to make attendance sheet in database
if __name__ == '__main__':
    addAttendee('{"text": "AAAAAAAAHHH"}')
