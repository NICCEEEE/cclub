#! /usr/bin/env python
# -*- coding: utf-8 -*-
from datetime import timedelta
from flask import Flask
from routes.club import main as club_routes
from routes.api import main as api_routes
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'c23300e515774a38857c6dddad31766a29819fa53ae46a73ecde79e409e6706adc02f64323ce68972bdb1df' \
                 'd2db17eeeef8e557b227a41a9216e854aed453e64'
app.register_blueprint(club_routes)
app.register_blueprint(api_routes, url_prefix='/api')
cors = CORS(app, origins='*', supports_credentials=True)

# 运行代码
if __name__ == '__main__':
    # debug 模式可以自动加载你对代码的变动, 所以不用重启程序
    # host 参数指定为 '0.0.0.0' 可以让别的机器访问你的代码
    config = dict(
        debug=True,
        host='0.0.0.0',
        port=2000,
    )
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=1)
    app.run(**config)
