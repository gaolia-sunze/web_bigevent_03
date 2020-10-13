$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function (data) {
        var dt = new Date(data);

        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    // 在个位数的左侧补零
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 定义查询的参数对象
    var q = {
        pagenum: 1,//页码值:
        pagesize: 2,//每页显示多少条数据
        cate_id: '',		//文章分类的 Id
        state: '',		//文章的状态，可选值有：已发布、草稿  
    };

    initTable();//展示文章列表数据
    // 1,定义获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                // 调用模板引擎渲染数据
                var str = template('tpl-table', res);
                $('tbody').html(str);


                renderPage(res.total);

            }
        });
    };

    // 初始化文章分类
    initCate();
    // 2,定义文章分类下拉选择框方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 调用form.render方法渲染页面
                form.render();

            }
        })
    };

    // 3,给筛选绑定提交事件，
    $('#form-search').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 获取到表单选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        // 赋值给q的参数
        q.cate_id = cate_id;
        q.state = state;
        //根据最新筛选条件，渲染文章列表数据 
        initTable();
    })

    // 4，定义分页方法
    var laypage = layui.laypage;
    function renderPage(total) {
        // console.log(num);
        laypage.render({
            elem: 'pageBox',//注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,//每页几条
            curr: q.pagenum,//第几页
            // 分页模块设置，显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [1, 2, 3, 4, 5],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                //把当前页赋值给q的对象 
                q.pagenum = obj.curr;
                // 每页显示多少条赋值给当前页
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    //根据最新筛选条件，渲染文章列表数据 
                    initTable();
                }
            }

        });
    };

    // 5，删除每页中的数据(事件委托到tbody)
    $('tbody').on('click', '.btn-delete', function () {
        // 后去删除按钮个数
        var len = $('.btn-delete').length;

        // 获取服务器返回的id
        var id = $('.btn-delete').attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // ajax获取删除文章的数据
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }

                    layer.msg('删除成功');
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    initTable();//展示文章列表数据

                }
            })

            layer.close(index);
        });
    })


});