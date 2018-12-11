#! /usr/bin/env python
# -*- coding: utf-8 -*-
import pymongo
from random import randint
import hashlib

# 连接mongo数据库
client = pymongo.MongoClient("mongodb://localhost:27017")
print('数据库连接成功')

# 连接或创建mongo数据库中的club表（collection）
club_db = client.club
print('Club表连接成功')


class Model(object):
    # 插入一条数据
    @classmethod
    def insert_one(cls, **kwargs):
        # 通过类来获取表名-
        collection = cls.__name__.lower()
        result = club_db[collection].insert_one(kwargs)
        if result:
            print('插入单条数据成功, 该数据的 _id为：', result.inserted_id)
        else:
            print('插入失败：', kwargs)

    # 插入多条数据
    @classmethod
    def insert_all(cls, *args):
        args = list(args)
        # 通过类来获取表名
        collection = cls.__name__.lower()
        result = club_db[collection].insert_many(args)
        if result:
            print('插入多条数据成功, 其 _id分别为：', '、'.join(result.inserted_id))
        else:
            print('插入失败：', args)
        return result

    # 标记删除一条符合条件的数据
    @classmethod
    def delete_one(cls, condition):
        # 通过类来获取表名
        collection = cls.__name__.lower()
        delete_tag = {'$set': {'deleted': True}}
        result = club_db[collection].update_one(condition, delete_tag)
        if result:
            print('匹配', result.matched_count, '条数据, 成功标记删除', result.modified_count, '条数据')
        else:
            print('未查找到匹配数据：', condition)
        return result

    # 标记删除所有符合条件的数据
    @classmethod
    def delete_all(cls, condition):
        # 通过类来获取表名
        collection = cls.__name__.lower()
        delete_tag = {'$set': {'deleted': True}}
        result = club_db[collection].update_many(condition, delete_tag)
        if result:
            print('匹配', result.matched_count, '条数据, 成功标记删除', result.modified_count, '条数据')
        else:
            print('未查找到匹配数据：', condition)
        return result

    # 更新一条符合条件的数据
    @classmethod
    def update_one(cls, condition: dict, new_value: dict):
        # 通过类来获取表名
        collection = cls.__name__.lower()
        value = {'$set': new_value}
        result = club_db[collection].update_one(condition, value)
        if result:
            print('匹配', result.matched_count, '条数据, 成功更新', result.modified_count, '条数据')
        else:
            print('未查找到匹配数据：', condition)
        return result

    # 更新所有符合条件的数据
    @classmethod
    def update_all(cls, condition: dict, new_value: dict):
        # 通过类来获取表名
        collection = cls.__name__.lower()
        value = {'$set': new_value}
        result = club_db[collection].update_many(condition, value)
        if result:
            print('匹配', result.matched_count, '条数据, 成功更新', result.modified_count, '条数据')
        else:
            print('未查找到匹配数据：', condition)
        return result

    # 查找满足条件的一个数据
    @classmethod
    def find_one(cls, **kwargs):
        # 通过类来获取表名
        collection = cls.__name__.lower()
        result = club_db[collection].find_one(kwargs)
        print('查找到的一条数据为：', result) if result else print('数据查找不存在：', kwargs)
        return result

    # 查找所有满足条件的数据
    @classmethod
    def find_all(cls, obj_id=False, **kwargs):
        # 通过类来获取表名
        collection = cls.__name__.lower()
        if obj_id is True:
            result = club_db[collection].find(kwargs)
        else:
            # 此处表示不提取_id字段 格式为 字段名：1/0   1表示提取 0表示不提取， _id默认为1
            result = club_db[collection].find(kwargs, {'_id': 0})
        if result is None:
            print('数据查找不存在：', kwargs)
            return None
        else:
            print('查找到的多条数据，分别为：', result)
            result = list(result)
        return result

    # 获取目标集合中的所有数据
    @classmethod
    def get_all(cls, obj_id=False):
        collection = cls.__name__.lower()
        if obj_id is True:
            result = club_db[collection].find()
        else:
            # 此处表示不提取_id字段 格式为 字段名：1/0   1表示提取 0表示不提取， _id默认为1，前面的{}表示提取所有的数据
            result = club_db[collection].find({}, {'_id': 0})
        if result is None:
            print(collection, '表无数据')
            return None
        else:
            result = list(result)
            print('获取', collection, '表的所有数据共', len(result), '条')
        return result


# 生成验证码库
codeword = {}
for i in range(0, 300):
    n1 = randint(1, 10)
    n2 = randint(1, 10)
    n3 = randint(1, 10)
    o1 = '+-*'[randint(0, 2)]
    o2 = '+-*'[randint(0, 2)]
    problem = '{} {} {} {} {}'.format(n1, o1, n2, o2, n3)
    salt = '89sdfn^%^#sdmlks' + str(i)
    key = hashlib.md5(salt.encode('ascii')).hexdigest()
    codeword[key] = problem

