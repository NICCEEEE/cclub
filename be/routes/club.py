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
)
from werkzeug.utils import secure_filename
import os
main = Blueprint('club', __name__)


@main.route('/')
def club_index():
    return render_template('index.html')


@main.route('/register', methods=['POST'])
def register():
    form = request.form
    print(form)
