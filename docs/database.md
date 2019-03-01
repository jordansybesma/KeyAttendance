# Database Reference

## Overview

The database used to store information to the site runs postgresql and is largely managed by django. Modifying table columns is not typically recommended, as Django likes to keep track of all changes in managed databses, but for the most part (unless you're modifying something critical to site function) you are free to add whatever rows you want as necessary.

## Tables

* activities: Stores activities / programs
* alerts: Deprecated, inherited from the Key Comps 2017-18 database.
* auth_group: Stores role IDs and role names
* auth_group_permissions: Stores permission/role pairs to facilitate dynamic role assignment.
* auth_permission: Stores permission ids, names, and codenames.
* auth_user: Stores user data.
* auth_user_groups: Managed by django.
* auth_user_user_permissions: Managed by django.
* cityspanstudents: Stores names and student keys of students from CitySpan, the school district's management system, to facilitate matches between known district students and key students.
* dailyattendance: Stores individual attendance items; effectively checkboxes in the attendance view.
* django_admin_log: Managed by django
* django_content_type: Managed by django
* django_migrations: Managed by django
* django_session: Managed by django
* key_historicalattendanceitems: Tracks user actions related to attendance items
* key_historicalstudentinfo: Tracks user actions related to student information
* key_historicalstudents: Tracks user actions related to students.
* studentcolumns: Stores labels of student data types
* studentinfo: Stores miscellaneous data for students, similar to how attendance items are stored.
* students: Stores basic student information.
* studentsuggestions: Stores suggested matches between cityspan students and key students.