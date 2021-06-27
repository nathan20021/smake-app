import re
from flask import Flask, render_template, redirect, url_for, session, request
from flaskext.mysql import MySQL
from database_access import *
from forms import LoginForm, RegisterForm
import ast

app = Flask(__name__)
mysql = MySQL()

app.config['MYSQL_DATABASE_USER'] = 'bdbc2dbdbda579'
app.config['MYSQL_DATABASE_PASSWORD'] = '6875d2e1'
app.config['MYSQL_DATABASE_DB'] = 'heroku_c9fdd1a5f9509b9'
app.config['MYSQL_DATABASE_HOST'] = 'us-cdbr-east-04.cleardb.com'
app.config['SECRET_KEY'] = 'my-name-is-Jeff'

mysql.init_app(app)
db = mysql.connect()

@app.route('/' , methods=['POST','GET'])
@app.route('/login', methods=['POST','GET'])
def login():
    if 'user' in session:
        return redirect(url_for('level_preview'))
    else:
        login_form = LoginForm()
        if login_form.validate_on_submit():

            pss = get_user_data(db, login_form.username.data)[2]
            psswd_input = login_form.password.data
            
            if psswd_input == pss:
                session['user'] = login_form.username.data
                return redirect(url_for('level_preview'))

            return redirect(url_for('register'))
        return render_template( 'login.html', form = login_form )


@app.route('/register', methods=['POST','GET'])
def register():
    register_form = RegisterForm()
    same_pass = True
    duplicate = False
    if register_form.validate_on_submit():
        #flash(f'Login requested for user {register_form.username.data}')
        if register_form.password.data == register_form.confirm_password.data:
            duplicate_users_num = count_duplicate_user(db, register_form.username.data)
            if duplicate_users_num == 0:
                print("Im in here")
                num = get_user_num(db)
                add_user(db, num+1, register_form.username.data, register_form.password.data)
                return redirect(url_for('login'))
            else:
                duplicate = True
        else:
            same_pass = False
    return render_template('register.html', form = register_form, same_pass = same_pass, duplicate = duplicate)


@app.route('/level_preview')
def level_preview():
    if 'user' in session:
        return render_template('level_preview.html', username = session['user'], levels = get_data_for_level_preview(db))
    else:
        return redirect(url_for('login'))
 
@app.route('/editor', methods=['GET', 'POST'])
def editor():
    if request.method == 'POST':
        add_level(db, "Test_level_name", request.get_json())
        print("Jeff")
        return redirect(url_for('level_preview'))
    return render_template('editor.html')

@app.route('/game/<level_id>/')
def game(level_id):
    data = get_data_from_level_id(db, level_id)
    print(ast.literal_eval(data))
    return render_template('game.html', data = ast.literal_eval(data))

if __name__ == "__main__":
    app.run(debug = True)