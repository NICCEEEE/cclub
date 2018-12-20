#! /usr/bin/env python
# -*- coding: utf-8 -*-
from models import Model
import time
from flask import jsonify


class Notify(Model):
    @classmethod
    def get_all_notify(cls, userid):
        megs = Notify.find_all({'receive_id': 0}, receive_id=userid)
        return jsonify(megs)

    @staticmethod
    def get_nid():
        res = Notify.get_all({})
        ids = [int(i.get('nid', -1)) for i in res]
        if len(ids) < 1:
            nid = 30000
        else:
            max_id = max(ids)
            nid = max_id + 1 if max_id > 0 else 30000
        return nid

    @classmethod
    def send_system(cls, title, detail, receive_id):
        nid = Notify.get_nid()
        Notify.insert_one(nid=nid, type='system', title=title, detail=detail, receive_id=receive_id, ct=time.time(),
                          read=False)

    @classmethod
    def send_reply(cls, title, detail, receive_id):
        nid = Notify.get_nid()
        Notify.insert_one(nid=nid, type='reply', title=title, detail=detail, receive_id=receive_id, ct=time.time(),
                          read=False)

    @classmethod
    def send_upvote(cls, title, detail, receive_id):
        nid = Notify.get_nid()
        Notify.insert_one(nid=nid, type='vote', title=title, detail=detail, receive_id=receive_id, ct=time.time(),
                          read=False)
