def add_level(db, level_id, name, data, des = 'null' , comment = 'null'):
    sqlcursor = db.cursor()
    db.ping()
    sqlcursor.execute(f" INSERT INTO levels VALUES({level_id}, \"{name}\", \"{data}\", \"{des}\", 0, 0, \"{comment}\") ")
    db.commit()
    sqlcursor.close()
    db.close()
    return 


def add_user(db, user_id, username, password, liked_levels = 'null', created = 'null', beaten='null'):
    sqlcursor = db.cursor()
    db.ping()
    sqlcursor.execute(f" INSERT INTO user VALUES({user_id}, \"{username}\", \"{password}\", \"{liked_levels}\", \"{created}\", \"{beaten}\") ")
    db.commit()
    sqlcursor.close()
    db.close()
    return 

def get_user_num(db):
    sqlcursor = db.cursor()
    db.ping()
    sqlcursor.execute(" SELECT COUNT(`id`) FROM user ")
    num = sqlcursor.fetchone()[0]
    db.commit()
    sqlcursor.close()
    db.close()
    return num

def get_user_data(db, user_name):
    sqlcursor = db.cursor()
    db.ping()

    sqlcursor.execute(f" SELECT * FROM user WHERE `username`= \"{user_name}\" ")

    data = sqlcursor.fetchone()

    db.commit()
    sqlcursor.close()
    db.close()
    
    return data

def count_duplicate_user(db, user_name):
    sqlcursor = db.cursor()
    db.ping()  
    sqlcursor.execute(f" SELECT COUNT(id) FROM user WHERE `username`= \"{user_name}\" ")
    num = sqlcursor.fetchone()[0]
    db.commit()
    sqlcursor.close()
    db.close()
    return num

def read_user_table(db):
    sqlcursor = db.cursor()
    db.ping()
    sqlcursor.execute(" SELECT * FROM user ")
    for i in sqlcursor:
        print(i)
    db.commit()
    sqlcursor.close()
    db.close()
    return 
