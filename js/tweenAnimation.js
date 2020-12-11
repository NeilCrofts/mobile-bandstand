/**
 能够实现对元素的动画控制

 函数名
 tweenAnimation

 使用示例
 tweenAnimation(el, 'width', 200, 956, 5000, 10, 'linear');
 
 tweenAnimation(el, 'top', 200, 9000, 2000, 10, 'easeOut');
 */
/**
 * 
 *  el 变化的元素
 *  style 变化的属性
 *  init 初始位置
 *  end 结束位置
 *  time 总的时间
 * jiange 每次定时器的时间间隔
 *type 变化曲线类型
 */

function tweenAnimation(el, style, init, end, time, jiange, type, callback) {
    //动画切换的函数集合
    var tween = {
        backEaseOut: function(t, b, c, d, s) {
            // if (s == undefined) s = 1.70158;
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeOut: function(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        linear: function(t, b, c, d) {
            return c * t / d + b;
        }
    };
    //type 参数初始化
    var type = type === undefined ? 'linear' : type;

    //实现功能
    //初始化参数
    var t = 0;
    var b = init;
    var c = end - init;
    var d = time;

    if (el.timer === undefined) {
        el.timer = {};
    }

    //启动定时器
    el.timer[style] = setInterval(function() {
        //4. 清空定时器
        if (t >= d) {
            clearInterval(el.timer[style]);
            return;
        }
        //1. 时间自增
        t += jiange;
        //2. 计算新的值
        var v = tween[type](t, b, c, d);
        //3. 设置样式  width height  px    translateX translateY scale opacity
        switch (style) {
            case 'width':
            case 'height':
            case 'left':
            case 'top':
                el.style[style] = v + 'px';
                break;
            case 'translateX':
            case 'translateY':
            case 'translateZ':
            case 'scale':
            case 'scaleX':
            case 'scaleY':
            case 'scaleZ':
            case 'rotate':
            case 'rotateX':
            case 'rotateY':
                transformCSS(el, style, v);
                break;

            case 'opacity':
                el.style[style] = v;
                break;
        }
        //执行用户的回调
        // if (typeof callback === 'function') {
        //     callback();
        // }
    }, jiange);

}
