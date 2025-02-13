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