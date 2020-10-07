$(function () {
    // 1,点击注册，登录显示，注册隐藏；点击登录，注册显示，登录隐藏；
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 2,自定义验证规则
    var form = layui.form;
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码规则
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val();
            if (value !== pwd) {
                return '两次密码输入不一致！';
            }
        }
    });

    // 3，注册功能
    var layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        // 取消表单的默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功,请登录！');
                // 模拟人的点击行为
                $('#link_login').click();
            }
        })

    });

    // 4,登录功能
    $('#form_login').on('submit', function (e) {
        // 取消表单的默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功！');
                //保存token数据
                localStorage.setItem('token', res.token);
                // 跳转到首页
                location.href = 'index.html';
            }
        })

    });
});