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
  access_token = authorization_header.split(" ")[1]
  
  links = []

  if access_token:
    try:
      decode_token = decode_token(access_token)

      conn = sqlite3.connect("users.db")
      cursor = conn.cursor()

      if tag:
        cursor.execute("SELECT * FROM links WHERE category = ?", (tag,))
      else:
        cursor.execute("SELECT * FROM links")

      links = cursor.fetchall()
      conn.close()
      return jsonify({"state": 200, "data": links, "message": "조회에 성공하였습니다!"}), 200
    except Exception as e:
      return jsonify({"state": 403, "error": "조회에 실패하였습니다..."}), 403
  else:
    return jsonify({"state": 401, "error": "조회에 실패하였습니다..."}), 401
  
# 웹 링크 업로드
@link.route("/upload", methods=["POST"])
@cross_origin(origins="http://localhost:8000")
def inquiry():
  authorization_header = request.headers.get("Authorization")
  access_token = authorization_header.split(" ")[1]
  decode_token = decode_token(access_token)
  data = request.get_json()
  name = data.get("name")
  url = data.get("url")
  category = data.get("category")
  description = data.get("description")
  shared_id = data.get("shared_id")

  if decode_token:
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    links = cursor.fetchall()
    conn.close()
    try:
      cursor.execute("""
        INSERT INTO links (name, url, category, description, shared_id)
        VALUES (?, ?, ?, ?, ?)
      """, (name, url, category, description, shared_id))      

      
      return jsonify({"state": 200, "data": links, "message": "조회에 성공하였습니다!"}), 200
    except Exception as e:
      return jsonify({"state": 200, "data": links, "message": "조회에 성공하였습니다!"}), 200
  else:
    return jsonify({"state": 401, "error": "조회에 실패하였습니다..."}), 401