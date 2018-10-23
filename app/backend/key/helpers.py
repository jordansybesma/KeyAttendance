import datetime

# Helper function that determines if an input string is a valid datetime
def isValidDateTime(text):
    try:
        datetime.datetime.strptime(text, '%Y-%m-%d')
        return True
    except ValueError:
        return False