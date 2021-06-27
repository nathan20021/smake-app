def add_level(db, data, created_by ,comment = 'null'):
    sqlcursor = db.cursor()
    db.ping()
    sqlcursor.execute(" SELECT COUNT(`id`) FROM levels ")
    level_id = sqlcursor.fetchone()[0] + 1
    sqlcursor.execute(f" INSERT INTO levels VALUES({level_id}, \"Level {level_id}\", \"{data}\", \"{created_by}\", 0, 0, \"{comment}\") ")
    db.commit()
    sqlcursor.close()
    db.close()
    return

def get_data_from_level_id(db, level_id):
    sqlcursor = db.cursor()
    db.ping()
    sqlcursor.execute(f" SELECT data FROM levels WHERE `id`={level_id}")
    data = sqlcursor.fetchone()[0]
    db.commit()
    sqlcursor.close()
    db.close()
    return data

def get_data_for_level_preview(db):
    all_levels = []
    sqlcursor = db.cursor()
    db.ping()
    sqlcursor.execute(f" SELECT * FROM levels")

    for i in sqlcursor:
        all_levels.append( [i[0], i[1], i[3], i[4], i[5]] )
    db.commit()
    sqlcursor.close()
    db.close()
    return all_levels


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
