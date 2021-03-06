import os
from flask import Flask
from flask import jsonify
app = Flask(__name__,static_url_path='/static')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/config.json')
def get_config():
    return jsonify(publish_key=os.getenv("PUBLISH_KEY","pub-c-50c523d1-e9c5-4e13-b7f7-1383a3ca4645"),
                   subscribe_key=os.getenv("SUBSCRIBE_KEY","sub-c-3bd403c8-0ec0-11e5-a5c2-0619f8945a4f"),
                   channel=os.getenv("CHANNEL","lux-channel"),
                   updatePeriod=os.getenv("PERIOD",5000))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0',port=int("80"))
