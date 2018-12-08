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
from models.user import User
from models import codeword
from random import randint
main = Blueprint('api', __name__)


# 查找注册用户名是否已存在
@main.route('/username/<username>', methods=['GET'])
def find_username(username):
    res = User.find_one(username=username)
    if res is not None:
        return 'username exist'
    return 'True'


# 查找注册邮箱是否已存在
@main.route('/email/<email>', methods=['GET'])
def find_email(email):
    res = User.find_one(email=email)
    if res is not None:
        return 'email exist'
    return 'True'


# 获得一条验证码
@main.route('/codeword', methods=['GET'])
def get_codeword():
    cid = list(codeword.keys())[randint(0, 99)]
    problem = {
        'cid': cid,
        'problem': codeword[cid]
    }
    print('生成验证码：', problem)
    return jsonify(problem)


# 输入验证码验证
@main.route('/codeword/solution', methods=['GET'])
def check_codeword():
    cid = request.args.get('cid')
    answer = request.args.get('answer')
    problem = codeword.get(cid, None)
    print('获得验证码id为：', cid, '题目为：', problem, '获得答案为：', answer)
    if problem is not None:
        if eval(problem) == int(answer):
            return 'True'
    return 'False'
