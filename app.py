from flask import *
from datetime import datetime
import vmamv as service
app = Flask(__name__)


@app.route('/')
@app.route('/index')
def index():
    data = "Success"
    return data

@app.route('/vmamv')
def vmamv():
    url = request.args.get('url')
    system_name = request.args.get('system_name')
    result = service.getURL(url,system_name)
    return result

@app.route('/test')
def test():
    result = service.test()
    return result


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)