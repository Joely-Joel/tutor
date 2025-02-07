from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key'

db_path = r'C:\\Users\741124\Downloads\SQLiteDatabaseBrowserPortable\tutor.db'
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///Table.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class UserTable(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # PK is always unique
    username = db.Column(db.String(), nullable=False)
    password = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), nullable=False)

class MessageTable(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # PK is always unique
    name = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), nullable=False)
    message = db.Column(db.String(), nullable=False)

# Route for the homepage
@app.route('/')
def home():
    return render_template('home.html')


# Route for the sign-up or login page
@app.route('/sign', methods=['Get','POST'])
def sign():
    if request.method == 'POST':
        Username = request.form['username']
        print(Username)
        Password = request.form['password']
        print(Password)
        try:
            Email = request.form['email']
        except:
            Email = ""
        else:
            Email = request.form['email']
        print(Email)
        if Email != "":
            Record = UserTable(username=Username, password=Password, email=Email)
            db.session.add(Record)
            db.session.commit()
            return redirect('/sign')
        else:
            CurrentUser = UserTable.query.filter_by(username=Username).first()
            if CurrentUser.password == Password:
                return redirect('/user')

    return render_template('sign.html')


# Route for the blog page
@app.route('/blog')
def blog():
    return render_template('blog.html')


# Route for the about page
@app.route('/about')
def about():
    return render_template('about.html')


# Route for the shop page
@app.route('/shop')
def shop():
    return render_template('shop.html')


# Route for the contact page
@app.route('/contact')
def contact():
    return render_template('contact.html')


# Route to handle form submissions from the contact page
# Route to handle form submissions from the contact page
@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']

        print(f"Message from {name} ({email}): {message}")

        # Assuming you have a MessageTable to store the messages
        record = MessageTable(name=name, email=email, message=message)
        db.session.add(record)
        db.session.commit()

        return redirect('/submit')

    return render_template('submit.html')

@app.route('/user')
def user():
    return render_template('user.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(debug=True)
