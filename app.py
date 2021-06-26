from flask import Flask, render_template, request
from flaskext.mysql import MySQL
from database_access import add_level, add_user
app = Flask(__name__)

mysql = MySQL()

app.config['MYSQL_DATABASE_USER'] = 'bdbc2dbdbda579'
app.config['MYSQL_DATABASE_PASSWORD'] = '6875d2e1'
app.config['MYSQL_DATABASE_DB'] = 'heroku_c9fdd1a5f9509b9'
app.config['MYSQL_DATABASE_HOST'] = 'us-cdbr-east-04.cleardb.com'

mysql.init_app(app)
db = mysql.connect()



@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')
