import sqlite3
from flask import Blueprint, request, jsonify
from flask_jwt_extended import decode_token
from flask_cors import cross_origin
from typing import List, Dict, Any

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

  if verify_token:
    try:
      conn = sqlite3.connect("users.db")
      conn.row_factory = sqlite3.Row
      cursor = conn.cursor()

      if tag:
        cursor.execute("SELECT * FROM links WHERE category = ?", (tag,))
      else:
        cursor.execute("SELECT * FROM links")

      links: List[Dict[str, Any]] = [dict(row) for row in cursor.fetchall()]
      conn.close()
      return jsonify({"state": 200, "data": links, "message": "조회에 성공하였습니다!"}), 200
    except Exception as e:
      return jsonify({"state": 403, "error": "조회에 실패하였습니다..."}), 403
  else:
    return jsonify({"state": 401, "error": "조회에 실패하였습니다..."}), 401
  
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

  if verify_token:
    try:
      conn = sqlite3.connect("users.db")
      conn.row_factory = sqlite3.Row
      cursor = conn.cursor()
      cursor.execute("SELECT * FROM links WHERE id = ?", (link_id,))

      link = cursor.fetchone()
      conn.close()
  
      return jsonify({"state": 200, "data": dict(link), "message": "조회에 성공하였습니다!"}), 200
    except Exception as e:
      return jsonify({"state": 403, "error": "조회에 실패하였습니다..."}), 403
  else:
    return jsonify({"state": 401, "error": "조회에 실패하였습니다..."}), 401
  
# 웹 링크 업로드
@link.route("/upload", methods=["POST"])
@cross_origin(origins="http://localhost:8000")
def upload():
  authorization_header = request.headers.get("Authorization")
  access_token = authorization_header.split(" ")[1]
  verify_token = decode_token(access_token)
  user_id = verify_token.get("sub")

  data = request.get_json()
  name = data.get("name")
  url = data.get("url")
  category = data.get("category")
  description = data.get("description")
  shared_id = data.get("shared_id")

  if verify_token:
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    
    try:
      cursor.execute("""
        INSERT INTO links (created_by, name, url, category, description, shared_id)
        VALUES (?, ?, ?, ?, ?, ?)
      """, (user_id, name, url, category, description, shared_id))   
      conn.commit()   
      
      return jsonify({"state": 200, "message": "업로드에 성공하였습니다!"}), 200
    except Exception as e:
      return jsonify({"state": 403, "error": str(e), "message": "업로드에 실패하였습니다..."}), 403
    finally:
      conn.close()
  else:
    return jsonify({"state": 401, "message": "업로드에 실패하였습니다..."}), 401