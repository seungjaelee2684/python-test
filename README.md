# 이승재 [Frontend Developer]

## 📝 프로젝트 소개

<br />

이 프로젝트는 Flask를 기반으로 한 RESTful API로, SQLite 데이터베이스를 사용하여 사용자 관리, 링크 저장 및 접근 권한을 제어하는 기능을 제공합니다. JWT 인증을 활용하여 보안성을 강화하였습니다.

<br />

## 🛠️ 사용된 주요 언어 및 라이브러리

<br />

* **Python:** 사용된 언어
* **Flask:** 웹 프레임워크
* **Flask-CORS:** CORS 설정
* **Flask-JWT-Extended:** JWT 인증
* **Python-dotenv:** 환경 변수 관리
* **SQLite3:** 내장 데이터베이스

<br />

## 🗄️ 데이터베이스 설계

<br />

* **users 테이블(사용자 정보)**

| **컬럼명** | **타입** | **속성** |
| ---------- | -------- | -------- |
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| username | TEXT | UNIQUE, NOT NULL |
| password | TEXT | NOT NULL |

<br />

* **links 테이블(저장된 링크)**

| **컬럼명** | **타입** | **속성** |
| ---------- | -------- | -------- |
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| created_by | TEXT | NOT NULL (users.username 참조) |
| name | TEXT | NOT NULL |
| url | TEXT | NOT NULL |
| category | TEXT | NOT NULL |
| description | TEXT | (선택) |

<br />

* **rights 테이블(저장된 링크)**

| **컬럼명** | **타입** | **속성** |
| ---------- | -------- | -------- |
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| post_id | INTEGER | NOT NULL (links.id 참조) |
| user_id | TEXT | NOT NULL (users.username 참조) |
| can_read | BOOLEAN | DEFAULT FALSE |
| can_write | BOOLEAN | DEFAULT FALSE |

<br />

## 🛠️ API 명세서

<br />

### 로그인, 회원가입(auth.py)

**/register (POST)**

기능: 회원가입
설명: 새로운 사용자가 회원가입을 할 수 있는 경로입니다. 사용자가 제공한 사용자명과 비밀번호를 기반으로 회원가입을 처리합니다. 중복된 사용자명은 처리되지 않으며, 비밀번호는 해싱하여 저장됩니다.

<br />

**/login (POST)**

기능: 로그인
설명: 사용자가 로그인할 수 있는 경로입니다. 사용자명과 비밀번호를 입력받아 인증 후, 유효한 경우 JWT를 발급하고 반환합니다.

<br />

### 링크(link.py)

**/inquiry (GET)**

* 기능: 웹 링크 조회
* 설명: tag (카테고리)로 링크를 필터링하여 모든 링크를 조회합니다. 토큰이 있다면 사용자에게 해당 링크가 소유한 것인지 여부를 반환합니다.

<br />

**/inquiry/detail (GET)**

* 기능: 웹 링크 상세 조회
* 설명: 특정 링크의 상세 정보를 조회합니다. 토큰이 유효하다면 소유자인지 확인할 수 있습니다.
  
<br />

**/upload (POST)**

* 기능: 웹 링크 업로드
* 설명: 새로운 웹 링크를 업로드합니다. 토큰을 통해 사용자가 인증된 경우만 업로드가 가능합니다.

<br />

**/update (PUT)**

* 기능: 웹 링크 업데이트
* 설명: 기존 링크의 정보를 업데이트합니다. 토큰을 통해 사용자가 인증된 경우만 업데이트가 가능합니다.
  
<br />

**/delete (DELETE)**

* 기능: 웹 링크 삭제
* 설명: 특정 링크를 삭제합니다. 토큰을 통해 사용자가 인증된 경우만 삭제가 가능합니다.

<br />

**/search (POST)**

* 기능: 웹 링크 검색
* 설명: tag (카테고리)나 word (링크 이름 등)를 기준으로 링크를 검색합니다. 토큰이 있다면 사용자에게 해당 링크가 소유한 것인지 여부를 반환합니다.

<br />

### 권한(right.py)

**/add (POST)**

* 기능: 권한 추가
* 설명: 특정 게시물에 대해 다른 사용자에게 읽기 및 쓰기 권한을 추가하는 경로입니다. 요청을 처리할 때, JWT를 통해 인증된 사용자의 권한을 확인하고, 게시물의 소유자와 권한을 부여할 사용자의 유효성을 검증합니다.

<br />

**/inquiry (GET)**

* 기능: 권한 조회
* 설명: 특정 게시물에 대한 권한 정보를 조회하는 경로입니다. 사용자가 게시물의 소유자이거나 권한이 부여된 사용자만 권한 정보를 조회할 수 있습니다.

<br />

**/inquiry/detail (GET)**

* 기능: 권한 상세 조회
* 설명: 특정 권한에 대한 상세 정보를 조회하는 경로입니다. 주어진 right_id를 기반으로 권한 정보를 조회합니다.

<br />

**/update (PUT)**

* 기능: 권한 업데이트
* 설명: 기존에 설정된 권한을 업데이트하거나 삭제하는 경로입니다. 사용자가 권한을 업데이트할 때, 게시물의 소유자와 권한을 부여할 사용자의 유효성을 확인합니다.

<br />

## 📱 반응형 웹

반응형 웹 페이지 구현
