// 每次请求之前，会调用这个函数，拿到这个函数的options配置项
var baseURL = 'http://ajax.frontend.itheima.net';
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url;

});