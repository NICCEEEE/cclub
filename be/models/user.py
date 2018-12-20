#! /usr/bin/env python
# -*- coding: utf-8 -*-
from models import Model, codeword
from flask import jsonify
from .notify import Notify
import re
import hashlib
import time
from random import randint


class User(Model):
    def __init__(self, form):
        self.id = form.get('id', -1)
        self.username = form.get('username', '')
        self.password = form.get('password', '')
        self.email = form.get('email', '')

    @classmethod
    def hashed_password(cls, pwd):
        # 加盐hash
        salt = '$!@><?>HUI&DWQa`.;][#$^%&8ssdf234'
        # 用 ascii 编码转换成 bytes 对象, unicode字符不能直接编码
        p = pwd.encode('ascii')
        s = hashlib.sha256(p).hexdigest() + salt
        # 加盐加密
        hashed_pwd = hashlib.sha256(s.encode('ascii')).hexdigest()
        return hashed_pwd

    @staticmethod
    def valid_register(user):
        # 获得用户注册表单
        username = user.get('new_username')
        password = user.get('new_password')
        confirm_pwd = user.get('confirm_pwd')
        email = user.get('new_email')
        answer = user.get('answer')
        cid = user.get('cid')
        # 正则匹配表达式
        valid_user = '^[A-Za-z0-9]{6,12}$'
        valid_pwd = '^[A-Za-z0-9]{6,15}$'
        valid_email = '^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$'
        valid_answer = '^[-]?[0-9]+$'
        # 正则匹配
        if username is None or re.fullmatch(valid_user, username) is None:
            return False
        else:
            # 名称合法则在数据库中查找是否已存在
            if User.find_one({}, username=username):
                return False
        if password is None or re.fullmatch(valid_pwd, password) is None:
            return False
        if confirm_pwd != password:
            return False
        if email is None or re.fullmatch(valid_email, email) is None:
            return False
        else:
            if User.find_one({}, email=email):
                return False
        if answer is None or re.fullmatch(valid_answer, answer) is None:
            return False
        else:
            if eval(codeword[cid]) != int(answer):
                return False
        # 添加用户id
        ids = [int(i.get('uid', -1)) for i in User.get_all({})]
        if len(ids) < 1:
            uid = 10000
        else:
            max_id = max(ids)
            uid = max_id + 1 if max_id > 0 else 10000
        userinfo = dict(
            username=username,
            password=User.hashed_password(password),
            email=email,
            uid=uid,
            authority=111,
            topices=0,
            replies=0,
            views=0,
            give_votes=0,
            receive_votes=0,
            ct=time.time(),
            active_time=time.time(),
            publish_topices=[],
            avatar=None,
            nickname=username
        )
        User.insert_one(**userinfo)
        notify = dict(
            title='欢迎来到CCLUB ：）',
            receive_id=uid,
            detail='CCLUB 是基于NodeBB的理念，模仿NodeBB和NodeBB-CN创建的论坛，由于是出于练习创建的论坛，还有许多不足，敬请见谅！'
        )
        Notify.send_system(**notify)
        return True

    @staticmethod
    def valid_login(user):
        username = user.get('username')
        password = user.get('password')
        answer = user.get('answer')
        cid = user.get('cid')
        userinfo = User.find_one({}, username=username)
        valid_answer = '^[-]?[0-9]+$'
        if userinfo is not None:
            if User.hashed_password(password) == userinfo.get('password'):
                if answer is not None and re.fullmatch(valid_answer, answer):
                    if eval(codeword[cid]) == int(answer):
                        print('登录成功\nusername: ', username)
                        User.update_one({'username': username}, {'active_time': time.time()})
                        return user
        return None

    @classmethod
    def get_user_summary(cls, user_info):
        res = User.find_one({'authority': 0,
                             'password': 0,
                             'email': 0,
                             'birthday': 0,
                             'website': 0,
                             'job': 0,
                             'location': 0,
                             'github': 0,
                             'steam': 0,
                             'twitter': 0,
                             'username': 0,
                             }, uid=int(user_info.get('uid')))
        return res

    @classmethod
    def get_my_summary(cls, user):
        res = User.find_one({'authority': 0, 'password': 0}, username=user.get('username'),
                            uid=int(user.get('uid')))
        if res is None:
            return 'false'
        else:
            User.update_one({'uid': int(user.get('uid'))}, {'active_time': time.time()})
            return jsonify(res)

    @classmethod
    def save_profile(cls, user, info):
        new_info = {
            'website': info['website'],
            'job': info['job'],
            'location': info['location'],
            'birthday': info['birthday'],
            'github': info['github'],
            'steam': info['steam'],
            'twitter': info['twitter'],
            'active_time': time.time()
        }
        res = User.update_one({'uid': user.get('uid')}, new_info)
        return res

    @classmethod
    def get_notify(cls, user):
        res = Notify.get_all_notify(user.get('uid'))
        return res

    @classmethod
    def change_pwd(cls, user, change_info):
        current = change_info.get('current')
        new_pwd = change_info.get('newPwd')
        confirm = change_info.get('confirm')
        valid_pwd = '^[A-Za-z0-9]{6,15}$'
        if User.hashed_password(current) != user.get('password'):
            return False
        if re.fullmatch(valid_pwd, new_pwd) is None:
            return False
        if confirm != new_pwd:
            return False
        new_password = User.hashed_password(new_pwd)
        res = User.update_one({'uid': user.get('uid')}, {'password': new_password})
        if res is None:
            return False
        else:
            return True

    @classmethod
    def change_nickname(cls, user, change_info):
        new_nickname = change_info.get('nickname')
        valid_name = '^[\d\w\u4e00 -\u9fa5_]{2,12}$'
        if re.fullmatch(valid_name, new_nickname) is None:
            return False
        res = User.update_one({'uid': user.get('uid')}, {'nickname': new_nickname})
        if res is None:
            return False
        else:
            return new_nickname
