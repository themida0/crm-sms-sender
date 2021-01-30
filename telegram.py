import requests
from setting import BOT_TOKEN, USER_ID


def send_telegram_bot(text):
	url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage?chat_id={USER_ID}&text={text}"
	res = requests.post(url)




