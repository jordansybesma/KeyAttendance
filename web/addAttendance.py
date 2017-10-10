#sample function to make attendance sheet in database


import flask
import json
import psycopg2
import sys


def addAttendee(someJSON):
    convertedJSON = json.loads(someJSON)
    print(convertedJSON["text"])
    




if __name__ == '__main__':
    addAttendee('{"text": "AAAAAAAAHHH"}')
