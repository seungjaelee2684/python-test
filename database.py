import sqlite3

def table_exists(table_name):
  conn = sqlite3.connect("users.db")
  cursor = conn.cursor()
  cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
  exists = cursor.fetchone() is not None
  conn.close()
  return exists

def create_table():
  if table_exists("users"):
    print("✅ 'users' 테이블이 이미 존재합니다.")
    return

  conn = sqlite3.connect("users.db")
  cursor = conn.cursor()
  cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  """)
  conn.commit()
  conn.close()

  print("✅ 'users' 테이블이 생성되었습니다.")
if __name__ == "__main__":
  create_table()

def create_links_table():
  if table_exists("links"):
    print("✅ 'users' 테이블이 이미 존재합니다.")
    return

  conn = sqlite3.connect("users.db")
  cursor = conn.cursor()
  cursor.execute("""
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_by TEXT NOT NULL,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY (created_by) from users(username)
    )
  """)
  conn.commit()
  conn.close()

  print("✅ 'links' 테이블이 생성되었습니다.")
if __name__ == "__main__":
  create_links_table()

def create_rights_table():
  if table_exists("rights"):
    print("✅ 'users' 테이블이 이미 존재합니다.")
    return

  conn = sqlite3.connect("users.db")
  cursor = conn.cursor()
  cursor.execute("""
    CREATE TABLE IF NOT EXISTS rights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      can_read BOOLEAN DEFAULT FALSE,
      can_write BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (post_id) REFERENCES links(id),
      FOREIGN KEY (user_id) REFERENCES users(username)
    )
  """)
  conn.commit()
  conn.close()

  print("✅ 'rights' 테이블이 생성되었습니다.")
if __name__ == "__main__":
  create_rights_table()

# def remove_links_table():
#   conn = sqlite3.connect("users.db")
#   cursor = conn.cursor()
#   cursor.execute("DROP TABLE links")

#   conn.commit()
#   conn.close()

# if __name__ == "__main__":
#   remove_links_table()
#   print("✅ 'links' 테이블이 삭제되었습니다.")

# def remove_rights_table():
#   conn = sqlite3.connect("users.db")
#   cursor = conn.cursor()
#   cursor.execute("DROP TABLE rights")

#   conn.commit()
#   conn.close()

# if __name__ == "__main__":
#   remove_rights_table()
#   print("✅ 'rights' 테이블이 삭제되었습니다.")