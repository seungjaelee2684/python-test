# 이승재 [Frontend Developer]

## 📝 프로젝트 소개

이 프로젝트는 Flask를 기반으로 한 RESTful API로, SQLite 데이터베이스를 사용하여 사용자 관리, 링크 저장 및 접근 권한을 제어하는 기능을 제공합니다. JWT 인증을 활용하여 보안성을 강화하였습니다.

## 🛠️ 사용된 주요 언어 및 라이브러리

* **Python:** 사용된 언어
* **Flask:** 웹 프레임워크
* **Flask-CORS:** CORS 설정
* **Flask-JWT-Extended:** JWT 인증
* **Python-dotenv:** 환경 변수 관리
* **SQLite3:** 내장 데이터베이스

## 🗄️ 데이터베이스 설계

* **users 테이블(사용자 정보)**
| **컬럼명** | **타입** | **속성** |
| ---------- | -------- | -------- |
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| username | TEXT | UNIQUE, NOT NULL |
| password | TEXT | NOT NULL |

* **links 테이블(저장된 링크)**
| **컬럼명** | **타입** | **속성** |
| ---------- | -------- | -------- |
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| created_by | TEXT | NOT NULL (users.username 참조) |
| name | TEXT | NOT NULL |
| url | TEXT | NOT NULL |
| category | TEXT | NOT NULL |
| description | TEXT | (선택) |

* **rights 테이블(저장된 링크)**
| **컬럼명** | **타입** | **속성** |
| ---------- | -------- | -------- |
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| post_id | INTEGER | NOT NULL (links.id 참조) |
| user_id | TEXT | NOT NULL (users.username 참조) |
| can_read | BOOLEAN | DEFAULT FALSE |
| can_write | BOOLEAN | DEFAULT FALSE |