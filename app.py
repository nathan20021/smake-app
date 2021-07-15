from flask import Flask, render_template, redirect, url_for, session, request
from flaskext.mysql import MySQL
from models import *
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
db_manager = DB_manager(db)

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
            
            print(psswd_input)
            print(pss)
            if psswd_input == pss:
                session['username'] = login_form.username.data
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
            if not db_manager.user_already_existed(register_form.username.data):
                #add_user(db, num+1, register_form.username.data, register_form.password.data)
                db_manager.add_user(register_form.username.data, register_form.password.data)
                return redirect(url_for('login'))
            else:
                duplicate = True
        else:
            same_pass = False
    return render_template('register.html', form = register_form, same_pass = same_pass, duplicate = duplicate)


@app.route('/level_preview')
def level_preview():
    if 'username' in session:
        current_user = User(db_manager.db, session['username'])
        return render_template('level_preview.html', user = current_user, levels = db_manager.get_data_for_level_preview())
    return redirect(url_for('login'))
 
@app.route('/editor', methods=['GET', 'POST'])
def editor():
    if 'username' in session:
        current_user = User(db_manager.db, session['username'])
        if request.method == 'POST':
            level_data = request.get_json()
            level_name = level_data['level_name']
            level_data.pop("level_name")
            db_manager.add_level(level_name ,level_data, current_user)
            return redirect(url_for('level_preview'))
        return render_template('editor.html' , user = current_user)
    return redirect(url_for('login'))

@app.route('/game/<level_id>/')
def game(level_id):
    if 'username' in session:
        current_level = Level(db_manager.db, level_id)
        current_user = User(db_manager.db, session['username'])
        return render_template('game.html', level = current_level, user = current_user)
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    if 'username' in session:
        session.pop('username', None)
    return redirect(url_for('login'))
if __name__ == "__main__":
    app.run(debug = True, host='0.0.0.0', port=8080)