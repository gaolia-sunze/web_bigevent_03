$(function () {
    //1，自定义表单的效验规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度为1~6之间';
            }
        }
    });

    // 2,初始化用户基本信息
    initUserInfo();

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！');
                }
                // 成功后，调用form.val()方法为表单赋值
                // 这块的form指的是layui中获取的form
                form.val('formUserInfo', res.data);
            }
        })
    };


    //3, 表单重置
    $('#btnRest').on('click', function (e) {
        // 阻止表单默认重置行为
        e.preventDefault();
        // 初始化表单信息
        initUserInfo();
    });

    // 4，监听表单更新事件
    $('.layui-form').on('submit', function (e) {
        // 阻止默认提交重置
        e.preventDefault();
        // 发送ajax更新数据
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg('更新成功！');
                // 调用父页面的方法，重新渲染页面
                window.parent.getUserInfo();
                // 重置表单
                // $('.layui-form')[0].reset();

            }
        })
    });

});