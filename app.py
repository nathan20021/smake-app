from flask import Flask, render_template, redirect, url_for, session
from flaskext.mysql import MySQL
from database_access import add_level, add_user, get_user_num, get_user_data, count_duplicate_user
from forms import LoginForm, RegisterForm

app = Flask(__name__)
mysql = MySQL()

app.config['MYSQL_DATABASE_USER'] = 'bdbc2dbdbda579'
app.config['MYSQL_DATABASE_PASSWORD'] = '6875d2e1'
app.config['MYSQL_DATABASE_DB'] = 'heroku_c9fdd1a5f9509b9'
app.config['MYSQL_DATABASE_HOST'] = 'us-cdbr-east-04.cleardb.com'
app.config['SECRET_KEY'] = 'my-name-is-Jeff'

mysql.init_app(app)
db = mysql.connect()

@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html', username = session["smake_username"])

@app.route('/login', methods=['POST','GET'])
def login():
    if "smake_username" in session:
        return redirect(url_for('home'))
    else:
        login_form = LoginForm()
        if login_form.validate_on_submit():

            pss = get_user_data(db, login_form.username.data)[2]
            psswd_input = login_form.password.data
            
            if psswd_input == pss:
                session["smake_username"] = login_form.username.data
                return redirect(url_for('home'))

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


if __name__ == "__main__":
    app.run(debug = True)