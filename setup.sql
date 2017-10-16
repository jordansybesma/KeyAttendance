create table testStudents (
    firstName TEXT,
    lastName TEXT,
    id SERIAL UNIQUE,
    primary key(firstName, lastName)
);

insert into teststudents values ('John', 'Snow');
select * from teststudents where firstName = 'John'
