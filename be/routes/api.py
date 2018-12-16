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
from models.topic import Topic
from models import codeword
from random import randint
main = Blueprint('api', __name__)


# 查找注册用户名是否已存在
@main.route('/username/<username>', methods=['GET'])
def find_username(username):
    res = User.find_one({}, username=username)
    if res is not None:
        return 'username exist'
    return 'True'


# 查找注册邮箱是否已存在
@main.route('/email/<email>', methods=['GET'])
def find_email(email):
    res = User.find_one({}, email=email)
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


# 检查登录状态
@main.route('/user', methods=['GET'])
def check_login():
    username = session.get('username', None)
    if username is None:
        return 'fail'
    user = User.find_one({}, username=username)
    if user.get('username') is not None:
        return user.get('username')
    else:
        return 'fail'


# 获取所有帖子
@main.route('/topic', methods=['GET'])
def get_all_topic():
    result = Topic.get_all({})
    result.reverse()
    return jsonify(result)


@main.route('/upVote/<int:tid>', methods=['GET'])
def is_upvote(tid):
    username = session.get('username', None)
    user = User.find_one({}, username=username)
    if user is None:
        return 'false'
    else:
        topic = Topic.find_one({}, tid=tid)
        if topic is None:
            return 'false'
        for u in topic['voteUser']:
            if u.get('username') == user.get('username') and u.get('uid') == user.get('uid'):
                return 'true'
        return 'false'


@main.route('/likeStatus/<int:tid>', methods=['GET'])
def like_status(tid):
    username = session.get('username', None)
    user = User.find_one({}, username=username)
    if user is None:
        return 'false'
    else:
        topic = Topic.find_one({}, tid=tid)
        if topic is None:
            return 'false'
        like = []
        dislike = []
        # 遍历该帖所有评论
        for c in topic['comment']:
            # 判断是否有人支持
            if len(c['likes']) < 1:
                like.append(False)
            else:
                # 遍历每一个评论的支持列表
                for l in c['likes']:
                    # 判断该评论的支持列表是否存在当前浏览的用户
                    if l.get('uid') == user.get('uid') and l.get('username') == user.get('username'):
                        like.append(True)
                    else:
                        like.append(False)
            # 判断是否有人反对
            if len(c['dislikes']) < 1:
                dislike.append(False)
            else:
                # 遍历每一个评论的反对列表
                for d in c['dislikes']:
                    # 判断该评论的反对列表是否存在当前浏览的用户
                    if d.get('uid') == user.get('uid') and d.get('username') == user.get('username'):
                        dislike.append(True)
                    else:
                        dislike.append(False)
        status = {
            'like': like,
            'dislike': dislike
        }
        return jsonify(status)