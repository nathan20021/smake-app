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
