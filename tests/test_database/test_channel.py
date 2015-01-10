# coding:utf-8
from database.channel import channel_model


def test_channel():
    channel_name = u"测试频道"
    channel_uuid = u"test_channel"

    #测试添加
    channel = channel_model.add_channel(channel_name, channel_uuid)
    assert channel.name == channel_name and channel_uuid == channel.uuid

    #测试获取
    channel = channel_model.get_channel(name=channel_name)[0]
    assert channel.name == channel_name and channel.uuid == channel.uuid

    #测试更新
    update_channel_name = u"更新测试频道"
    channel_model.update_channel(channel, name=update_channel_name)
    channel = channel_model.get_channel(uuid=channel_uuid)[0]
    assert channel.name == update_channel_name

    #测试删除
    channel_model.delete_channel(channel)
    channel = channel_model.get_channel(uuid=channel_uuid)
    assert not channel








