$(function () {
    // 1,文章列表展示
    initArtCateList();
    // 封装文章列表函数并获取
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var str = template('tpl-table', res);
                $('tbody').html(str);
            }
        })
    };

    // 2,显示添加文章分类列表
    var indexAdd = null;
    var layer = layui.layer;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类 ',
            area: ['500px', '250px'],
            skin: 'demo-class',
            content: $('#dialog-add').html(),
        });

    });

    // 3,提交添加的文章分类(事件委托)
    var form = layui.form;
    $('body').on('submit', '#form-add', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // console.log('ok');

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                // 重新展示页面
                initArtCateList();
                layer.msg('更新列表成功！');
                layer.close(indexAdd);
            }
        })

    });


    // 4,修改展示表单(事件委托)
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类 ',
            area: ['500px', '250px'],
            skin: 'demo-class',
            content: $('#dialog-edit').html(),
        });

        // 获取表单的ID，发送ajax,渲染到页面
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        })

    });



    //5,修改之后提交表单(事件委托)
    $('body').on('submit', '#form-edit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // console.log('ok');

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                // 更新成功，重新展示页面
                initArtCateList();
                layer.msg('更新列表成功！');
                layer.close(indexEdit);
            }
        })

    });

    // 6，删除表单(事件委托)
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除的Id
        var id = $(this).attr('data-id');
        // 显示弹出框
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something

            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    // 删除成功，重新展示页面
                    initArtCateList();
                    layer.msg('删除列表成功！');
                    layer.close(index);
                }
            })

        });
    });

});