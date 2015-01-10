<<<<<<< HEAD
/**
 *
 * 因为调用地址和调用参数需要在使用的时候指定，所以作为对象的成员变量，而整个http通信过程可以做成一个统一的函数，所以写成了原型的函数
 *
 */
function HttpService() {
    this.url = "";
    this.getArgs = {};
    this.postArgs = {};
    this.get = function (successCallback, errorCallback) {
        this._get(this.url, this.getArgs, successCallback, errorCallback);
    }
    this.post = function (successCallback, errorCallback) {
        this._post(this.url, this.postArgs, successCallback, errorCallback);
    }
}

HttpService.prototype.$http = null;
HttpService.prototype._get = function (url, params, successCallback, errorCallback) {
    this.$http({method: "GET", url: url, params: params})
        .success(function (data, status, headers, config) {
            successCallback(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
            errorCallback(data, status, headers, config);
        });
};

HttpService.prototype._post = function (url, data, successCallback, errorCallback) {
    this.$http({method: "POST", url: url, data: data})
        .success(function (data, status, headers, config) {
            successCallback(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
            errorCallback(data, status, headers, config);
        });
}


/*
 * 用户相关
 */

fmApp.factory("UserService", function ($http) {
    var userObj = {};
    userObj.login = function () {

        $("#login").css("display", "none");
        $("#login_process").css("display", "block");

        $http({method: "GET", url: "/api/oauth/request/"})
            .success(function (data, status, headers, config) {
                window.location.href = data.authorize_url;
            })
            .error(function (data, status, headers, config) {
                $("#login").css("display", "block");
                $("#login_process").css("display", "none");
            });
    }
    userObj.logout = function () {
        $("#logout_process").css("display", "block");
        $("#username").css("display", "none");
        $("#logout").css("display", "none");


        $http({method: "GET", url: "/api/user/logout/"})
            .success(function (data, status, headers, config) {
                window.location.reload(true);
            })
            .error(function (data, status, headers, config) {
                $("#logout_process").css("display", "none");
                $("#username").css("display", "block");
                $("#logout").css("display", "block");
            });
    }
    return userObj;
});
/*
 *用户相关音乐
 */

fmApp.factory("UserMusicService", function ($http) {
    var userMusciObj = new HttpService();
    userMusciObj.url = "/api/user/music/";
    userMusciObj.getArgs = {type: "favor", start: 0, end: -1};
    userMusciObj.$http = $http;
    return userMusciObj;
});


/*
 *用户历史记录
 */
fmApp.factory("UserHistoryService", function ($http) {
    var userHistoryObj = new HttpService();
    userHistoryObj.$http = $http;
    userHistoryObj.url = "/api/user/history/";
    userHistoryObj.getArgs = {start: 0, end: -1};
    userHistoryObj.postArgs = {op: "favor", key: ""};
    return userHistoryObj;
});


/*
 *	查询指定播放列表
 */

fmApp.factory("PlayListService", function ($http) {
    var playListObj = new HttpService();
    playListObj.$http = $http;
    playListObj.url = "";
    playListObj.getArgs = {num: 10};
    playListObj.addUrlArg = function (urlArg) {
        playListObj.url = "/api/playlist/" + urlArg + "/";
    }
    return playListObj;
});

/*
 * 获取所有可播放列表
 */
fmApp.factory("ActivePlayListService", function ($http) {
    var activePlayListObj = new HttpService();
    activePlayListObj.$http = $http;
    activePlayListObj.url = "/api/playlist/";
    return activePlayListObj;
});


/*
 * 查询频道信息（频道与播放列表的区别在于:播放列表是可播放的频道)
 */
fmApp.factory("ChannelService", function ($http) {
    var channelObj = new HttpService();
    channelObj.$http = $http;
    channelObj.url = "/api/channel/";
    return channelObj;
});

/*
 *	音乐查询
 */
fmApp.factory("MusicService", function ($http) {
    var musicObj = new HttpService();
    musicObj.$http = $http;
    musicObj.url = "/api/music/";
    return musicObj;
});

=======

/*
*	user services
*/
fmApp.factory('User', ['$resource', 
	function($resource) {
		return $resource('/api/user/:arg',
			{arg: '@arg'},
			{
				query: {method: 'get', isArray: true},
			 	login: {method: 'post', isArray: false}
			 	// register: {method: 'post', isArray: false}
			}
		);
	}
]);

/*
*	music services
*/
fmApp.factory('Music', ['$resource', 
	function($resource) {
		return $resource('/api/music/', 
			{},
			{query: {method: 'get', isArray: true}
		});
	}
]);

/*
*	music services
*/
fmApp.factory('MusicList', ['$resource', 
	function($resource) {
		return $resource('/api/playlist/:arg', 
			{arg: '@arg'},
			{query: {method: 'get', isArray: true }
		});
	}
]);

/*
*	channel services
*/
fmApp.factory('Channel', ['$resource', 
	function($resource) {
		return $resource('/api/channel/', 
			{},
			{query: {method: 'get', isArray: true}
		});
	}
]);
>>>>>>> origin/master
