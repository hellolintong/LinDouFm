# coding:utf-8
from database.music import music_model
import tempfile


def get_test_music():
    cover = tempfile.TemporaryFile()
    cover.write(u"test_cover")
    cover.seek(0)
    audio = tempfile.TemporaryFile()
    audio.write(u"test_audio")
    audio.seek(0)

    music_information = {
        u"title": u"test_music_title",
        u"artist": u"test_music_artist",
        u"album": u"test_music_album",
        u"company": u"test_music_company",
        u"public_time": u"2013",
        u"kbps": u"64",
        u"uuid": u"test_douban-uuid",
        u"cover": cover,
        u"audio": audio,
    }
    return music_information


def equal_check(music, music_information):
    assert music.title == music_information[u"title"]
    assert music.album == music_information[u"album"]
    assert music.company == music_information[u"company"]
    assert music.artist == music_information[u"artist"]
    assert music.public_time == music_information[u"public_time"]
    assert music.uuid == music_information[u"uuid"]
    music_information[u"cover"].seek(0)
    music_information[u"audio"].seek(0)
    assert music.cover.read() == music_information[u"cover"].read()
    assert music.audio.read() == music_information[u"audio"].read()


def test_music():
    music_information = get_test_music()
    #测试添加音乐
    music = music_model.add_music(music_information[u"title"], music_information[u"artist"], music_information[u"album"]
                                  , music_information[u"company"], music_information[u"public_time"], music_information[u"kbps"], music_information[u"cover"], music_information[u"audio"], music_information[u"uuid"])

    equal_check(music, music_information)

    #测试获取音乐
    music = music_model.get_music(uuid=music_information[u"uuid"])[0]
    equal_check(music, music_information)

    #测试更新音乐
    music_information[u"title"] = u"update_test_music_title"
    music_model.update_music(music, title=music_information[u"title"])
    music = music_model.get_music(uuid=music_information[u"uuid"])[0]
    equal_check(music, music_information)

    #测试删除音乐
    music_model.delete_music(music)
    music = music_model.get_music(uuid=music_information[u"uuid"])
    assert not music









