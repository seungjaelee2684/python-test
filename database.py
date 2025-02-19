import sqlite3

def create_table():
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

if __name__ == "__main__":
  create_table()
  print("✅ 데이터베이스가 초기화되었습니다.")

def create_links_table():
  conn = sqlite3.connect("users.db")
  cursor = conn.cursor()
  cursor.execute("""
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_by TEXT NOT NULL,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT
    )
  """)
  conn.commit()
  conn.close()

if __name__ == "__main__":
  create_links_table()
  print("✅ 'links' 테이블이 생성되었습니다.")

# def remove_links_table():
#   conn = sqlite3.connect("users.db")
#   cursor = conn.cursor()
#   cursor.execute("DROP TABLE links")

#   conn.commit()
#   conn.close()

# if __name__ == "__main__":
#   remove_links_table()
#   print("✅ 'links' 테이블이 삭제되었습니다.")

def create_rights_table():
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

if __name__ == "__main__":
  create_rights_table()
  print("✅ 'rights' 테이블이 생성되었습니다.")

# def remove_rights_table():
#   conn = sqlite3.connect("users.db")
#   cursor = conn.cursor()
#   cursor.execute("DROP TABLE rights")

#   conn.commit()
#   conn.close()

# if __name__ == "__main__":
#   remove_rights_table()
#   print("✅ 'rights' 테이블이 삭제되었습니다.")