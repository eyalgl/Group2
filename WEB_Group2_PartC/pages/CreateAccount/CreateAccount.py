from flask import Blueprint, render_template, request, jsonify
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from db_connector import *

CreateAccount = Blueprint(
    'CreateAccount',
    __name__,
    static_folder='static',
    static_url_path='/CreateAccount',
    template_folder='templates'
)


@CreateAccount.route('/Create')
@CreateAccount.route('/CreateAccount')
def CreateAccount_func():
    return render_template('CreateAccount.html', page_name='Create Account')


@CreateAccount.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    existing_user = usersCol.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "כתובת הדואר האלקטרוני כבר קיימת במערכת"}), 400

    hashed_password = generate_password_hash(password)

    new_user = {
        "first_name": data.get("firstName"),
        "last_name": data.get("lastName"),
        "email": email,
        "password": hashed_password,  # שמירת הסיסמה המוצפנת
        "phone": data.get("phone"),
        "academic_institution": data.get("institution"),
    }
    usersCol.insert_one(new_user)
    return jsonify({"success": "המשתמש נרשם בהצלחה!"}), 201

