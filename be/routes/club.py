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
from models.comment import Comment
import time
import os
from random import randint

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
    # 判断访问方法
    method = request.method
    if method == 'GET':
        return render_template('index.html')
    # 获取登录信息
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
    res = Topic.add_topic(user, request.form)
    if res is not None:
        return 'success'
    else:
        return 'fail'


@main.route('/topic/<int:tid>')
def get_topic(tid):
    user = current_user()
    if user is not None:
        User.update_one({'uid': user.get('uid')}, {'active_time': time.time(), 'views': user.get('views') + 1})
    topic = Topic.find_one({}, tid=tid)
    if topic is None:
        return render_template('index.html')
    else:
        Topic.update_one({"tid": tid}, {'views': topic.get('views') + 1})
        return jsonify(topic)


@main.route('/upvote/<int:tid>')
def up_vote(tid):
    user = current_user()
    if user is None:
        return 'fail'
    else:
        res = Topic.up_vote(user, tid)
        if res in ['fail', 'exist']:
            return res
        else:
            return 'success'


@main.route('/addComment/<int:tid>', methods=['POST'])
def add_comment(tid):
    user = current_user()
    if user is None:
        return 'fail'
    res = Comment.add_comment(user, tid, request.form)
    if res is None:
        return 'fail'
    else:
        return 'success'


@main.route('/likeCom/<int:cid>')
def like_comment(cid):
    user = current_user()
    if user is None:
        return 'not login'
    comment = Comment.find_one({}, cid=cid)
    if comment is None:
        return 'fail'
    else:
        # 判断当前用户是否点了反对
        for u in comment.get('dislikes'):
            if u.get('uid') == user.get('uid'):
                # 判断为真，清除当前用户的反对，同时反对数减一
                comment['dislike'] -= 1
                del comment['dislikes'][comment['dislikes'].index(u)]
                break
        # 判断当前用户是否点了支持
        for u in comment.get('likes'):
            if u.get('uid') == user.get('uid'):
                # 判断为真，则返回已点支持
                return 'exist'
        # 否则支持数加一，同时增加当前用户的支持信息
        comment['like'] += 1
        comment['likes'].append(
            {
                'uid': user.get('uid')
            }
        )
        # 更新目标评论点赞信息
        Comment.update_one({'cid': cid},
                           {'dislike': comment['dislike'], 'dislikes': comment['dislikes'], 'like': comment['like'],
                            'likes': comment['likes']})
        # 更新点赞用户统计信息
        User.update_one({'uid': user.get('uid')},
                        {'active_time': time.time(), 'give_votes': user.get('give_votes') + 1})
        return 'success'


@main.route('/dislikeCom/<int:cid>')
def dislike_comment(cid):
    user = current_user()
    if user is None:
        return 'not login'
    comment = Comment.find_one({}, cid=cid)
    if comment is None:
        return 'fail'
    else:
        # 判断当前用户是否点了赞同
        for u in comment.get('likes'):
            if u.get('uid') == user.get('uid'):
                # 判断为真，清除当前用户的赞同，同时赞同数减一
                comment['like'] -= 1
                del comment['likes'][comment['likes'].index(u)]
                break
        # 判断当前用户是否点了反对
        for u in comment.get('dislikes'):
            if u.get('uid') == user.get('uid'):
                # 判断为真，则返回已点反对
                return 'exist'
        # 否则反对数加一
        comment['dislike'] += 1
        comment['dislikes'].append(
            {
                'uid': user.get('uid')
            }
        )
        # 更新目标评论点赞信息
        Comment.update_one({'cid': cid},
                           {'dislike': comment['dislike'], 'dislikes': comment['dislikes'], 'like': comment['like'],
                            'likes': comment['likes']})
        return 'success'


@main.route('/my-summary')
def get_my_summary():
    user = current_user()
    if user is None:
        return 'false'
    else:
        res = User.get_my_summary(user)
        return res


@main.route('/user-summary')
def get_user_summary():
    user_info = request.args
    res = User.get_user_summary(user_info)
    if res is None:
        return 'false'
    else:
        return jsonify(res)


@main.route('/save-profile', methods=['POST'])
def save_profile():
    user = current_user()
    if user is None:
        return 'fail'
    else:
        res = User.save_profile(user, request.form)
        if res is not None:
            return 'success'


@main.route('/notification')
def get_my_notification():
    user = current_user()
    if user is None:
        return 'fail'
    else:
        res = User.get_notify(user)
        return res


# @main.route('/upload-head', methods=['POST'])
# def add_img():
#     user = current_user()
#     if user is None:
#         return redirect(render_template('index.html'))
#     file = request.files.get('avatar')
#     if file is None:
#         return redirect(render_template('index.html'))
#     filetype = file.filename.split('.')[-1]
#     if filetype not in ['jpg', 'jpeg', 'png']:
#         return redirect(render_template('index.html'))
#     filename = secure_filename(file.filename)
#     u = User.find_one({}, uid=user.get('uid'))
#     if u is None:
#         return redirect(render_template('index.html'))
#     filename = str(u.get('uid')) + filename
#     u['avatar'] = filename
#     User.update_one({'uid': user.get('uid')}, {'avatar': u['avatar']})
#     file.save(os.path.join('/Users/nice/Documents/cclub/fe/src/assets/images/avatar', filename))
#     return 'success'
@main.route('/upload-head', methods=['POST'])
def add_img():
    # user = current_user()
    # if user is None:
    #     return redirect(render_template('index.html'))
    user = {'uid': 10007}
    file = request.files.get('avatar')
    if file is None:
        return redirect(render_template('index.html'))
    filetype = file.filename.split('.')[-1]
    if filetype not in ['jpg', 'jpeg', 'png']:
        return redirect(render_template('index.html'))
    filename = secure_filename(file.filename)
    u = User.find_one({}, uid=user.get('uid'))
    if u is None:
        return redirect(render_template('index.html'))
    filename = str(u.get('uid')) + filename
    u['avatar'] = filename
    # User.update_one({'uid': user.get('uid')}, {'avatar': u['avatar']})
    # file.save(os.path.join('/Users/nice/Documents/cclub/fe/src/assets/images/avatar', filename))
    return 'success'


@main.route('/avatar', methods=['GET'])
def get_avatar():
    user = current_user()
    if user is None:
        return 'fail'
    avatar = user.get('avatar')
    if avatar is None:
        return send_from_directory('/Users/nice/Documents/cclub/fe/src/assets/images/avatar', 'default1.png')
    else:
        return send_from_directory('/Users/nice/Documents/cclub/fe/src/assets/images/avatar', avatar)


@main.route('/avatar_by_id/<int:uid>', methods=['GET'])
def get_avatar_by_id(uid):
    user = User.find_one({}, uid=uid)
    if user is None:
        return 'fail'
    else:
        avatar = user.get('avatar')
        if avatar is None:
            return send_from_directory('/Users/nice/Documents/cclub/fe/src/assets/images/avatar', 'default1.png')
        else:
            return send_from_directory('/Users/nice/Documents/cclub/fe/src/assets/images/avatar', avatar)
