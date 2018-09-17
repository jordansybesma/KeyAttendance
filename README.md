# 404-repo-name-DNE

### To run:
```
export FLASK_APP="main.py"
python3 -m flask run
```
To update the apache server to reflect new code:
-SSH to instance
-Pull new code
-sudo apachectl restart
-sudo service apache2 restart

### To run locally (Windows 10)

* Make sure you have a postgreSQL server running locally. If you don't, take a look at `https://www.postgresql.org/download/windows/`. Don't forget to add the PostgreSQL/bin folder to your PATH!
* Run setup.sql on your database. In the postgres CLI: `\i setup.sql`
* Run populatetestStudents.sql on your database. In the postgres CLI: `\i populatetestStudents.sql`
* Use pip to install all the necessary python dependencies - flask, psycopg2
* Update loginLocal.json with the db credentials that match your database. Your fields probably match what I threw in loginLocal.js, with the exception that the password will be whatever you set the password to when you created the local db.
* heck yeah now we're ready to actually run the file! cd to the top directory, then run `python web/flaskEnd.py local`

as far as OSX or other Unix-based OS go, i think my patch might work? But until I test it, I can't guarentee anything.