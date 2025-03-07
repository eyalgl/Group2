from flask import Blueprint, render_template, session, request, redirect, url_for, jsonify
from werkzeug.security import check_password_hash
from db_connector import *


Login = Blueprint(
    'Login',
    __name__,
    static_folder='static',
    static_url_path='/Login',
    template_folder='templates'
)


@Login.route('/Login', methods=['POST'])
def LoginFunc():
    session['logged_in'] = False
    data = request.json

    email = data.get('email')
    password = data.get('password')
    print(password)

    if not email or not password:
        return jsonify({"error": "אנא מלא את כל השדות"}), 400
    customer = usersCol.find_one({'email': email})
    if customer and check_password_hash(customer["password"], password):  # בדיקת סיסמה מוצפנת
        session['email'] = email
        session['logged_in'] = True
        session['fullName'] = f"{customer.get('first_name', '')} {customer.get('last_name', '')}".strip()
        return jsonify({"success": True})

    return jsonify({"error": "שם משתמש או סיסמה שגויים"}), 401


@Login.route('/logout', methods=['GET'])
def logout_func():
    session.clear()
    return redirect('/Login')

@Login.route('/Login')
def login():
    return render_template('Login.html', page_name='Login')