#sample function to make attendance sheet in database


import flask
import json
import psycopg2
import sys


def addAttendee(someJSON):
    convertedJSON = json.loads(someJSON)
    print(convertedJSON["text"])
    conn = psycopg2.connect("dbname=compsTestDB user=ubuntu")
    cur = conn.cursor()
    cur.execute("DROP TABLE IF EXISTS testAttendance;")
    cur.execute("CREATE TABLE testAttendance (myText text);")
    cur.execute("INSERT INTO testAttendance (text) VALUES (%s)", ("AAAAAAHH",))
    conn.commit()
    cur.close()
    conn.close()






if __name__ == '__main__':
    addAttendee('{"text": "AAAAAAAAHHH"}')
