#!/usr/bin/env python
# encoding: utf-8
from flask.ext.restful import Resource, fields, marshal_with, marshal

from .base import BaseArgs, FileField, MusicKey
from database.music.music_model import get_music, update_music, delete_music, get_music_status


class MusicQueryArgs(BaseArgs):
    def rules(self):
        self.parser.add_argument('start', type=int)
        self.parser.add_argument('end', type=int)
        self.parser.add_argument('key', type=MusicKey)
        self.parser.add_argument('title', type=unicode)
        self.parser.add_argument('artist', type=unicode)
        self.parser.add_argument('album', type=unicode)
        self.parser.add_argument('company', type=unicode)
        self.parser.add_argument('public_time', type=unicode)
        self.parser.add_argument('kbps', type=unicode)

"""
class MusicPatchArgs(BaseArgs):
    def rules(self):
        self.parser.add_argument('title', type=unicode)
        self.parser.add_argument('artist', type=unicode)
        self.parser.add_argument('album', type=unicode)
        self.parser.add_argument('company', type=unicode)
        self.parser.add_argument('public_time', type=unicode)

"""

music_status_fields = {
    'count': fields.Integer
}

music_fields = {
    'key': fields.String,
    'title': fields.String,
    'artist': fields.String,
    'album': fields.String,
    'company': fields.String,
    'public_time': fields.String,
    'kbps': fields.String,
    'cover': FileField,
    'audio': FileField,
    'upload_date': fields.DateTime,
}


class MusicQueryResource(Resource):
    def get(self):
        args = MusicQueryArgs().args
        if not args:
            return marshal(get_music_status(), music_status_fields)
        return marshal(get_music(**args), music_fields)

"""
class MusicResource(Resource):
    @authenticated('admin')
    @marshal_with(music_fields)
    def patch(self, key):
        args = MusicPatchArgs().args
        music = get_music(key=key)[0]
        update_music(music, **args)
        music = get_music(key=key)[0]
        return music

    @authenticated('admin')
    def delete(self, key):
        music = get_music(key=key)[0]
        delete_music(music)

"""
