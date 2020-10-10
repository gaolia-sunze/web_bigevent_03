$(function () {

    // 1,自定义校验规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        // 新密码和原密码
        samePwd: function (value) {
            // value是新密码
            if (value === $('[name=oldPwd]').val()) {
                return "新旧密码不能相同"
            }
        },
        // 新密码和确认新密码
        rePwd: function (value) {
            // value是确认新密码
            if (value !== $('[name=newPwd]').val()) {
                return "两次新密码不一致！"
            }
        },
    });

    //2, 提交重置密码表单
    $('.layui-form').on('submit', function (e) {
        // 阻止默认提交重置
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                layer.msg('更新密码成功！');
                // 重置表单
                $('.layui-form')[0].reset();
            }
        })
        
    })


});