import sqlite3
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import cross_origin
from datetime import timedelta

link = Blueprint('link', __name__)

# 웹 링크 조회
@link.route("/inquiry", methods=["GET"])
@cross_origin(origins="http://localhost:8000")
def register():
  tag = request.args.get("tag")

  if tag:
    return jsonify({"state": 200, "message": "조회에 성공하였습니다!"}), 200
  else:
    return jsonify({"state": 401, "message": "조회에 실패하였습니다..."}), 401