import sqlite3
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import cross_origin
from datetime import timedelta

auth = Blueprint('auth', __name__)

# 회원가입
@auth.route("/register", methods=["POST"])
@cross_origin(origins="http://localhost:8000")
def register():
    data = request.get_json()
    username = data.get("username")
    password = generate_password_hash(data.get("password"))

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        return jsonify({"state": 201, "message": "회원가입 성공!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"state": 400, "error": "이미 존재하는 사용자입니다."}), 400
    finally:
        conn.close()

# 로그인
@auth.route("/login", methods=["POST"])
@cross_origin(origins="http://localhost:8000")
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user[0], password):
        access_token = create_access_token(identity=username, expires_delta=timedelta(hours=1))
        return jsonify({"state": 201, "access_token": access_token, "user_id": username}), 201
    return jsonify({"state": 400, "error": "잘못된 로그인 정보입니다."}), 400