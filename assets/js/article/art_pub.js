$(function () {

    var layer = layui.layer;
    var form = layui.form;
    initCate();//初始化文章分类
    // 1，定义获取文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 使用模板引擎添加数据
                var str = template('tpl-cate', res);
                $('[name=cate_id]').html(str);
                // 调用form方法渲染页面
                form.render();

            }
        })
    };

    //2， 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 3,给选择封面绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });

    // 4,用户选择图片
    $('#coverFile').on('change', function (e) {

        // 1. 拿到用户选择的文件
        var file = e.target.files[0]
        // 2. 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 3. 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    });

    // 5,设置保存的状态
    var state = "已保存";
    $('#btnSave2').on('click', function () {
        // console.log('ok');
        state = "草稿"
    })

    // 6,添加文章，给表单绑定提交事件
    $('#form-pub').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();

        // 创建一个FormDate()对象,收集数据这里的this之表单
        var fd = new FormData(this);
        // 把选中的状态追加到创建的对象中
        fd.append('state', state);
        // 将裁剪后的图片转换成文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象，进行后续的操作
                fd.append('cover_img', blob);
                // 打印文件的序列参数
                // console.log(...fd);

                publishArticle(fd);

            });


    });

    // 7,封装添加文章分类的方法
    function publishArticle(fd) {
        // 得到文件对象后，发送ajax提交文件
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // FormData数据提交ajax,要设置下边两个属性
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                layer.msg('发布文章成功');
                // 跳转到文章列表页面
                //href:设置或者获取地址栏信息路径
                //search：获取地址栏参数 例：(?name=zj&age=18)
                //host:返回主机（域名）
                //port:返回端口号
                //pathname:返回路径
                //hash：返回片段 #后面的内容，常见链接 锚点
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 1000)

            }
        })
    }

});