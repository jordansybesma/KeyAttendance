# Server Reference

## Overview

The server used to host this site is an AWS EC2 virtual machine running ubuntu 18.04. The server has a static IP and url that we use to send web traffic to via the DNS records of the site's domain. To connect to the server, obtain the ssh key and run `ssh -i "keyname.pem" ubuntu@siteurl`.

## Software Involved

### nginx

[nginx](https://nginx.org/en/) is a HTTP and proxy server program that handles incoming traffic and forwards it to uWSGI for processing. While uWSGI is a capable web application, [using nginx](https://serverfault.com/questions/590819/why-do-i-need-nginx-when-i-have-uwsgi) as the outward-facing server provides increased security, stability, and a potential to use caching features to increase request handling time.

#### Important Files

* `/etc/nginx/sites-available/key_api_nginx.conf` contains the configuration settings for the server.


### uWSGI

[uWSGI](https://uwsgi-docs.readthedocs.io/en/latest/) acts as an [intermediary](https://stackoverflow.com/questions/38601440/what-is-the-point-of-uwsgi) between the web server, nginx, and the web application, django. This provides extra scalability and more robustness in handling requests. For more information, see [this explanation](https://www.fullstackpython.com/wsgi-servers.html).

#### Important Files

* `/tmp/keyattendance.log` is where all output produced by uWSGI and Django are logged. Look here if you run into any unexpected 500 errors on the server.
* `app/backend/key_api_uwsgi.ini` is the configuration file for uWSGI.
* `app/backend/key_api.sock` is the unix socket file used for communication between uWSGI and nginx.
* `app/backend/requirements.txt` contains the names and versions of the packages required by the project to faciliate installation.

### Django

Django is the web application framework that our code executes within. We still directly interact with it on the server for applying migrations, files that track database changes through version control.

### Postgres SQL

The database server used in this project runs postgresql. It can be directly accessed when logged into the web server by switching to the postgres account by running `sudo -i -u postgres`, then running `psql -d keydb` to open the terminal interface.

### virtualenv

Virtualenv creates a new installation of python and the necessary libraries for a given project, ensuring that changes in packages can be easily tracked and updated through version control tools for team projects. The server uses it for keeping track of python packages as uWSGI is designed to work with it.

### systemd

Systemmd is a task scheduler that runs the uWSGI and nginx servers whenever the virtual machine boots. This ensures that any downtime will be minimal.

#### Important Files

* `/etc/systemd/system/keyapi.service` contains the system job for starting uWSGI

### certbot

Certbot is a program used to obtain and renew SSL certificates through letsencrypt.org. These certificates are trusted by the current versions of all major browsers, and, most importantly, are free.

#### Important Files

* `/etc/letsencrypt/live/sitename/fullchain.pem`: the ssl certificate
* `/etc/letsencrypt/live/sitename/fullchain.pem`: the ssl certificate key