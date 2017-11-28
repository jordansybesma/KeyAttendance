def temp():
    query = "DROP TABLE IF EXISTS dailyAttendance;"
    query2 = "CREATE TABLE dailyAttendance (id int, firstName varchar(255), lastName varchar(255), art boolean, madeFood boolean, recievedFood boolean, leadership boolean, exersize boolean, mentalHealth boolean, volunteering boolean, oneOnOne boolean, comments varchar(1000), date date, time time)"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])

def tempAdd():
    query = "INSERT INTO masterAttendance VALUES ('2017-11-02', '55', '20', '4', '5', '2', '10', '5', '0', '1'), ('2017-11-01', '65', '23', '6', '5', '12', '5', '7', '2', '5'), ('2017-10-31', '88', '10', '30', '15', '0', '2', '6', '2', '0'), ('2017-10-30', '100', '22', '2', '10', '1', '11', '4', '1', '2');"
    executeSingleQuery(query, [])

def tempMaster():
    query = "DROP TABLE IF EXISTS masterAttendance;"
    query2 = "CREATE TABLE masterAttendance (date date, numAttend int, art int, madeFood int, recievedFood int, leadership int, exersize int, mentalHealth int, volunteering int, oneOnOne int);"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])

def tempFiller():
    query = "INSERT INTO dailyAttendance VALUES ('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-30','16:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-29','18:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-27','18:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-25','16:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-21','15:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-19','17:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-15','17:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-12','16:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-11','19:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-10','15:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-06','17:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-05','18:00:00'),('12', 'Albar','Acevedo', 'false', 'false', 'false','false','false','false','false','false','','2017-10-01','16:00:00');"
    executeSingleQuery(query, [])
    return ""

def tempLogin():
    query = "DROP TABLE IF EXISTS login;"
    query2 = "CREATE TABLE login (username varchar(255), password varchar(255));"
    query3 = "INSERT INTO login values ('user1', 'password1');"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])
    executeSingleQuery(query3, [])
    return ""

def tempFeedback():
    query = "DROP TABLE IF EXISTS feedback;"
    query2 = "CREATE TABLE feedback (date date, comment varchar(2000));"
    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])
    return ""

def tempStudentColumns():
    query = query = "DROP TABLE IF EXISTS studentColumns;"
    query2 = "CREATE TABLE studentColumns (isShowing boolean, isQuick boolean, name varchar(255), type varchar(255),definedOptions varchar(1000), priority SERIAL UNIQUE)"

    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])

def tempColumns():
    query = query = "DROP TABLE IF EXISTS attendanceColumns;"
    query2 = "CREATE TABLE attendanceColumns (inUse boolean, isShowing boolean, name varchar(255), type varchar(255), isParent boolean, isChild boolean, parent varchar(255), priority SERIAL UNIQUE)"
    query3 = "INSERT INTO attendanceColumns (inUse, isShowing, name, type, isParent, isChild, parent) VALUES ('true','true','art','boolean','false','false',''),('true','true','madeFood','boolean','false','false',''),('true','true','recievedFood','boolean','false','false',''),('true','true','leadership','boolean','false','false',''),('true','true','exersize','boolean','false','false',''),('true','true','mentalHealth','boolean','false','false',''),('true','true','volunteering','boolean','false','false',''),('true','true','oneOnOne','boolean','false','false',''),('true','false','comments','varchar','false','false','');"

    executeSingleQuery(query, [])
    executeSingleQuery(query2, [])
    executeSingleQuery(query3, [])
    
def tempAlter():
    query = """
        ALTER TABLE attendanceColumns ADD priority int;
        UPDATE attendanceColumns set priority = '1' WHERE name = 'art';
        UPDATE attendanceColumns set priority = '2' WHERE name = 'madeFood';
        UPDATE attendanceColumns set priority = '3' WHERE name = 'recievedFood';
        UPDATE attendanceColumns set priority = '4' WHERE name = 'leadership';
        UPDATE attendanceColumns set priority = '5' WHERE name = 'exersize';
        UPDATE attendanceColumns set priority = '6' WHERE name = 'mentalHealth';
        UPDATE attendanceColumns set priority = '7' WHERE name = 'volunteering';
        UPDATE attendanceColumns set priority = '8' WHERE name = 'oneOnOne';
        UPDATE attendanceColumns set priority = '9' WHERE name = 'comments';
        UPDATE attendanceColumns set isShowing = 'false' WHERE name = 'comments';
    """
    executeSingleQuery(query, [])
    return ""