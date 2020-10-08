// 每次请求之前，会调用这个函数，拿到这个函数的options配置项
var baseURL = 'http://ajax.frontend.itheima.net';
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url;


    // 统一设置请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    };

    // 拦截所有响应，判断身份认证信息
    options.complete = function (res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 删除本地存储的token
            localStorage.getItem('token');
            // 跳转得到登录页面
            location.href = '/login.html';
        }
    }
});