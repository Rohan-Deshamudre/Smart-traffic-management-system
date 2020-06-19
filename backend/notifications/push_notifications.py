import requests
from scenwise_backend.settings import FIREBASE_API


def push_notification(title, body):
    data = {
        'to': FIREBASE_API['token'],
        'notification': {
            'title': title,
            'body': body
        },
        'priority': 10
    }
    requests.post(FIREBASE_API['url'], json=data, headers=FIREBASE_API['headers'])
