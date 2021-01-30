from generate import Creat_wrnt
from flask import Flask, request, redirect, render_template
import os
import re
from sys import platform
from flask_cors import CORS
from datetime import datetime
import app_logger
from setting import REDIRECT_URL
from telegram import send_telegram_bot

""" Подключаем логгер """
logger = app_logger.get_logger(__name__)
app = Flask(__name__, static_folder='static/')
CORS(app)


""" Редирект при захоже на главноую страницу """
@app.route('/')
def hello_world():
    i = request.args.get('id')
    if not i:
        return redirect(REDIRECT_URL)
    else:
        return render_template('index.html', id=i)


""" Запрос на обратку гарантии  """
@app.route('/gen', methods=['POST'])
def gen():
    client_data = request.get_data('id')
    strvalue = client_data.decode('utf-8')
    phone = strvalue.rsplit('=', 1)[1]
    creat_wrnt = Creat_wrnt.creat_warranty(phone)
    if creat_wrnt:
        return 'Good'
    else:
        logger.warning('Генерация гарантии прошла неудачно!')
        return 'Bad'


if __name__ == '__main__':
        app.run(debug=True)


""" Debug func
def get_time_running(func):
    def wrapper():
        start_time = datetime.now()
        func()
        end_time = datetime.now()
        logger.info(f'Время выполнения: {end_time - start_time}')
        return wrapper """
