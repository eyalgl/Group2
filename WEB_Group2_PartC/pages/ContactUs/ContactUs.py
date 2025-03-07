from flask import Blueprint, render_template

ContactUs = Blueprint(
    'ContactUs',
    __name__,
    static_folder='static',
    static_url_path='/ContactUs',
    template_folder='templates'
)

@ContactUs.route('/Contact')
@ContactUs.route('/ContactUs')
def ContactUs_func():  # put application's code here
    return render_template('ContactUs.html', page_name='Contact Us')