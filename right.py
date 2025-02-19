import sqlite3
from flask import Blueprint, request, jsonify
from flask_jwt_extended import decode_token
from flask_cors import cross_origin

right = Blueprint('right', __name__)

# 권한 추가
@right.route("/add", methods=["POST"])
@cross_origin(origins="http://localhost:8000")
def add():
  authorization_header = request.headers.get("Authorization")
  access_token = authorization_header.split(" ")[1]
  verify_token = decode_token(access_token)
  user_id = verify_token.get("sub")

  data = request.get_json()
  post_id = data.get("post_id")
  shared_id = data.get("user_id")
  can_read = data.get("can_read")
  can_write = data.get("can_write")

  if verify_token:
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("""
      SELECT created_by FROM links WHERE id = ?
    """, (post_id,))
    upload_user = cursor.fetchone()

    if user_id == shared_id: return jsonify({"state": 406, "message": "현재 계정과 동일한 아이디입니다."}), 406
    if upload_user is None:
      conn.close()
      return jsonify({"state": 404, "message": "해당 아이디가 존재하지 않습니다."}), 404

    created_by = upload_user[0]

    if created_by != user_id:
      conn.close()
      return jsonify({"state": 403, "message": "권한이 없습니다."}), 403
    
    cursor.execute("""
      SELECT EXISTS (
        SELECT 1 FROM users WHERE username = ?
      ) AS is_exist;
    """, (shared_id,))
    is_exists = cursor.fetchone()

    if is_exists[0] == 0:
      conn.close()
      return jsonify({"state": 405, "message": "입력하신 유저가 존재하지 않습니다."}), 405
    
    cursor.execute("""
      SELECT EXISTS (
        SELECT 1 FROM rights WHERE user_id = ? AND post_id = ?
      ) AS is_exist;
    """, (shared_id, post_id))
    is_save = cursor.fetchone()

    if is_save[0] == 1:
      conn.close()
      return jsonify({"state": 408, "message": "이미 공유 중인 아이디입니다."}), 408
    
    try:
      cursor.execute("""
        INSERT INTO rights (post_id, user_id, can_read, can_write)
        VALUES (?, ?, ?, ?)
      """, (post_id, shared_id, can_read, can_write,))   
      conn.commit()   
      
      return jsonify({"state": 200, "message": "업로드에 성공하였습니다!"}), 200
    except Exception as e:
      return jsonify({"state": 403, "error": str(e), "message": "업로드에 실패하였습니다..."}), 403
    finally:
      conn.close()
  else:
    return jsonify({"state": 401, "message": "업로드에 실패하였습니다..."}), 401

# 권한 조회
@right.route("/inquiry", methods=["GET"])
@cross_origin(origins="http://localhost:8000")
def right_inquiry():
  authorization_header = request.headers.get("Authorization")
  access_token = authorization_header.split(" ")[1]
  verify_token = decode_token(access_token)
  user_id = verify_token.get("sub")

  link_id = request.args.get("link")

  if not link_id:
    return jsonify({"state": 400, "message": "잘못된 요청입니다. link 값이 필요합니다."}), 400

  conn = sqlite3.connect("users.db")
  conn.row_factory = sqlite3.Row
  cursor = conn.cursor()

  cursor.execute("""
    SELECT EXISTS (
      SELECT 1 FROM links WHERE id = ? AND created_by = ?
    )
  """, (link_id, user_id))
  is_created = cursor.fetchone()

  if is_created and is_created[0] == 1:
    cursor.execute("SELECT * FROM rights WHERE post_id = ?", (link_id,))
    rights = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({"state": 200, "data": rights, "message": "조회에 성공하였습니다!"}), 200

  cursor.execute("""
    SELECT EXISTS (
      SELECT 1 FROM rights WHERE post_id = ? AND user_id = ?
    )
  """, (link_id, user_id))
  is_shared = cursor.fetchone()

  if not is_shared or is_shared[0] == 0:
    conn.close()
    return jsonify({"state": 403, "message": "읽기 권한이 없습니다."}), 403

  cursor.execute("SELECT * FROM rights WHERE post_id = ?", (link_id,))
  rights = [dict(row) for row in cursor.fetchall()]
  conn.close()

  return jsonify({"state": 200, "data": rights, "message": "조회에 성공하였습니다!"}), 200

@right.route("/inquiry/detail", methods=["GET"])
@cross_origin(origins="http://localhost:8000")
def right_inquiry_detail():
  authorization_header = request.headers.get("Authorization")
  access_token = authorization_header.split(" ")[1]
  verify_token = decode_token(access_token)
  user_id = verify_token.get("sub")

  right_id = request.args.get("right_id")

  if not right_id:
    return jsonify({"state": 400, "message": "잘못된 요청입니다. link 값이 필요합니다."}), 400

  conn = sqlite3.connect("users.db")
  conn.row_factory = sqlite3.Row
  cursor = conn.cursor()

  cursor.execute("""
    SELECT * FROM rights WHERE id = ?
  """, (right_id,))
  right = cursor.fetchone()
  conn.close()

  return jsonify({"state": 200, "data": dict(right), "message": "조회에 성공하였습니다!"}), 200

# 권한 업데이트
@right.route("/update", methods=["PUT"])
@cross_origin(origins="http://localhost:8000")
def update():
  authorization_header = request.headers.get("Authorization")
  access_token = authorization_header.split(" ")[1]
  verify_token = decode_token(access_token)
  user_id = verify_token.get("sub")

  data = request.get_json()
  right_id = data.get("id")
  post_id = data.get("post_id")
  shared_id = data.get("user_id")
  can_read = data.get("can_read")
  can_write = data.get("can_write")

  if verify_token:
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    
    try:
      if not can_read:
        cursor.execute("""
          DELETE FROM rights WHERE id = ?
        """, (right_id,))
        conn.commit()
        return jsonify({"state": 200, "message": "삭제되었습니다!"}), 200
      else:
        cursor.execute("""
          SELECT created_by FROM links WHERE id = ?
        """, (post_id,))
        upload_user = cursor.fetchone()

        if user_id == shared_id: return jsonify({"state": 406, "message": "현재 계정과 동일한 아이디입니다."}), 406
        if upload_user is None:
          conn.close()
          return jsonify({"state": 404, "message": "해당 아이디가 존재하지 않습니다."}), 404

        created_by = upload_user[0]

        if created_by != user_id:
          conn.close()
          return jsonify({"state": 403, "message": "권한이 없습니다."}), 403
    
        cursor.execute("""
          SELECT EXISTS (
            SELECT 1 FROM users WHERE username = ?
          ) AS is_exist;
        """, (shared_id,))
        is_exists = cursor.fetchone()

        if is_exists[0] == 0:
          conn.close()
          return jsonify({"state": 405, "message": "입력하신 유저가 존재하지 않습니다."}), 405

        cursor.execute("""
          UPDATE rights 
          SET can_read = ?, can_write = ?, user_id = ?
          WHERE id = ? AND post_id = ?
        """, (can_read, can_write, shared_id, right_id, post_id,))

      
        conn.commit()
        return jsonify({"state": 200, "message": "업데이트에 성공하였습니다!"}), 200
    except Exception as e:
      return jsonify({"state": 403, "error": str(e), "message": "업데이트에 실패하였습니다..."}), 403
    finally:
      conn.close()
  else:
    return jsonify({"state": 401, "message": "업데이트에 실패하였습니다..."}), 401