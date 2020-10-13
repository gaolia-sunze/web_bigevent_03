$(function () {
    // 1,获取用户信息
    getUserInfo();
    // 2,给退出按钮绑定点击事件
    $('#btnLogout').on('click', function (e) {
        // 阻止a连接的跳转
        e.preventDefault();
        // 提示用户是否退出
        layer.confirm('是否确认退出?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            // 删除本地存储的token
            localStorage.getItem('token');
            // 跳转得到登录页面
            location.href = '/login.html';

            layer.close(index);
        });

    })
});

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 渲染用户头像
            renderAvatar(res.data);
        },
        // complete: function (res) {
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 删除本地存储的token
        //         localStorage.getItem('token');
        //         // 跳转得到登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
};

// 渲染用户的头像
function renderAvatar(user) {
    // 1,获取用户的名字
    var name = user.nickname || user.username;
    // console.log(name);
    // 2，设置欢迎的文本
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3，渲染用户的头像
    if (user.user_pic !== null) {
        // 图片头像显示
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.text-avatar').hide();
    } else {
        // 文本头像显示
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').show().html(first);
    }

}