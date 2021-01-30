import app_logger
import os
import os.path
import requests
import sys
from setting import LOGIN, PASS, URL_AUTH, URL_WRNT, SMS_TEXT
from smsc_api import SMSC
from telegram import send_telegram_bot


logger = app_logger.get_logger(__name__)


class Creat_wrnt():
    """ Генерация гарантийного талона """
    def creat_warranty(order_id: str):
        try:
            session = Auth.get_session()
            with session as s:
                url = URL_WRNT + order_id  # URL с шаблоном заказа
                x = s.get(url)  # Отправляем запрос получаения траницы шаблона
                requiredHtml = x.text  # Получаем исходный код страницы шаблона
                if "redactor" not in requiredHtml:
                    send_telegram_bot(f'Произошла ошибка! Не найдена страница печати!')
                    logger.error(f'Произошла ошибка! Не найдена страница печати!')
                    return False
                creat_html = Creat_wrnt.creat_html(order_id, requiredHtml)
                if creat_html:
                    return True
        except Exception as e:
            send_telegram_bot(f'Произошла ошибка! {e}')
            logger.error(f'Произошла ошибка! {e}')
            return False

    def creat_html(order_id: str, requiredHtml: str):
        """ Создание html файла """
        dir = os.path.abspath(os.curdir)
        file = f"{dir}/static/{order_id}.html"
        html = cut_html(requiredHtml)
        clean_html = replace_data(html)
        parse_phone = get_phone(clean_html)
        with open(file, 'w', encoding="utf-8") as f:
            f.write(clean_html)
        send_sms = Creat_wrnt.send(parse_phone, order_id)
        if send_sms:
            return True

    def send(number, order):
        """ Отправка СМС на номер клиента """
        smsc = SMSC()
        sms_test = SMS_TEXT.replace('[id]', order)
        r = smsc.send_sms(f'{number}', sms_test)
        if r:
            logger.info('СМС отправлено!')
            return True
        else:
            send_telegram_bot(f'СМС не отправлено! Номер заказа {order}')
            logger.error(f'СМС не отправлено! Номер заказа {order}')


class Auth():
    """ Авторизация на сайте, а также возвращение активной сессии """
    def get_session():
        with requests.Session() as session:
            url_auth = URL_AUTH  # URL с формами логина
            data_auth = {"login": LOGIN, "password": PASS}  # Формируем запрос
            session.post(url_auth, data_auth)
            check_auth = session.get(url_auth)  # Отправляем данные
            if "Войти" in check_auth.text:
                send_telegram_bot('Ошибка авторизации в Gincore!')
                logger.error('Ошибка авторизации в Gincore!')
            else:
                return session


def cut_html(html: str):
    """ Обрезает лишний html код (печать)  """
    start = '<div class="col-sm-12 well unprint">'
    end = ' <div id="redactor">'
    l = html.find(start)
    r = html.find(end)
    clean_html = (html[:l] + html[r+1:-1])
    return clean_html


def get_phone(html):
    """ Парсинг номера из html """
    start = html.find('data-key="phone" class="template">') \
        + len('data-key="phone" class="template">')
    end = html.find('</span></span></div><div class="rauan-brief')
    parse_phone = html[start:end]
    return parse_phone


def replace_all(dict, str):
    """ Замена слов по словарю """
    for key in dict:
        str = str.replace(key, dict[key])
    return str


def replace_data(data: str):
    """ Функция скрамливает данные обработчику замены данных"""
    """ Заменяем старые javascript на новые """
    old1 = '<script type="text/javascript" src="/gincore/public/manage/js/prints.js?4"></script>'
    new1 = '<script type="text/javascript" src="./js/background.js"></script>'
    old2 = '<script type="text/javascript" src="/gincore/public/manage/js/print-helpers.js"></script>'
    new2 = '<script type="text/javascript" src="./js/jquery.js"></script>'
    """ Заменяем стили на свои """
    old_style = '<link href="/gincore/public//assets/dist/css/print.css?id=b91b4b30d34f3fe5e3ab" rel="stylesheet">'
    new_style = '<link href="./css/styles.css" rel="stylesheet">'
    """ Меняем пути """
    old_path = 'src="../gincore/'
    new_path = 'src="./gincore/'
    old_js = 'src="/js/'
    new_js = 'src="./js/'
    """ Удалаяем попись """
    rm_hand = "Подпись _______________"
    replaced_data = replace_all(
        {old1: new1,
        old1: new1,
        old2: new2,
        old_style: new_style,
        old_path: new_path,
        old_js: new_js,
        rm_hand: ""}, data)
    return replaced_data
