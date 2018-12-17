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
    user = User.find_one({}, username=username)
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
        return 'fail'
    username = user.get('username')
    topic_info = request.form
    # 添加帖子id
    ids = [int(i.get('tid', -1)) for i in Topic.get_all({})]
    if len(ids) < 1:
        tid = 20000
    else:
        max_id = max(ids)
        tid = max_id + 1 if max_id > 0 else 20000
    topic_data = dict(
        ct=topic_info.get('ct', time.time()),
        author=username,
        title=topic_info.get('title'),
        content=topic_info.get('content'),
        board=topic_info.get('board'),
        vote=0,
        voteUser=[],
        comment=[],
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


@main.route('/topic/<int:tid>')
def get_topic(tid):
    topic = Topic.find_one({}, tid=tid)
    if topic is None:
        return render_template('index.html')
    else:
        Topic.update_one({"tid": tid}, {'views': topic.get('views') + 1})
        topic['views'] += 1
        return jsonify(topic)


@main.route('/upvote/<int:tid>')
def up_vote(tid):
    user = current_user()
    if user is None:
        return 'fail'
    else:
        topic = Topic.find_one({}, tid=tid)
        if topic is None:
            return 'fail'
        for u in topic['voteUser']:
            if u.get('username') == user.get('username') and u.get('uid') == user.get('uid'):
                return 'exist'
        topic['voteUser'].append({
            'username': user.get('username'),
            'uid': user.get('uid')
        })
        topic['vote'] += 1
        Topic.update_one({'tid': tid}, {'voteUser': topic['voteUser'], 'vote': topic['vote']})
        return jsonify(user)


@main.route('/addComment/<int:tid>', methods=['POST'])
def add_comment(tid):
    user = current_user()
    if user is None:
        return 'fail'
    topic = Topic.find_one({}, tid=tid)
    if topic is None:
        return 'fail'
    comment_info = request.form
    topic_comment = topic['comment']
    topic_comments = topic['comments'] + 1
    last_comment_author = user.get('username')
    last_comment_time = comment_info.get('ct', time.time())
    last_comment_content = comment_info.get('content')
    comment = dict(
        username=user.get('username'),
        uid=user.get('uid'),
        content=comment_info.get('content'),
        like=0,
        likes=[],
        dislike=0,
        dislikes=[],
        ct=comment_info.get('ct', time.time()),
        floor=len(topic_comment) + 1,
        cid=int(str(tid * 10) + str(topic_comments))
    )
    topic_comment.append(comment)
    res = Topic.update_one(
        {'tid': tid},
        {
            'comment': topic_comment,
            'comments': topic_comments,
            'last_comment_author': last_comment_author,
            'last_comment_time': last_comment_time,
            'last_comment_content': last_comment_content
        }
    )
    if res is None:
        return 'fail'
    else:
        return 'success'


@main.route('/likeCom/<int:cid>')
def like_comment(cid):
    user = current_user()
    if user is None:
        return 'not login'
    tid = int(str(cid)[:5])
    topic = Topic.find_one({}, tid=tid)
    if topic is None:
        return 'fail'
    topic_comment = topic.get('comment')
    # 遍历所有评论
    for c in topic_comment:
        # 定位目标评论
        if c.get('cid') == cid:
            # 判断当前用户是否点了反对
            for u in c.get('dislikes'):
                if u.get('uid') == user.get('uid') and u.get('username') == user.get('username'):
                    # 判断为真，清除当前用户的反对，同时反对数减一
                    c['dislike'] -= 1
                    del c['dislikes'][c['dislikes'].index(u)]
                    Topic.update_one({'tid': tid}, {'comment': topic_comment})
                    break
            # 判断当前用户是否点了支持
            for u in c.get('likes'):
                if u.get('uid') == user.get('uid') and u.get('username') == user.get('username'):
                    # 判断为真，则返回已点支持
                    return 'exist'
            # 否则支持数加一，同时增加当前用户的支持信息
            c['like'] += 1
            c['likes'].append(
                {
                    'username': user.get('username'),
                    'uid': user.get('uid')
                }
            )
            Topic.update_one({'tid': tid}, {'comment': topic_comment})
            return 'success'
    return 'fail'


@main.route('/dislikeCom/<int:cid>')
def dislike_comment(cid):
    user = current_user()
    if user is None:
        return 'not login'
    tid = int(str(cid)[:5])
    topic = Topic.find_one({}, tid=tid)
    if topic is None:
        return 'fail'
    topic_comment = topic.get('comment')
    # 遍历所有评论
    for c in topic_comment:
        # 定位目标评论
        if c.get('cid') == cid:
            # 判断当前用户是否点了支持
            for u in c.get('likes'):
                if u.get('uid') == user.get('uid') and u.get('username') == user.get('username'):
                    # 判断为真，清除当前用户的反对，同时反对数减一
                    c['like'] -= 1
                    del c['likes'][c['likes'].index(u)]
                    Topic.update_one({'tid': tid}, {'comment': topic_comment})
                    break
            # 判断当前用户是否点了反对
            for u in c.get('dislikes'):
                if u.get('uid') == user.get('uid') and u.get('username') == user.get('username'):
                    # 判断为真，则返回已点反对
                    return 'exist'
            # 否则支持数加一，同时增加当前用户的支持信息
            c['dislike'] += 1
            c['dislikes'].append(
                {
                    'username': user.get('username'),
                    'uid': user.get('uid')
                }
            )
            Topic.update_one({'tid': tid}, {'comment': topic_comment})
            return 'success'
    return 'fail'

