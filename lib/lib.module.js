var RandomBlock = /** @class */ (function () {
    function RandomBlock(options, callback) {
        var _this = this;
        this.callback = callback;
        this.isLine = options.line;
        this.isPoint = options.point;
        this.isFill = options.fill;
        this.fontSize = options.fontSize || 50;
        this.charNum = options.charNum || 4;
        this.factorStr = options.factor || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        // 初始化
        // 给到一个div容器
        // 添加canvas
        var canvas = document.createElement('canvas');
        canvas.width = options.container.clientWidth;
        canvas.height = options.container.clientHeight;
        options.container.appendChild(canvas);
        var ctx = canvas.getContext('2d');
        // 点击
        canvas.onclick = function () { return _this.onClick(ctx, canvas.width, canvas.height); };
        // 绘图
        this.draw(ctx, canvas.width, canvas.height);
    }
    // 点击事件
    RandomBlock.prototype.onClick = function (ctx, width, height) {
        // 清屏
        ctx.clearRect(0, 0, width, height);
        this.draw(ctx, width, height);
    };
    // 随机颜色
    RandomBlock.prototype.randomRgb = function () {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
    };
    // 随机字符
    RandomBlock.prototype.randomChar = function (len) {
        if (len === void 0) { len = 4; }
        var result = '';
        for (var i = 0; i < len; i++) {
            result += this.factorStr[Math.floor(Math.random() * this.factorStr.length)];
        }
        return result;
    };
    // 绘图
    RandomBlock.prototype.draw = function (ctx, width, height) {
        ctx.strokeStyle = this.randomRgb();
        if (this.isLine) {
            // 干扰线
            for (var i = 0; i < 10; i++) {
                ctx.beginPath();
                ctx.moveTo(Math.random() * width, Math.random() * height);
                ctx.lineTo(Math.random() * width, Math.random() * height);
                ctx.strokeStyle = this.randomRgb();
                ctx.stroke();
            }
        }
        if (this.isPoint) {
            // 干扰散点
            for (var j = 0; j < 20; j++) {
                ctx.beginPath();
                var x = Math.random() * width;
                var y = Math.random() * height;
                ctx.arc(x, y, 1, 0, Math.PI * 2, true);
                ctx.fillStyle = this.randomRgb();
                ctx.fill();
            }
        }
        var randomStr = '';
        for (var index = 0; index < this.charNum; index++) {
            ctx.save();
            var x = width / this.charNum * (index) / 2;
            var y = Math.random() * height / 4 + height / 4;
            ctx.translate(x, y);
            var rds = this.randomChar(1);
            randomStr += rds;
            ctx.font = "italic ".concat(this.fontSize, "px 'Microsoft YaHei'");
            if (this.isFill) {
                ctx.fillStyle = this.randomRgb();
                ctx.fillText(rds, x, y);
            }
            else {
                ctx.strokeStyle = this.randomRgb();
                ctx.strokeText(rds, x, y);
            }
            ctx.restore();
        }
        this.callback(randomStr);
    };
    return RandomBlock;
}());

// 容器样式
var containerCss = "user-select: none;\n    position: relative;\n    background-color: #E8E8E8;";
// 滑块样式
var sliderCss = "position: absolute;\n    top: 0;\n    left: 0;\n    width: 36px;\n    height: 100%;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    background: #fff;\n    cursor: pointer;\n    font-family: \"\u5B8B\u4F53\";\n    z-index: 1;\n    font-weight: bold;\n    color: #929292;";
// 文本样式
var textCss = "position: absolute;\n    left: 0;\n    top: 0;\n    bottom: 0;\n    right: 0;\n    width: 100%;\n    height: 100%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 13px;\n    color: #444;";
// 景色容器样式
var bgCss = "background-color: #BFBFBF;\n    height: 100%;\n    position: absolute;\n    left: 0;";
var Slider = /** @class */ (function () {
    function Slider(options, callback) {
        this.callback = callback;
        // 初始化
        if (!options.title) {
            options.title = "滑动解锁";
        }
        if (!options.success) {
            options.success = "解锁成功";
        }
        this.init(options);
    }
    Slider.prototype.getMaterials = function (title) {
        // 创建容器
        var container = document.createElement('div');
        // 设置样式
        container.style.cssText = containerCss;
        // 创建滑块
        var slider = document.createElement('div');
        // 设置样式
        slider.style.cssText = sliderCss;
        slider.innerText = '>>';
        // 创建滑块上的文本
        var titleDiv = document.createElement('div');
        // 设置样式
        titleDiv.style.cssText = textCss;
        titleDiv.innerText = title;
        // 创建动态背景色容器
        var bgDiv = document.createElement('div');
        // 设置样式
        bgDiv.style.cssText = bgCss;
        // 组装容器
        container.appendChild(bgDiv);
        container.appendChild(slider);
        container.appendChild(titleDiv);
        return { container: container, slider: slider, titleDiv: titleDiv, bgDiv: bgDiv };
    };
    Slider.prototype.init = function (c) {
        var _this = this;
        var _a = this.getMaterials(c.title), container = _a.container, slider = _a.slider, titleDiv = _a.titleDiv, bgDiv = _a.bgDiv;
        // 设置容器宽高
        container.style.width = c.container.clientWidth + 'px';
        container.style.height = c.container.clientHeight + 'px';
        c.container.appendChild(container);
        var left, leftoffset;
        var px = container.offsetWidth - slider.offsetWidth;
        slider.onmousedown = function (event) {
            var downEvent = window.event || event;
            left = downEvent.clientX - slider.offsetLeft; //鼠标按下时的位置
            document.onmousemove = function (event) {
                var moveEvent = window.event || event;
                leftoffset = moveEvent.clientX - left; //鼠标移动的距离
                if (leftoffset < 0) {
                    leftoffset = 0;
                }
                else if (leftoffset > px) {
                    leftoffset = px;
                }
                slider.style.left = leftoffset + "px";
                // 变更bgDiv的宽度
                bgDiv.style.width = leftoffset + "px";
            };
            document.onmouseup = function (event) {
                var upEvent = window.event || event;
                document.onmousemove = null;
                document.onmouseup = null;
                leftoffset = upEvent.clientX - left;
                if (leftoffset < 0) {
                    leftoffset = 0;
                    titleDiv.innerHTML = c.title;
                    _this.callback(false);
                }
                else if (px < leftoffset) {
                    leftoffset = px;
                    titleDiv.innerHTML = c.success;
                    slider.innerHTML = '√';
                    slider.onmousedown = null;
                    _this.callback(true);
                }
                else {
                    _this.callback(false);
                    leftoffset = 0;
                    slider.style.transition = 'left .5s ease 0s';
                    bgDiv.style.width = "0";
                    bgDiv.style.transition = 'width .5s ease 0s';
                    // 监听动画结束
                    slider.addEventListener('transitionend', function () {
                        slider.style.transition = '';
                        bgDiv.style.transition = '';
                    });
                }
                slider.style.left = leftoffset + 'px';
            };
        };
    };
    return Slider;
}());

var index = {
    randomBlock: RandomBlock,
    slider: Slider
};

export { index as default };
