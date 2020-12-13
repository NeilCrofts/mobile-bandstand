(function() {
    //阻止默认行为
    var app = document.getElementById('app');
    app.addEventListener('touchstart', function(e) {
        e.preventDefault();
    });
    //移动端适配
    //先获取屏幕宽
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';
    window.onresize = function() {
        document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';
    }
}()); //闭包尾部要加分号

//头部点击按钮显示隐藏菜单
(function() {
    const app = document.querySelector('#app');
    const menuBtn = app.querySelector('#header .up .menu');
    const mask = app.querySelector('#header .mask');
    // let isOpen = false;
    menuBtn.addEventListener('touchstart', function() {
        // if (isOpen) {
        //     menuBtn.classList.remove('open');
        //     mask.classList.remove('open');
        // } else {
        //     menuBtn.classList.add('open');
        //     mask.classList.add('open');
        // }
        // isOpen = !isOpen;
        menuBtn.classList.toggle('open');
        mask.classList.toggle('open');
    });
    //input标签获得焦点
    const input = app.querySelector('#search');
    input.addEventListener('touchstart', function(e) {
        e.stopPropagation();
    })
    input.addEventListener('touchmove', function(e) {
        e.preventDefault();
    })
    app.addEventListener('touchstart', function() {
        input.blur();
    })

}());


//导航区水平滑动逻辑
(function() {
    const nav = document.querySelector('#nav');
    const wrap = nav.querySelector('.wrap');
    let isMoveing = false;

    nav.addEventListener('touchstart', function(e) {
        this.x = e.touches[0].clientX;
        //获取元素的.transform样式值translateX
        this.left = transformCSS(wrap, 'translateX');
        //为移动时关闭过渡
        wrap.style.transition = 'none';
        //获取按下时的时间
        this.startTime = Date.now();
        //阻止其点击后上下滑动，不冒泡到#app的touchmove事件
        e.stopPropagation();
    })

    nav.addEventListener('touchmove', function(e) {
        this._x = e.touches[0].clientX;
        let newLeft = this._x - this.x + this.left;
        //越界后橡皮筋效果
        if (newLeft > 0) {
            newLeft = (this._x - this.x) / 3;
        }
        let minTranslateX = nav.offsetWidth - wrap.offsetWidth;
        if (newLeft < minTranslateX) {
            newLeft = minTranslateX + (this._x - this.x) / 3
        }
        //设置元素的.transform样式值translateX
        transformCSS(wrap, 'translateX', newLeft);
        isMoveing = true;
    })

    nav.addEventListener('touchend', function(e) {
            wrap.style.transition = '0.3s all ease-out';
            let translateX = transformCSS(wrap, 'translateX');
            //惯性移动效果
            //获取松手时的触点位置
            this._x = e.changedTouches[0].clientX;
            //获取松手时与按下时的translateX位置差
            let moveX = this._x - this.x;
            //获取松手时与按下的时间差
            let moveTime = Date.now() - this.startTime;
            //计算平均水平移动速度
            let avgSpeed = moveX / moveTime;
            //通过速度求位移
            let disX = avgSpeed * 100;
            //根据速度修改translateX位置
            translateX += disX;
            transformCSS(wrap, 'translateX', translateX);
            //越界判断
            if (translateX > 0) {
                //回弹过渡效果
                wrap.style.transition = '0.3s cubic-bezier(.21,.68,.42,1.77)';
                transformCSS(wrap, 'translateX', 0);
            }
            let minTranslateX = nav.offsetWidth - wrap.offsetWidth;
            if (translateX < minTranslateX) {
                wrap.style.transition = '0.3s cubic-bezier(.21,.68,.42,1.77)';
                transformCSS(wrap, 'translateX', minTranslateX);
            }
            isMoveing = false;
        })
        //按下使导航li标签变色
    const navLi = wrap.querySelectorAll('li');
    navLi.forEach(ele => {
        ele.addEventListener('touchend', function() {
            if (isMoveing) return;
            navLi.forEach(val => {
                val.classList.remove('active');
            });
            ele.classList.add('active');
        })
    })

}());


//轮播图
(function() {
    new Swiper('#swiper');
}());


//楼层区 轮播
(function() {
    // 获取所有楼层元素
    const floors = document.querySelectorAll('.floor');
    floors.forEach(function(floor) {

        //点击导航 修改 底部边框元素的位置
        const movedBorder = floor.querySelector('.moved-border');
        //获取导航元素
        const navItems = floor.querySelectorAll('.nav-item');
        //获取幻灯片元素的wrapper
        const wrapper = floor.querySelector('.swiper-wrapper');
        const container = floor.querySelector('.container');
        const swiperSlides = floor.querySelectorAll('.swiper-slide');
        //绑定事件
        navItems.forEach(function(item, key) {
            //将下标存入到元素对象中
            // console.log(key);
            item.key = key;
            item.addEventListener('touchstart', function() {
                //切换底部边框元素的位置
                // transformCSS(movedBorder, 'translateX', 100);
                // 0   1    2    N
                // 0   41   82   41*N
                // N
                // var index = this.getAttribute('index');
                // var index = this.dataset.index;
                //获取下标   =>  translateX
                let translateX = this.key * movedBorder.offsetWidth;
                //设置位移 切换导航条的下边框
                transformCSS(movedBorder, 'translateX', translateX);
                //幻灯片切换   1   -360   2 -720   3 ....
                // 调用 swiper switchSlide 方法  index
                s.container.switchSlide(this.key);
            });
        });

        let s = new Swiper(container, {
            loop: false,
            auto: false,
            pagination: false,
            callback: {
                end: function() {
                    //切换border的位置
                    //如何知道当前显示的幻灯片的下标呢 ???
                    //获取当前 wrapper 元素的 translateX 的值
                    //方法一
                    let translateX = transformCSS(wrapper, 'translateX');
                    var index = -translateX / container.offsetWidth;
                    //方法二
                    var index = s.getIndex();
                    //倒推出 index 的值  0  0   1  -375    2  -750   3 -1125
                    transformCSS(movedBorder, 'translateX', index * movedBorder.offsetWidth);
                    //加载当前幻灯片的内容
                    setTimeout(() => {
                        //获取第一张幻灯片的内容  内容已经 备好
                        const firstSlider = floor.querySelector('.swiper-slide');
                        //检测当前的幻灯片是否已经加载
                        let hasLoaded = swiperSlides[index].getAttribute('has-loaded');
                        //未加载
                        if (hasLoaded == 0) {
                            //使用复制第一张内容作为其他幻灯片内容
                            swiperSlides[index].innerHTML = firstSlider.innerHTML;
                            //使用简易ajax加载
                            // var url = 'http://localhost:3000/music';
                            // $.get(url, function(data) {
                            //     console.log(data);
                            //     var mv = document.querySelector('.mv');
                            //     for (let i = 0; i < data.song_list.length; i++) {
                            //         var m = mv.cloneNode(true);
                            //         m.querySelector('img').src = data.song_list[i].album_500_500;
                            //         m.querySelector('h4').innerHTML = data.song_list[i].title;
                            //         swiperSlides[index].appendChild(m);
                            //     }
                            // }, 'json');
                            //标识当前幻灯片加载完毕
                            swiperSlides[index].setAttribute('has-loaded', 1);
                        }
                    }, 1500);
                }
            }
        });
    });
}());

//使主体内容上下滚动
(function() {
    window.onload = function() {
        //要最后加载，因为在live Server下，函数内contetn的可能获取不到正确的长度，导致滚动条长度问题
        var touchscroll = new Touchscroll('#app', '#main', {
            width: 4,
            bg: 'rgb(52,69,78)'
        });
    }

}());