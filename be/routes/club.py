#! /usr/bin/env python
# -*- coding: utf-8 -*-
from flask import (
    render_template,
    request,
    redirect,
    session,
    url_for,
    Blueprint,
    make_response,
    send_from_directory,
    jsonify
)
from werkzeug.utils import secure_filename
from models.user import User
import datetime
import os

main = Blueprint('club', __name__)


def current_user():
    # 从 session 中找到 user_id 字段, 找不到就 -1
    # 然后 User.find_by 来用 id 找用户
    # 找不到就返回 None
    username = session.get('username', None)
    user = User.find_one(username=username)
    return user


@main.route('/')
def club_index():
    # if current_user() is None:
    #     pass
    return render_template('index.html')


@main.route('/register', methods=['GET', 'POST'])
def register():
    # 如果是get请求则直接返回原页面
    method = request.method
    if method == 'GET':
        return render_template('index.html')
    # 如果是post请求则检查注册合法性
    register_info = request.form
    isvalid_register = User.valid_register(register_info)
    return 'True' if isvalid_register else 'False'


@main.route('/login', methods=['GET', 'POST'])
def login():
    method = request.method
    if method == 'GET':
        return render_template('index.html')
    login_info = request.form
    user = User.valid_login(login_info)
    if user is not None:
        session['username'] = user.get('username')
        return 'True'
    return 'False'

