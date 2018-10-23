# Key Comps 2018-19

## Running the application
The folder "app" contains a django app (located in "backend") and a react frontend (located in "frontend").

To start up the backend, you'll first need to install "pipenv." Google it or you can try "pip install --user pipenv" via a terminal window. Next, via terminal, cd into "myapp\backend" and run "pipenv install", "pipenv shell", and finally "manage.py runserver". Leave this terminal window open, it is running the backend now (hopefully).

To run the frontend, you'll need Node installed. Google it. In a new terminal window, cd into "myapp\frontend" and run "npm install" followed by "npm start". A browser window should open up with a list of "Key Youths."

Here's the tutorial I followed if you want to get a sense for how things interact: https://wsvincent.com/django-rest-framework-react-tutorial/

## Workflow

* When starting to work on an issue, create a new branch off of 'develop' using git flow-ish naming style with a prefix followed by an objective summary. For instance, if you were adding a feature that installs a bouncy house in the living room, the branch would be called 'feature/add_bouncy_house_to_living_room'
* When you're done with a branch, create a pull request back to develop. Ideally 1 or 2 people should 'approve' the pull request prior to merging it.