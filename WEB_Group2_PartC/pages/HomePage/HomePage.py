from flask import Blueprint, render_template, session, request, redirect, url_for, jsonify

HomePage = Blueprint(
    'HomePage',
    __name__,
    static_folder='static',
    static_url_path='/HomPage',
    template_folder='templates'
)

@HomePage.route('/')
@HomePage.route('/home')
def HomePage_func():  # put application's code here
    if not session.get('logged_in'):
        return redirect(url_for('Login.LoginFunc'))
    return render_template('HomePage.html', page_name='Home Page')