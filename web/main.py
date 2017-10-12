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
        
    

def addAttendee(someJSON):
    convertedJSON = json.loads(someJSON)
    print(convertedJSON["text"])
    conn = psycopg2.connect("dbname=compsTestDB user=ubuntu")
    cur = conn.cursor()
    cur.execute("DROP TABLE IF EXISTS testAttendance;")
    cur.execute("CREATE TABLE testAttendance (myText text);")
    cur.execute("INSERT INTO testAttendance (myText) VALUES (%s)", (convertedJSON["text"],))
    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    app.run()
#sample function to make attendance sheet in database
if __name__ == '__main__':
    addAttendee('{"text": "AAAAAAAAHHH"}')
