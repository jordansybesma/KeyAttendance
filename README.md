# 404-repo-name-DNE

To run:
```
export FLASK_APP="main.py"
python3 -m flask run
```
To run locally
```
python3 web/main.py local
```


This assumes you've run `pip3 install flask` and `pip3 install psycoporg2` at some point.

Alternatively, if you don't need the backend (which we don't right now), you can get away with opening `index.html` with a web browser (guarenteed to work on at least Firefox).

To update the apache server to reflect new code:
-SSH to instance
-Pull new code
-sudo apachectl restart
-sudo service apache2 restart
