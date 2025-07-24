from flask import Flask, render_template, redirect, url_for, request, flash,jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.secret_key = 'dontplayplaywithmysecretkey123456'

# Set up MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '127425'  # Use your MySQL password
app.config['MYSQL_DB'] = 'task_manager'
mysql = MySQL(app)

# Set up Flask-Login #normally we use normal login method whereby once user login then we deal with session ourselves 
# flask-login allows us to manage session very easily because it can remember current user
login_manager = LoginManager()
login_manager.init_app(app)


# Set up Flask-Bcrypt for password hashing
bcrypt = Bcrypt(app)

# User model setup
class User(UserMixin):
    def __init__(self, id):
        self.id = id


# Login manager setup
@login_manager.user_loader
def load_user(user_id):
    return User(user_id)






@app.route('/signup', methods = ['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        cursor = mysql.connection.cursor()
        result = cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        if result > 0:
            flash('Username exists!', 'danger')
            cursor.close()
            return render_template('signup.html')
        
        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
        mysql.connection.commit()
        cursor.close()
        flash('Account created!', 'success')
        return redirect(url_for('login'))
    return render_template('signup.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
        user = cursor.fetchone()
        cursor.close()

        if user and bcrypt.check_password_hash(user[2], password):  # Check hashed password
            user_obj = User(user[0])
            login_user(user_obj)
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Login failed. Check your username and/or password.', 'danger')
    return render_template('login.html')

# CRUD (Task Management)
@app.route('/api/tasks')
def get_tasks():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM tasks WHERE user_id=%s", (current_user.id,))
    tasks = cursor.fetchall()
    cursor.close()
    tasks_json = [
    {
        'id': row[0],
        'title': row[2],
        'description': row[3],
        'due_date': row[4].strftime('%Y-%m-%d'),
        'status': row[5]
    }
    for row in tasks
    ]
    
    return jsonify(tasks_json)
    
@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/add_task', methods=['POST'])
@login_required
def add_task():
    title = request.form['title']
    description = request.form['description']
    due_date = request.form['due_date']
    priority = request.form['priority']
    category = request.form['category']
    
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO tasks (user_id, title, description, due_date, priority, category) VALUES (%s, %s, %s, %s, %s, %s)", 
                   (current_user.id, title, description, due_date, priority, category))
    mysql.connection.commit()
    cursor.close()
    flash('Task added!', 'success')
    return redirect(url_for('dashboard'))

@app.route('/')
def home():
    return redirect(url_for('login'))

if __name__ == "__main__":
    app.run(debug=True)