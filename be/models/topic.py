#! /usr/bin/env python
# -*- coding: utf-8 -*-
from models import Model
from .user import User
from .notify import Notify
import time
from flask import jsonify


class Topic(Model):
    @classmethod
    def add_topic(cls, user, topic_info):
        # 添加帖子id
        ids = [int(i.get('tid', -1)) for i in Topic.get_all({})]
        if len(ids) < 1:
            tid = 20000
        else:
            max_id = max(ids)
            tid = max_id + 1 if max_id > 0 else 20000
        topic_data = dict(
            ct=topic_info.get('ct', time.time()),
            author=user.get('nickname'),
            title=topic_info.get('title'),
            content=topic_info.get('content'),
            board=topic_info.get('board'),
            vote=0,
            voteUser=[],
            comments=0,
            views=0,
            essence=False,
            last_comment_author=None,
            last_comment_id=None,
            last_comment_time=None,
            last_comment_content=None,
            uid=user.get('uid', -1),
            tid=tid
        )
        user.get('publish_topices').append({
            'tid': topic_data['tid'],
            'title': topic_data['title'],
            'ct': topic_data['ct']
        })
        User.update_one({'uid': user.get('uid')},
                        {'topices': user.get('topices') + 1,
                         'active_time': time.time(),
                         'publish_topices': user.get('publish_topices')})
        res = Topic.insert_one(**topic_data)
        return res

    @classmethod
    def up_vote(cls, user, tid):
        # 获取目标帖子
        topic = Topic.find_one({}, tid=tid)
        if topic is None:
            return 'fail'
        # 判断当前用户是否为该帖点过赞
        for u in topic['voteUser']:
            if u.get('uid') == user.get('uid'):
                return 'exist'
        # 当前用户未点赞则添加点赞用户信息
        topic['voteUser'].append({
            'uid': user.get('uid')
        })
        topic['vote'] += 1
        # 更新点赞用户的统计资料
        User.update_one({'uid': user.get('uid')},
                        {'active_time': time.time(), 'give_votes': user.get('give_votes') + 1})
        # 更新帖子点赞信息
        Topic.update_one({'tid': tid}, {'voteUser': topic['voteUser'], 'vote': topic['vote']})
        # 更新帖主统计信息
        author = User.find_one({}, uid=topic.get('uid'))
        User.update_one({'uid': author.get('uid')}, {'receive_votes': author.get('receive_votes') + 1})
        # 如果点赞用户和帖主不是同一人则发点赞通知
        if user.get('uid') != topic.get('uid'):
            notify = dict(
                title='收到来自用户 ' + user.get('nickname') + ' 的赞 👍',
                receive_id=topic.get('uid'),
                detail=user.get('nickname') + '赞了您的帖子 ——' + '『' + topic.get('title') + '』'
            )
            Notify.send_upvote(**notify)
        return jsonify(user)

    # @classmethod
    # def add_comment(cls, user, tid, form):
    #     topic = Topic.find_one({}, tid=tid)
    #     if topic is None:
    #         return 'fail'
    #     comment_info = form
    #     topic_comment = topic['comment']
    #     topic_comments = topic['comments'] + 1
    #     last_comment_author = user.get('nickname')
    #     last_comment_time = comment_info.get('ct', time.time())
    #     last_comment_content = comment_info.get('content')
    #     comment = dict(
    #         nickname=user.get('nickname'),
    #         uid=user.get('uid'),
    #         content=comment_info.get('content'),
    #         like=0,
    #         likes=[],
    #         dislike=0,
    #         dislikes=[],
    #         ct=comment_info.get('ct', time.time()),
    #         floor=len(topic_comment) + 1,
    #         cid=int(str(tid * 10) + str(topic_comments))
    #     )
    #     topic_comment.append(comment)
    #     User.update_one({'uid': user.get('uid')}, {'replies': user.get('replies') + 1, 'active_time': time.time()})
    #     res = Topic.update_one(
    #         {'tid': tid},
    #         {
    #             'comment': topic_comment,
    #             'comments': topic_comments,
    #             'last_comment_author': last_comment_author,
    #             'last_comment_time': last_comment_time,
    #             'last_comment_content': last_comment_content,
    #             'last_comment_id': user.get('uid'),
    #         }
    #     )
    #     if user.get('uid') != topic.get('uid'):
    #         notify = dict(
    #             title=user.get('nickname') + ' 回复了你的帖子 ——『' + topic.get('title') + '』',
    #             receive_id=topic.get('uid'),
    #             detail=comment_info.get('content')
    #         )
    #         Notify.send_reply(**notify)
    #     return res
