DROP TABLE IF EXISTS dailyAttendance;
CREATE TABLE dailyAttendance (
	id SERIAL
    art BOOL
    madeFood BOOL
    receivedFood BOOL
    leadership BOOL
    excercise BOOL
    mentalHealth BOOL
    volunteering BOOL
    oneOnOne BOOL
    comments TEXT
);