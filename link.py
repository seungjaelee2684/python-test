import sqlite3
from flask import Blueprint, request, jsonify
from flask_jwt_extended import decode_token
from flask_cors import cross_origin

link = Blueprint('link', __name__)

# 웹 링크 조회
@link.route("/inquiry", methods=["GET"])
@cross_origin(origins="http://localhost:8000")
def inquiry():
  tag = request.args.get("tag")
  authorization_header = request.headers.get("Authorization")

  if authorization_header:
    access_token = authorization_header.split(" ")[1]
    verify_token = decode_token(access_token)
  else:
    verify_token = False
  
  links = []

  try:
    conn = sqlite3.connect("users.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
      
    if tag: cursor.execute("SELECT * FROM links WHERE category = ?", (tag,))
    else: cursor.execute("SELECT * FROM links")

    rows = cursor.fetchall()

    if verify_token:
      user_id = verify_token.get("sub")
      links = [
        {**dict(row), "is_owner": row["created_by"] == user_id}
          for row in rows
        ]
      status_code = 200
    else:
      links = [dict(row) for row in rows]
      status_code = 201
    conn.close()
  except Exception as e:
    return jsonify({"state": 403, "error": "조회에 실패하였습니다..."}), 403
  finally:
    conn.close()
  return jsonify({"state": status_code, "data": links, "message": "조회에 성공하였습니다!"}), status_code
  
# 웹 링크 상세 조회
@link.route("/inquiry/detail", methods=["GET"])
@cross_origin(origins="http://localhost:8000")
def detail():
  link_id = request.args.get("link")
  authorization_header = request.headers.get("Authorization")

  if authorization_header:
    access_token = authorization_header.split(" ")[1]
    verify_token = decode_token(access_token)
  else:
    verify_token = False

  try:
    conn = sqlite3.connect("users.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM links WHERE id = ?", (link_id,))
    row = cursor.fetchone()

    if verify_token:
      user_id = verify_token.get("sub")
      link = {**dict(row), "is_owner": row["created_by"] == user_id}
      status_code = 200
      conn.close()
      return jsonify({"state": status_code, "data": dict(link), "message": "조회에 성공하였습니다!"}), status_code
    else:
      status_code = 404
      conn.close()
      return jsonify({"state": status_code, "message": "읽기 권한이 없습니다."}), status_code
  except Exception as e:
    return jsonify({"state": 403, "error": "조회에 실패하였습니다..."}), 403
  
# 웹 링크 업로드
@link.route("/upload", methods=["POST"])
@cross_origin(origins="http://localhost:8000")
def upload():
  authorization_header = request.headers.get("Authorization")

  if authorization_header:
    access_token = authorization_header.split(" ")[1]
    verify_token = decode_token(access_token)
    user_id = verify_token.get("sub")
  else:
    verify_token = False
 
  data = request.get_json()
  name = data.get("name")
  url = data.get("url")
  category = data.get("category")
  description = data.get("description")

  if verify_token:
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    try:
      cursor.execute("""
        INSERT INTO links (created_by, name, url, category, description)
        VALUES (?, ?, ?, ?, ?)
      """, (user_id, name, url, category, description))
      conn.commit()
      post_id = cursor.lastrowid

      cursor.execute("""
        INSERT INTO rights (post_id, user_id, can_read, can_write)
        VALUES (?, ?, ?, ?)
      """, (post_id, user_id, True, True))
      conn.commit()

      return jsonify({"state": 200, "message": "업로드에 성공하였습니다!"}), 200
    except Exception as e:
      conn.rollback()
      return jsonify({"state": 403, "error": str(e), "message": "업로드에 실패하였습니다..."}), 403
    finally:
      conn.close()
  else:
    return jsonify({"state": 401, "message": "업로드에 실패하였습니다..."}), 401

# 링크 업데이트
@link.route("/update", methods=["PUT"])
@cross_origin(origins="http://localhost:8000")
def link_update():
  authorization_header = request.headers.get("Authorization")

  if authorization_header:
    access_token = authorization_header.split(" ")[1]
    verify_token = decode_token(access_token)
  else:
    verify_token = False

  data = request.get_json()
  post_id = data.get("post_id")
  name = data.get("name")
  url = data.get("url")
  category = data.get("category")
  description = data.get("description")

  if verify_token:
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    try:
      cursor.execute("""
        UPDATE links
        SET name = ?, url = ?, category = ?, description = ?
        WHERE id = ?
      """, (name, url, category, description, post_id))
      conn.commit()

      return jsonify({"state": 200, "message": "업데이트에 성공하였습니다!"}), 200
    except Exception as e:
      conn.rollback()
      return jsonify({"state": 403, "error": str(e), "message": "업데이트에 실패하였습니다..."}), 403
    finally:
      conn.close()
  else:
    return jsonify({"state": 401, "message": "업데이트에 실패하였습니다..."}), 401

# 링크 삭제
@link.route("/delete", methods=["DELETE"])
@cross_origin(origins="http://localhost:8000")
def delete():
  authorization_header = request.headers.get("Authorization")

  if authorization_header:
    access_token = authorization_header.split(" ")[1]
    verify_token = decode_token(access_token)
  else:
    verify_token = False

  post_id = request.args.get("post_id")

  if verify_token:
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    try:
      cursor.execute("""
        DELETE FROM links WHERE id = ?
      """, (post_id,))
      cursor.execute("""
        DELETE FROM rights WHERE id = ?
      """, (post_id,))
      conn.commit()

      return jsonify({"state": 200, "message": "삭제에 성공하였습니다!"}), 200
    except Exception as e:
      conn.rollback()
      return jsonify({"state": 403, "error": str(e), "message": "삭제에 실패하였습니다..."}), 403
    finally:
      conn.close()
  else:
    return jsonify({"state": 401, "message": "삭제에 실패하였습니다..."}), 401
  
# 검색
@link.route("/search", methods=["POST"])
@cross_origin(origins="http://localhost:8000")
def search():
  data = request.get_json()
  tag = data.get("tag")
  word = data.get("word")
  authorization_header = request.headers.get("Authorization")

  if authorization_header:
    access_token = authorization_header.split(" ")[1]
    verify_token = decode_token(access_token)
  else:
    verify_token = False

  try:
    conn = sqlite3.connect("users.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    if tag == "name":
      cursor.execute("SELECT * FROM links WHERE name LIKE ?", ('%' + word + '%',))
    else:
      cursor.execute("SELECT * FROM links WHERE category = ?", (word,))

    rows = cursor.fetchall()

    if verify_token:
      user_id = verify_token.get("sub")
      search_link = [
        {**dict(row), "is_owner": row["created_by"] == user_id}
          for row in rows
        ]
      status_code = 200
    else:
      search_link = [dict(row) for row in rows]
      status_code = 201
  except Exception as e:
    print(word)
    return jsonify({"state": 403, "error": "조회에 실패하였습니다..."}), 403
  finally:
    conn.close()
  return jsonify({"state": status_code, "data": search_link, "message": "조회에 성공하였습니다!"}), status_code