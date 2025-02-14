from flask import Flask
from auth import auth
from link import link
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, resources={
  r"/link/*": {"origins": "http://localhost:8000"},
  r"/app/*": {"origins": "http://localhost:8000"}
})

load_dotenv()

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(link, url_prefix='/link')

if __name__ == "__main__":
  app.run(debug=True)