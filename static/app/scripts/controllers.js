/*
 *    module
 */
var fmApp = angular.module('FMApp', []);

/*
 *   主界面控制器
 */
fmApp.controller("FMCtrl", function FMCtrl($scope, PlayListService, ActivePlayListService, UserHistoryService, UserMusicService, MusicService, UserService) {

    //musicPlayer
    var Player = (function () {

        /* return object*/
        var PlayerObj = {};
        var PlayListObj = {
            playList: [],//频道列表
            musicNumber: 10,//每次请求的音乐数量
            index: 0, //当前频道的索引（如果属于喜欢或者听过的频道列表，则置为-1）
            setIndex: function(index){
                this.index = index;
            },
            getCurList: function(){
                if(this.index < 0){
                    alert("第22行出现bug");
                }
                return this.playList[this.index];
            },
            setIndexByKey: function(key){
                for(var i = 0; i < this.playList.length; ++i){
                    if(this.playList[i].key == key){
                        this.index = i;
                        return;
                    }
                }
                alert("第33行出现bug");
            },
            isNormalList: function(){
                return this.index >= 0;
            }

        };
        var MusicsObj = {
            musics: [],
            favorMusics: [],
            listenedMusics: [],
            musicIndex: 0,//当前播放列表中的音乐索引

            //判断列表中的音乐是否播放完毕
            isFinish: function(){

                if(this.musicIndex == this.musics.length){
                    return true;
                }
                return false;
            },

            //设置音乐列表信息
            setMusics: function(data){
                this.musicIndex = 0;
                this.musics = data;
            },

            //设置喜欢的音乐
            setFavorMusics: function(data){
                this.favorMusics = data;
            },

            //设置听过的音乐
            setListenedMusics: function(data){
                this.listenedMusics = data;
            },

            setIndexByKey: function(key){
                for(var i = 0; i < this.musics.length; ++i){
                    if(this.musics[i].key == key){
                        this.musicIndex = i;
                        return;
                    }
                }
            },

            setMusicsToFavor: function(){

                this.musics = this.favorMusics.slice();

                this.musicIndex = 0;
            },

            setMusicsToListened: function(){
                this.musics = this.listenedMusics.slice();
                this.musicIndex = 0;
            },

            //取得当前音乐
            getCurMusic: function(){
                return this.musics[this.musicIndex];
            },
            //判断当前音乐是否是用户喜欢的音乐
            isFavorMusic: function(){
                var music = this.getCurMusic();
                for (var i = 0; i < this.favorMusics.length; ++i) {
                    if (music.key == this.favorMusics[i].key) {
                        return true;
                    }
                }
                return false;
            },
            //更新用户喜欢的音乐
            updateFavorMusic: function(){
                var music = this.getCurMusic();
                for (var i = 0; i < this.favorMusics.length; ++i) {
                    if (music.key == this.favorMusics[i].key) {
                        this.favorMusics.splice(i, 1);
                        return;
                    }
                }
                this.favorMusics.push(music);
            },

            updateListenedMusic: function(){
                var music = this.getCurMusic();
                this.listenedMusics.push(music);
            },

            setMusicIndex: function(index){
                this.musicIndex = index;
            },

            addMusicIndex: function(){
                this.musicIndex += 1;
            }
        };

        $scope.setPlayList = function(){
            $scope.playList = PlayListObj.playList;
        };

        $scope.setNormalMusics = function(){
            $scope.musics = MusicsObj.musics;
        };

        $scope.setSpecialMusics = function(){
            if(MusicsObj.musicIndex % PlayListObj.musicNumber == 0){
                $scope.musics = MusicsObj.musics.slice(MusicsObj.musicIndex, MusicsObj.musicIndex + PlayListObj.musicNumber);
            }
        };

        PlayerObj.init = function (funcR, funcE) {
            // console.log('init');
            new jPlayerPlaylist({
                    jPlayer: "#jquery_jplayer_1",
                    cssSelectorAncestor: "#jp_container_1"
                },
                [],
                {
                    ready: funcR,
                    ended: funcE,
                    swfPath: "/static/app/vender/jPlayer/js",
                    supplied: "mp3",
                    wmode: "window",
                    smoothPlayBar: true,
                    keyEnabled: true
                });

            //复制分享信息到剪切板
            $('#jp-shared').zclip({
                path: '/static/app/vender/ZeroClipboard.swf',
                copy: function () {
                    return $scope.shareMsg.replace(/\<br \/\>/g, '\r\n');
                },
                afterCopy: function () {
                    $('#share').modal('hide');
                }
            });

            //将player与Angular事件绑定
            bindEvent();
        };

        //播放下一曲
        PlayerObj.nextMusic = function () {
            MusicsObj.addMusicIndex();

            if (MusicsObj.isFinish() == true) {
                MusicsObj.setMusicIndex(0);
                if(PlayListObj.isNormalList()){//如果普通的播放列表，则继续请求音乐，否则循环播放
                    PlayerObj.playerReady();
                }
                else{
                    $scope.setSpecialMusics();
                    playMusic(MusicsObj.getCurMusic());//是喜欢的或者听过的音乐，则循环播放
                }
            } else {
                if(PlayListObj.isNormalList() == false){
                    $scope.setSpecialMusics();
                }
                playMusic(MusicsObj.getCurMusic());//播放下一曲
            }


        };

        //准备播放
        PlayerObj.playerReady = function () {
            PlayListService.getArgs["num"] = PlayListObj.musicNumber;
            var curList = PlayListObj.getCurList();
            PlayListService.addUrlArg(curList.key);

            PlayListService.get(
                function (data, status, headers, config) {
                    MusicsObj.setMusics(data);
                    $scope.setNormalMusics();
                    playMusic(MusicsObj.getCurMusic());
                },
                function (data, status, headers, config) {
                }
            );
        };

        /* private function*/
        //播放歌曲，musicObj为歌曲对象
        function playMusic(musicObj) {
            $scope.showFavor = MusicsObj.isFavorMusic();

            var currentUrl = window.location.host;
            $scope.shareMsg = '很好听的一首歌，快来听吧!<br />' + musicObj.artist + '--' + musicObj.title + "<br />http://" + currentUrl + '/#key=' + musicObj.key;
            $('#shareMsg').html($scope.shareMsg);
            $("#jquery_jplayer_1").jPlayer("setMedia", {mp3: musicObj.audio}).jPlayer("load").jPlayer("play");
            $("#jp-cover img").attr("src", musicObj.cover);
            $("#jp-singer").html(musicObj.artist);
            $("#nameAlbum").html(musicObj.title + '     ' + musicObj.album);
        }

        //获取用户相关的音乐
        $scope.getUserMusic = function (type, playFlag) {
            UserMusicService.getArgs["type"] = type;
            UserMusicService.get(
                function (data, status, headers, config) {
                        if(type == "favor"){
                            MusicsObj.setFavorMusics(data);
                            if(playFlag){
                                PlayerObj.playFavor();
                            }
                        }
                        else if (type = "listened"){
                            MusicsObj.setListenedMusics(data);
                            if(playFlag){
                                PlayerObj.playListened();
                            }
                        }
                },
                function (data, status, headers, config) {

                }
            );
        };


        //初始化播放列表
        PlayerObj.listInit = function () {
            $scope.getUserMusic("favor", false);
            $scope.getUserMusic("listened", false);

            ActivePlayListService.get(
                function (data, status, headers, config) {
                    PlayListObj.playList = data;
                    $scope.setPlayList();
                    PlayListObj.index = 0;
                    $scope.currentChannel = data[0].name;
                    PlayerObj.init(PlayerObj.playerReady, PlayerObj.playerEnded);
                },
                function (data, status, headers, config) {

                }
            );

        };

        //分享歌曲准备播放
        PlayerObj.shareReady = function (shareKey) {
            // console.log(shareKey);
            //根据分享可取key获取歌曲对象
            MusicService.getArgs["key"] = shareKey;
            MusicService.get(
                function (data, status, headers, config) {
                    playMusic(data[0]);
                },
                function (data, status, headers, config) {
                }
            );

            $('#recentTenSongs').css('display', 'none');
            $('#gn-menu li:first-child').css('display', 'none');
            var homeUrl = 'http://' + window.location.host;
            // console.log(homeUrl);
            $('#currentChannel').html('<a href="' + homeUrl + '">去主页瞧瞧~</a>').css('padding-left', '145px');
        };


        //分享歌曲播放完毕，弹出提示框
        PlayerObj.shareEnded = function () {
            console.log('scope');
            $('#shareEnd').modal('show');
        };


        //当前音乐播放完毕
        PlayerObj.playerEnded = function () {
            //如果index 为-1则表示当前播放喜欢或者听过的音乐，则不需要发送数据信息
            if (PlayListObj.isNormalList()) {
                MusicsObj.updateListenedMusic();
                var curMusic = MusicsObj.getCurMusic();
                $scope.postHistory("listened", curMusic.key);
            }
            PlayerObj.nextMusic();
        };

        //播放喜欢音乐
        PlayerObj.playFavor = function(){
            if(MusicsObj.favorMusics.length != 0){
                PlayListObj.setIndex(-1);
                MusicsObj.setMusicsToFavor();
                $scope.currentChannel = "喜欢的音乐";
                $scope.setSpecialMusics();
                playMusic(MusicsObj.getCurMusic());
            }
        };

        //播放听过的音乐
        PlayerObj.playListened = function(){
            if(MusicsObj.listenedMusics.length != 0){
                PlayListObj.setIndex(-1);
                MusicsObj.setMusicsToListened();
                $scope.currentChannel = "听过的音乐";
                $scope.setSpecialMusics();
                playMusic(MusicsObj.getCurMusic());
            }
        };

        function bindEvent() {

            $scope.loginClick = function () {
                UserService.login();
            };

            $scope.logoutClick = function () {
                UserService.logout();
            };

            //发送history数据
            $scope.postHistory = function (type, musicKey) {
                UserHistoryService.postArgs["op"] = type;
                UserHistoryService.postArgs["key"] = musicKey;
                UserHistoryService.post(function (data, status, headers, config) {
                }, function (data, status, headers, config) {
                });
            };

            //点击下一曲歌曲
            $scope.clickNext = function () {
                PlayerObj.nextMusic();
            };


            //点击封面
            $scope.clickCover = function (key) {
                MusicsObj.setIndexByKey(key);
                playMusic(MusicsObj.getCurMusic());
            };


            //点击频道
            $scope.clickList = function (key) {
                PlayListObj.setIndexByKey(key);
                var list = PlayListObj.getCurList();
                $scope.currentChannel = list.name;
                PlayerObj.playerReady();
            };

            //点击收藏列表
            $scope.clickFavorList = function () {
                $scope.getUserMusic("favor",true);
            };

            //点击听过的音乐列表
            $scope.clickListenedList = function () {
                $scope.getUserMusic("listened", true);
            };

            //点击不喜欢按钮
            $scope.dislike = function () {
                var music = MusicsObj.getCurMusic();
                $scope.postHistory("dislike", music.key);
                PlayerObj.nextMusic();
            };

            //点击喜欢按钮
            $scope.like = function () {

                MusicsObj.updateFavorMusic();
                $scope.showFavor = MusicsObj.isFavorMusic();
                var music = MusicsObj.getCurMusic();
                $scope.postHistory("favor", music.key);
            }


        }

        return PlayerObj;
    })();

    //DOM ready
    angular.element(document).ready(function () {
        //分析当前url判断是首次进入或者是点击分享链接进入（分享链接进入会传入参数key）
        (function analysisUrl() {
            //获取当前url中传入参数key，若为空则播放器进入正常初始化；
            //否则，进入分享模式初始化（当前暂时只有一个参数）。

            $scope.showFavor = false;
            $scope.playList = [];
            $scope.musics = [];

            var url = window.location.href;
            var shareKey = url.split('=')[1];
            if (shareKey === undefined) {
                Player.listInit();
            } else {
                Player.init(Player.shareReady(shareKey), Player.shareEnded);
            }
        })();

        $('ul.thumb li').Zoomer({speedView: 200, speedRemove: 400, altAnim: true, speedTitle: 400, debug: false});
    });
});
