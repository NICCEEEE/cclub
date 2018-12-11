#! /usr/bin/env python
# -*- coding: utf-8 -*-
from models import Model
import time


class Topic(Model):
    pass


# for i in range(100):
#     t1 = dict(
#         ct=time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()),
#         author='Nicceeee',
#         title=str(i + 1) + '未登录状态下用户的帖子不可见，请问是什么原因？我应该怎么做才能修复呢请老哥们教教我？',
#         content='',
#         board='用户交流',
#         vote=34,
#         comments=33,
#         views=112,
#         last_comment_author='游客1',
#         last_comment_time=time.strftime('%Y年%m月%d日 %H:%M:%S', time.localtime()),
#         last_comment_content='有shopify的插件，不过现在阶段还不是很成熟。我们 qtdream.com 做的效果类似有shopify的插件，不过现在阶段还不是很成熟。我们 qtdream.com 做的效果类似',
#     )
#     Topic.insert_one(**t1)

