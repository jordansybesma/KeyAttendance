import flask 
from flask import request

#flask automatically serves everything in the static folder for us, which is really nice
app = flask.Flask(__name__)

@app.route('/')
def send_index():
    return "use /static/index.html instead"
    # this works, but then the app fails to get the other things in the static folder :(
    #return flask.current_app.send_static_file('index.html')

@app.route('/addText/', methods=['POST'])
def foo():
    #print(request.values)
    if request.method == 'POST':
        f = request.data
        print(f)
    return "hi front-end!"
        
    

if __name__ == "__main__":
    app.run()
