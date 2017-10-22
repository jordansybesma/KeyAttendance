DROP TABLE IF EXISTS testStudents;
create table testStudents (
    firstName TEXT,
    lastName TEXT,
    id SERIAL UNIQUE,
    primary key(firstName, lastName)
);

INSERT INTO teststudents VALUES('John', 'Snow');


DROP TABLE IF EXISTS dailyAttendance;
CREATE TABLE dailyAttendance (
    id SERIAL,
    art BOOL,
    madeFood BOOL,
    receivedFood BOOL,
    leadership BOOL,
    exercise BOOL,
    mentalHealth BOOL,
    volunteering BOOL,
    oneOnOne BOOL,
    comments TEXT
);
