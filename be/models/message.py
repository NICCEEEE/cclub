#! /usr/bin/env python
# -*- coding: utf-8 -*-
from models import Model
from .user import User
from .notify import Notify
from .topic import Topic
import time
from flask import jsonify


class Message(Model):
    @staticmethod
    def get_mid():
        res = Message.get_all({})
        ids = [int(i.get('mid', -1)) for i in res]
        if len(ids) < 1:
            mid = 50000
        else:
            max_id = max(ids)
            mid = max_id + 1 if max_id > 0 else 50000
        return mid

    @classmethod
    def create_message(cls, user, form):
        receive = User.find_one({}, nickname=form.get('nickname'))
        if receive is None:
            return 'no user'
        elif receive.get('nickname') == user.get('nickname'):
            return 'unvalid'
        message_data = dict(
            ct=time.time(),
            mid=Message.get_mid(),
            send_id=user.get('uid'),
            send_name=user.get('nickname'),
            receive_id=receive.get('uid'),
            receive_name=receive.get('nickname'),
            content=form.get('content'),
            read=False,
            title=form.get('title')
        )
        res = Message.insert_one(**message_data)
        return res

    @classmethod
    def get_received_msg(cls, user):
        res = Message.find_all({}, receive_id=user.get('uid'))
        return res

    @classmethod
    def get_sended_msg(cls, user):
        res = Message.find_all({}, send_id=user.get('uid'))
        return res
