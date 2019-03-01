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

* PATCH /api/activities/ : Updates an existing activity

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

* POST /api_token_auth/

## Groups

* GET /api/groups/ : Returns a list of all user groups
* PATCH /api/groups/
* POST /api/groups/
* DELETE /api/groups/

## History

* GET /api/history/

## Permissions

* GET /api/permissions/

## Reports

* GET /api/reports/individualHeatmap/
* GET /api/reports/byHourAttendance/
* GET /api/reports/byDayAttendance/
* GET /api/reports/alternativeVizType/

## Students

* GET /api/students/?id=1
* POST /api/students/
* PATCH /api/students/
* DELETE /api/students/?id=1

## Student Columns

* GET /api/student_column/
* POST /api/student_column/
* PATCH /api/student_column/

## Student Info

* GET /api/student_info/
* POST /api/student_info/
* PATCH /api/student_info/
* DELETE /api/student_info/

## Student Keys

* GET /api/suggestions/unmatchedstudents/
* GET /api/suggestions/cityspanstudents/
* GET /api/suggestions/student/?id=1
* PATCH /api/suggestions/cityspanstudents/

## Users

* GET /api/users/
* PATCH /api/users/
* POST /api/users/
* DELETE /api/users/