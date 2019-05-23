layui.use(['form', 'util', 'layer', 'laydate', 'table', 'laytpl', 'util'], function() {
    var form = layui.form;
    var util = layui.util;
    layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        table = layui.table;
        userid = '';
        level ='';
        active ='';
    // enter
    $(document).keyup(function(event){
      if(event.keyCode ==13){
        search();
      }
    });
    // 搜索
    function search(){
        var searchVal1 = $(".searchVal1").val();
        $.ajax({
                url: 'https://pay.imbatv.cn/api/user/find?parm='+searchVal1,
                type: "POST",
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                    if (data.code == 200) {
                        // layer.msg(data.message, { time: 1000 }, function() {
                        //     //回调
                        //     window.location.reload();
                        // })
                        $(".sp1").html("姓名："+data.data.name);
                        $(".sp2").html("身份证："+data.data.idcard);
                        $(".sp3").html("手机："+data.data.phone);
                        $(".sp4").html("会员号："+data.data.username);
                        $(".sp5").html("会员等级："+data.data.level);
                        $(".sp6").html("余额："+data.data.balance);
                        userid = data.data.uid;
                        level = data.data.level;
                    } else {
                        layer.msg(data.message);
                        $(".sp1").html("姓名：");
                        $(".sp2").html("身份证：");
                        $(".sp3").html("手机：");
                        $(".sp4").html("会员号：");
                        $(".sp5").html("会员等级：");
                        $(".sp6").html("余额：");
                        userid = "";
                        level = "";
                    }

                },
                error: function(err) {
                    console.log(err);
                }
            });
    }
    $('.search_btn1').on('click', function() {
       search();
    });
// 上机
 $('.op-cp').on('click', function() {
    if (userid == "") {
        layer.msg("请输入正确信息！！！", { time: 3000, icon: 5 });
    }else{
        if(!active) {
            window.location.href = '../../page/boot_up/starting_up.html?userid=' + userid ;
        }else{
            layer.msg("该用户已经处于上机状态！", { time: 3000, icon: 5 });
        } 
    }
 });
 // 下机
 $('.down-cp').on('click', function() {
    var searchVal2 = $(".searchVal2").val();
    if (userid == "" && searchVal2 == "") {
        layer.msg("请输入正确信息！！！", { time: 3000, icon: 5 });
    }else{
        if(userid != ""){
            if(!active) {
                window.location.href = '../../page/Shutdown/Down_machine.html?userid=' + userid +'&machine_id=0';
            }else{
                layer.msg("该用户已经处于下机状态！", { time: 3000, icon: 5 });
            } 
        }else{
             window.location.href = '../../page/Shutdown/Down_machine.html?machine_id=' + searchVal2 +'&userid=0';
        }
    }
 });
 // 充值
 $('.edit').on('click', function() {
    if (userid == "") {
        layer.msg("请输入正确信息！！！", { time: 3000, icon: 5 });
    }else{
        window.location.href = '../../page/invest_money/recharge.html?userid=' + userid ;
    }
 });
 // 商品销售
 $('.sale').on('click', function() {
     window.location.href = '../../page/sale/commodity_sale.html?userid=' + userid ;
 });
 // 特殊vip管理
 $('.vip').on('click', function() {
     if (userid == "") {
       layer.msg("请输入正确信息！！！", { time: 3000, icon: 5 });
    }else{
        window.location.href = '../../page/manag_VIP/vip.html?userid='+ userid;
    }
    
 });
 // 手机订单
 $('.order').on('click', function() {
     window.location.href = '../../page/order/handset_order.html';
 });
 // 增加新用户
 $('.adduser').on('click', function() {
     window.location.href = '../../page/adduser/recharge.html';
 });
 // 赠送优惠劵
 $('.give').on('click', function() {
    if (userid == "") {
       layer.msg("请输入正确信息！！！", { time: 3000, icon: 5 });
    }else{
        window.location.href = '../../page/give/give.html?userid='+userid;
    }
 });
// 交接班
 $('.change_shifts').on('click', function() {
     window.location.href = '../../page/change_shifts/index.html';
 });
  // 备用
 $('.spare').on('click', function() {
     layer.msg("敬请期待", { time: 3000, icon: 5 });
 });
});
// 验证手机号
function isPhoneNo(phone) {
    var pattern = /^1[34578]\d{9}$/;
    return pattern.test(phone);
}

function createTime(v) {
    var date = new Date(v * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ("0" + d) : d;
    var h = date.getHours();
    h = h < 10 ? ("0" + h) : h;
    var M = date.getMinutes();
    M = M < 10 ? ("0" + M) : M;
    var str = y + "-" + m + "-" + d + " " + h + ":" + M;
    return str;
}