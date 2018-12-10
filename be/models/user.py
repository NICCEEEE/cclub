#! /usr/bin/env python
# -*- coding: utf-8 -*-
from models import Model, codeword
import re
import hashlib


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
            if User.find_one(username=username):
                return False
        if password is None or re.fullmatch(valid_pwd, password) is None:
            return False
        if confirm_pwd != password:
            return False
        if email is None or re.fullmatch(valid_email, email) is None:
            return False
        else:
            if User.find_one(email=email):
                return False
        if answer is None or re.fullmatch(valid_answer, answer) is None:
            return False
        else:
            if eval(codeword[cid]) != int(answer):
                return False
        userinfo = dict(
            username=username,
            password=User.hashed_password(password),
            email=email,
        )
        User.insert_one(**userinfo)
        return True

    @staticmethod
    def valid_login(user):
        username = user.get('username')
        password = user.get('password')
        answer = user.get('answer')
        cid = user.get('cid')
        userinfo = User.find_one(username=username)
        valid_answer = '^[-]?[0-9]+$'
        if userinfo is not None:
            if User.hashed_password(password) == userinfo.get('password'):
                if answer is None or re.fullmatch(valid_answer, answer) is None:
                    return None
                else:
                    if eval(codeword[cid]) != int(answer):
                        return None
        print('登录成功\nusername: ', username)
        return user
