#! /usr/bin/env python
# -*- coding: utf-8 -*-
from models import Model
from .user import User
from .notify import Notify
from .topic import Topic
import time
from flask import jsonify


class Comment(Model):
    @staticmethod
    def get_cid():
        res = Comment.get_all({})
        ids = [int(i.get('cid', -1)) for i in res]
        if len(ids) < 1:
            cid = 40000
        else:
            max_id = max(ids)
            cid = max_id + 1 if max_id > 0 else 40000
        return cid

    @classmethod
    def add_comment(cls, user, tid, form):
        # 获取目标帖子id
        topic = Topic.find_one({}, tid=tid)
        if topic is None:
            return 'fail'
        # 创建评论
        comment_info = form
        topic_comments = topic['comments'] + 1
        last_comment_author = user.get('nickname')
        last_comment_time = comment_info.get('ct', time.time())
        last_comment_content = comment_info.get('content')
        comment = dict(
            nickname=user.get('nickname'),
            uid=user.get('uid'),
            content=comment_info.get('content'),
            like=0,
            likes=[],
            dislike=0,
            dislikes=[],
            ct=comment_info.get('ct', time.time()),
            floor=topic_comments,
            cid=Comment.get_cid(),
            tid=tid
        )
        # 生成评论
        Comment.insert_one(**comment)
        # 更新评论者信息
        User.update_one({'uid': user.get('uid')}, {'replies': user.get('replies') + 1, 'active_time': time.time()})
        # 更新目标帖信息
        res = Topic.update_one(
            {'tid': tid},
            {
                'comments': topic_comments,
                'last_comment_author': last_comment_author,
                'last_comment_time': last_comment_time,
                'last_comment_content': last_comment_content,
                'last_comment_id': user.get('uid'),
            }
        )
        # 如果评论者和发帖者不为同一人则发回帖通知
        if user.get('uid') != topic.get('uid'):
            notify = dict(
                title=user.get('nickname') + ' 回复了你的帖子 ——『' + topic.get('title') + '』',
                receive_id=topic.get('uid'),
                detail=comment_info.get('content')
            )
            Notify.send_reply(**notify)
        return res