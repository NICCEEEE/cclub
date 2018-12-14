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
from models.topic import Topic
import time
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


@main.route('/addtopic', methods=['POST'])
def addtopic():
    user = current_user()
    if user is None:
        return render_template('index.html')
    username = user.get('username')
    topic_info = request.form
    # 添加帖子id
    ids = [int(i.get('tid', -1)) for i in Topic.get_all()]
    if len(ids) < 1:
        tid = 20000
    else:
        max_id = max(ids)
        tid = max_id + 1 if max_id > 0 else 20000
    topic_data = dict(
        ct=time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(float(topic_info.get('ct')))),
        author=username,
        title=topic_info.get('title'),
        content=topic_info.get('content'),
        board=topic_info.get('board'),
        vote=0,
        comments=0,
        views=0,
        essence=False,
        last_comment_author=None,
        last_comment_time=None,
        last_comment_content=None,
        uid=user.get('uid', -1),
        tid=tid
    )
    res = Topic.insert_one(**topic_data)
    if res is not None:
        return 'success'
    else:
        return 'fail'


