from flask import Blueprint, render_template

ContactUsNotLogged = Blueprint(
    'ContactUsNotLogged',
    __name__,
    static_folder='static',
    static_url_path='/ContactUsNotLogged',
    template_folder='templates'
)

@ContactUsNotLogged.route('/ContactUsNotLogged')
def ContactUsNotLogged_func():  # put application's code here
    return render_template('ContactUsNotLogged.html', page_name='Contact Us Not Logged')
