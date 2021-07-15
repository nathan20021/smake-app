from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired
from database_access import *
import ast

class RegisterForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    confirm_password = PasswordField("Confirm Password", validators=[DataRequired()])
    submit = SubmitField('Sign Up')

class LoginForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')

class LevelInput(FlaskForm):
    level_name = StringField("Name of Your Level", validators=[DataRequired()])
    submit = SubmitField('Create Level')

class User():
    def __init__(self, smake_db ,user_name):
        data = get_user_data(smake_db, user_name)
        self.id = data[0]
        self.user_name = data[1]
        self.password = data[2]
        self.liked_levels = data[3]
        self.beaten = data[4]
        self.smake_db = smake_db
    
    def __repr__(self):
        return f'User({self.id}, {self.user_name})'

    def like_level(self, level_id):
        pass
    
    def unlike_level(self, level_id):
        pass

    def dislike_level(self, level_id):
        pass

    def undislike_level(self, level_id):
        pass

    def remove():
        pass

    def add():
        pass

class Level():
    def __init__(self, smake_db, level_id):
        db_data = get_level_from_level_id(smake_db, level_id)
        self.id = db_data[0]
        self.name = db_data[1]
        self.data = ast.literal_eval(db_data[2])
        self.created_by = db_data[3]
        self.like_num = db_data[4]
        self.dislike_num = db_data[5]
        self.comment = db_data[6]
        self.smake_db = smake_db
    
    def __repr__(self):
        return f'Level({self.id}, {self.name}, {self.created_by}, {self.like_num}, {self.dislike_num})'

    #def create(self):
    #    add_level(self.smake_db, self.name ,self.data, self.created_by)
    #    print(f"Created {self.name}")

    def increase_like(self):
        pass

    def decrease_like(self):
        pass

    def increase_dislike(self):
        pass

    def decrease_dislike(self):
        pass

    def add_comment(self, user_id, comment, time):
        pass

class DB_manager():
    def __init__(self, smake_db):
        self.db = smake_db

    def __repr__(self):
        return f"Managing Smake database at {self.db}"
    
    def add_user(self, user_name, user_password) -> bool:
        if not self.user_already_existed(user_name):
            user_num = self._count_user(user_name)
            add_user(self.db, user_num+1, user_name, user_password)
            return True
        return False
    
    def user_already_existed(self, user_name)-> bool:
        num = count_user(self.db, user_name)
        return False if num == 0 else True

    def _count_user(self, user_name) -> int:
        return count_user(self.db, user_name)

    def add_level(self, name, data, user) -> None:
        add_level(self.db, name, data, user.id)

    def get_data_for_level_preview(self) -> list:
        return get_data_for_level_preview(self.db)

    def remove_user(self, user) -> None:
        pass

    def remove_level(self, level) -> None:
        pass

    def count_user(self) -> int:
        pass

    def get_relationship_user_levels(self) -> dict:
        pass

    

