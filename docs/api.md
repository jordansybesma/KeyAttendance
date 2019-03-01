# API Endpoint Reference

## Activities

* GET /api/activities/ : Returns all activities
* POST /api/activities/ : Creates a new activity. Expects body:

```{json}
{
    "is_showing": bool,
    "name": text (max 255 char),
    "type": text (max 255 char),
    "is_parent: bool,
    "parent": text (max 255 char),
    "ordering": int
}
```

* PATCH /api/activities/ : Updates an existing activity, given a body with valid activity fields.

## Attendance

* GET /api/attendance/?day=2018-01-01&startdate=2018-01-01&enddate=2018-01-01 : Returns a list of attendance items, filtered by the parameters
* POST /api/attendance/ : Creates a new attendance item. Expects body:

```{json}
{
    "student_id": int,
    "activity_id": int
}
```

Other optional body items are conditionally required for specific types of attendance items.

* DELETE /api/attendance/?key=1 : Deletes an attendance item with an id matching the key parameter

## Authentication

* POST /api_token_auth/ : Given a correct username and password, generates authorization token. Expects body:

```{json}
{
    "username": text,
    "password": text
}
```

## Groups

* GET /api/groups/ : Returns a list of all user groups / roles
* POST /api/groups/ : Creates a new user group / role. Expects body:

```{json}
{
    "id": int,
    "name": text,
    "permissions:", array of integers (permission IDs)
}
```

* PATCH /api/groups/ : Updates an existing user group, given a body with valid group fields.
* DELETE /api/groups/?id=1 : Deletes a group with a given ID

## History

* GET /api/history/?user_id=1 : Returns the action history of a user given their user id

## Permissions

* GET /api/permissions/ : Returns a list of user permissions

## Reports

* GET /api/reports/individualHeatmap/?student_id=1&startdate=2018-01-01&enddate=2018-01-01 : Returns attendance heatmap data for an individual student
* GET /api/reports/byHourAttendance/?startdate=2018-01-1&enddate=2018-01-01 : Returns hourly attendance data
* GET /api/reports/byDayAttendance/?startdate=2018-01-1&enddate=2018-01-01 : Returns daily attendance data
* GET /api/reports/alternativeVizType/?startdate=2018-01-1&enddate=2018-01-01

## Students

* GET /api/students/?id=1 : Returns data for a given student
* POST /api/students/ : Creates a student. Expects body:

```{json}
{
    "first_name": text,
    "last_name": text,
}
```

* PATCH /api/students/ : Updates a student, given a body with valid student fields.
* DELETE /api/students/?id=1

## Student Columns

* GET /api/student_column/ : Returns all student columns / fields
* POST /api/student_column/ : Creates a new student column / field. Expects body:

```{json}
{
    "is_showing": boolean,
    "quick_add": boolean,
    "name": text,
    "type": text,
    "defined_options": text
}
```

* PATCH /api/student_column/ : Updates a student column / field, given a body with valid student column fields.

## Student Info

* GET /api/student_info/?student_id=1 : Returns extra student information about a given student.
* POST /api/student_info/ : Creates a new student information item. Expects body:

```{json}
{
    "student_id": int,
    "info_id": int,
    "int_value": int,
    "str_value": text,
    "bool_value": boolean,
    "date_value": date,
    "time_value": time,
}
```

where one of the "..._value" fields are filled, corresponding with the type of information referenced in info_id.

* PATCH /api/student_info/ : Updates a student information item, given a body with valid student item fields
* DELETE /api/student_info/?id=1 : Deletes a given student information item.

## Student Keys

* GET /api/suggestions/unmatchedstudents/ : Returns a list of all students in the database with no student key
* GET /api/suggestions/cityspanstudents/ : Returns a list of all stored city span students in the database
* GET /api/suggestions/student/?id=1 : Generates and returns suggestions for matching city span students to key students
* PATCH /api/suggestions/cityspanstudents/ : Bulk updates the existing list of city span students in the database. Expects body:

```{json}
{
    "students": [
        {"first_name": text, "last_name": text, "student_key": text}
    ]
}
```

## Users

* GET /api/users/ : Returns a list of all users
* POST /api/users/ : Creates a new user. Expects body:

```{json}
{
    "username": text,
    "password": text,
    "first_name": text,
    "last_name": text,
    "groups": array of group IDs,
    "is_active": boolean
}
```

* PATCH /api/users/ : Updates a user, given a body with valid user fields.
* DELETE /api/users/?id=1 : Deletes a given user