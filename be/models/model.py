#! /usr/bin/env python
# -*- coding: utf-8 -*-
import pymongo

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
        # 通过类来获取表名
        collection = cls.__name__.lower()
        result = club_db[collection].insert_one(kwargs)
        print('插入单条数据成功, 该数据的 _id为：', result.inserted_id)

    # 插入多条数据
    @classmethod
    def insert_all(cls, *args):
        args = list(args)
        # 通过类来获取表名
        collection = cls.__name__.lower()
        result = club_db[collection].insert_many(args)
        print('插入多条数据成功, 其 _id分别为：', '、'.join(result.inserted_id))

    # 标记删除一条符合条件的数据
    @classmethod
    def delete_one(cls, condition):
        # 通过类来获取表名
        collection = cls.__name__.lower()
        delete_tag = {'$set': {'deleted': True}}
        result = club_db[collection].update_one(condition, delete_tag)
        print('匹配', result.matched_count, '条数据, 成功标记删除', result.modified_count, '条数据')

    # 标记删除所有符合条件的数据
    @classmethod
    def delete_all(cls, condition):
        # 通过类来获取表名
        collection = cls.__name__.lower()
        delete_tag = {'$set': {'deleted': True}}
        result = club_db[collection].update_many(condition, delete_tag)
        print('匹配', result.matched_count, '条数据, 成功标记删除', result.modified_count, '条数据')

    # 更新一条符合条件的数据
    @classmethod
    def update_one(cls, condition: dict, new_value: dict):
        # 通过类来获取表名
        collection = cls.__name__.lower()
        value = {'$set': new_value}
        result = club_db[collection].update_one(condition, value)
        print('匹配', result.matched_count, '条数据, 成功更新', result.modified_count, '条数据')

    # 更新所有符合条件的数据
    @classmethod
    def update_all(cls, condition: dict, new_value: dict):
        # 通过类来获取表名
        collection = cls.__name__.lower()
        value = {'$set': new_value}
        result = club_db[collection].update_many(condition, value)
        print('匹配', result.matched_count, '条数据, 成功更新', result.modified_count, '条数据')

    # 查找满足条件的一个数据
    @classmethod
    def find_one(cls, **kwargs):
        # 通过类来获取表名
        collection = cls.__name__.lower()
        result = club_db[collection].find_one(kwargs)
        print('查找到的一条数据为：', result)
        return result

    # 查找所有满足条件的数据
    @classmethod
    def find_all(cls, **kwargs):
        # 通过类来获取表名
        collection = cls.__name__.lower()
        result = club_db[collection].find(kwargs)
        print('查找到的多条数据，分别为：', result)
        return result
