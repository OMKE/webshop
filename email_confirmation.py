from itsdangerous import URLSafeTimedSerializer
from config import app, mail
from flask_mail import Message


def send_email(to, subject, template):
    message = Message(subject, recipients=[to], html=template, sender=app.config['MAIL_DEFAULT_SENDER'])
    mail.send(message)



def generate_confirmation_token(email):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    return serializer.dumps(email, salt=app.config['SECURITY_PASSWORD_SALT'])

def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token, salt=app.config['SECURITY_PASSWORD_SALT'], max_age=expiration)
    except:
        return False
    return email

