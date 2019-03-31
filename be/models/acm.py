#! /usr/bin/env python
# -*- coding: utf-8 -*-
from models import Model


class Acm(Model):
    @staticmethod
    def get_mid():
        res = Acm.get_all({})
        ids = [int(i.get('aid', -1)) for i in res]
        if len(ids) < 1:
            aid = 60000
        else:
            max_id = max(ids)
            aid = max_id + 1 if max_id > 0 else 60000
        return aid

    @classmethod
    def create_test(cls, test_info):
        detail = {
            'title': test_info.get('title'),
            'difficult': test_info.get('difficult'),
            'content': test_info.get('content'),
            'answer': test_info.get('answer'),
            'acceptCount': 0,
            'submitCount': 0,
            'aid': Acm.get_mid()
        }
        result = Acm.insert_one(**detail)
        if result:
            return True
        else:
            return False

