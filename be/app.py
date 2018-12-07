#! /usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Flask
from routes.club import main as club_routes

app = Flask(__name__)
app.register_blueprint(club_routes)

# 运行代码
if __name__ == '__main__':
    # debug 模式可以自动加载你对代码的变动, 所以不用重启程序
    # host 参数指定为 '0.0.0.0' 可以让别的机器访问你的代码
    config = dict(
        debug=True,
        host='0.0.0.0',
        port=2000,
    )
    app.run(**config)
