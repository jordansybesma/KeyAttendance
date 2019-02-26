#!/bin/bash
killall -9 uwsgi
uwsgi --ini key_api_uwsgi.ini &
