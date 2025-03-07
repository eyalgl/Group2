from flask import Flask

app = Flask(__name__)
app.secret_key='123'

from pages.HomePage.HomePage import HomePage
app.register_blueprint(HomePage)

from pages.PublishDrive.PublishDrive import PublishDrive
app.register_blueprint(PublishDrive)

from pages.ContactUs.ContactUs import ContactUs
app.register_blueprint(ContactUs)

from pages.MyAccount.MyAccount import MyAccount
app.register_blueprint(MyAccount)

from pages.Feedback.Feedback import Feedback
app.register_blueprint(Feedback)

from pages.Login.Login import Login
app.register_blueprint(Login)

from pages.CreateAccount.CreateAccount import CreateAccount
app.register_blueprint(CreateAccount)

from pages.ContactUsNotLogged.ContactUsNotLogged import ContactUsNotLogged
app.register_blueprint(ContactUsNotLogged)

from pages.MyDrives.MyDrives import myDrives
app.register_blueprint(myDrives)

from pages.SearchDrive.SearchDrive import SearchDrive
app.register_blueprint(SearchDrive)