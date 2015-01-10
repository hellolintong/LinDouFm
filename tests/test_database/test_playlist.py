# coding:utf-8
from database.playlist import playlist
from database.music import music_model
from database.channel import channel_model
from tests.test_database.test_music import get_test_music


def test_playlist():

        #添加测试频道
        channel_name = u"test_channel_name"
        channel_uuid = u"mk_test_douban-cid"
        channel = channel_model.add_channel(channel_name, channel_uuid)
        assert len(playlist.get_music_by_channel(channel, 20)) == 0

        #添加测试音乐
        music_information = get_test_music()
        new_music_list = []

        for i in range(20):
            music_information[u"cover"].seek(0)
            music_information[u"audio"].seek(0)
            music_information[u"uuid"] += unicode(i)
            music = music_model.add_music(music_information[u"title"], music_information[u"artist"], music_information[u"album"]
                                          , music_information[u"company"], music_information[u"public_time"], music_information[u"kbps"], music_information[u"cover"], music_information[u"audio"], music_information[u"uuid"])
            new_music_list.append(music.key)

        #往测试频道中添加测试音乐信息
        channel_model.update_channel(channel, music_list=new_music_list)

        channel = channel_model.get_channel(key=channel.key)[0]
        assert len(playlist.get_music_by_channel(channel, 30)) == 20
        assert len(playlist.get_music_by_channel(channel, 20)) == 20
        assert len(playlist.get_music_by_channel(channel, 10)) == 10

        #删除
        channel_model.delete_channel(channel)
        music_list = music_model.get_music(title=music_information[u"title"])
        for music in music_list:
            music_model.delete_music(music)
