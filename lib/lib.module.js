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
var sliderCss$1 = "position: absolute;\n    top: 0;\n    left: 0;\n    width: 36px;\n    height: 100%;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    background: #fff;\n    cursor: pointer;\n    font-family: \"\u5B8B\u4F53\";\n    z-index: 1;\n    font-weight: bold;\n    color: #929292;";
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
        slider.style.cssText = sliderCss$1;
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

var verifyContainerCss$1 = "position: relative;\n    overflow: hidden;\n    user-select:none;";
var picCss$1 = "position: relative;";
var canvasCss = "display: block;";
var pointerCss = "background: #1abd6c;\n    border-radius: 50%;\n    padding: 10px;\n    position: absolute;";
var pointerICss = "color: #fff;\n    font-style: normal;\n    font-size: 12px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    position: absolute;\n    left: 0;\n    top: 0;\n    right: 0;\n    bottom: 0;";
var toolbarCss = "width: 100%;\n    height: 40px;\n    border: 1px solid #e4e4e4;\n    background: #f7f7f7;\n    color: #666;\n    font-size: 14px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    position: relative;";
var toolbarActiveCss = "color: #fff;\n    background: #1991FA;\n    border: 1px solid #1991FA;";
var toolbarSuccessCss = "color: #fff;\n    background: #52CCBA;\n    border: 1px solid #52CCBA;";
var toolbarFailCss = "color: #fff;\n    background: #f57a7a;\n    border: 1px solid #f57a7a;";
var refreshCss$1 = "display: flex;\n    position: absolute;\n    right: 10px;\n    top: 10px;\n    z-index: 2;\n    cursor: pointer;";

var TextClick = /** @class */ (function () {
    function TextClick(options, callback) {
        this.fontArr = []; // 显示的字符
        this.tips = []; // 提示文字
        this.pointer = []; // 点击序号
        this.state = ''; // success fail active
        this.images = [];
        this.callback = callback;
        var container = options.container, _a = options.width, width = _a === void 0 ? 320 : _a, _b = options.height, height = _b === void 0 ? 160 : _b, _c = options.images, images = _c === void 0 ? [] : _c, _d = options.fontStr, fontStr = _d === void 0 ? '1234567890' : _d, _e = options.fontNum, fontNum = _e === void 0 ? 5 : _e, _f = options.checkNum, checkNum = _f === void 0 ? 3 : _f, _g = options.accuracy, accuracy = _g === void 0 ? 15 : _g;
        this.width = width;
        this.height = height;
        this.images = images;
        this.fontStr = fontStr;
        this.fontNum = fontNum;
        this.checkNum = checkNum;
        this.accuracy = accuracy;
        var _h = this.initView(), view = _h.view, canvas = _h.canvas, toolbar = _h.toolbar, layer = _h.layer;
        canvas.width = width;
        canvas.height = height;
        this.toolbar = toolbar;
        this.pic = layer;
        this.canvas = canvas;
        container.appendChild(view);
        this.ctx = canvas.getContext('2d');
        this.bgImg = document.createElement("img");
        this.drawBg();
    }
    // 绘制背景图
    TextClick.prototype.drawBg = function () {
        if (this.images && this.images.length > 0)
            this.getImg();
        else {
            // canvas 添加背景色
            this.canvas.style.backgroundColor = '#E8E8E8';
            this.draw();
        }
    };
    TextClick.prototype.getImg = function () {
        var _this = this;
        // const img = document.createElement('img');
        var imagesLen = this.images.length;
        var randomIndex = Math.floor(Math.random() * imagesLen);
        this.bgImg.crossOrigin = "Anonymous";
        this.bgImg.src = this.images[randomIndex];
        // this.bgImg = img;
        this.bgImg.onload = function () {
            // console.log('图片加载完成')
            _this.draw();
        };
        // console.log(this.bgImg)
    };
    TextClick.prototype.draw = function () {
        // 绘制背景图
        this.ctx.drawImage(this.bgImg, 0, 0, this.width, this.height);
        for (var i = 0; i < this.fontNum; i++) {
            var character = this.getRandomCharacter(this.fontStr);
            // console.log(character)
            var fontSize = this.randomNum(20, this.height * 1 / 4);
            var fontWeight = Math.random() > 0.5 ? 'bold' : 'normal';
            var fontStyle = Math.random() > 0.5 ? 'italic' : 'normal';
            var fontFamily = Math.random() > 0.5 ? 'sans-serif' : 'serif';
            var x = this.width / this.fontNum * i + 10;
            var y = Math.random() * (this.height - fontSize);
            this.ctx.fillStyle = this.randomColor(0, 255);
            this.ctx.font = "".concat(fontStyle, " ").concat(fontWeight, " ").concat(fontSize, "px ").concat(fontFamily);
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(character, x, y);
            this.fontArr.push({
                character: character,
                x: x,
                y: y
            });
        }
        // console.log(this.fontArr)
        for (var i = 0; i < this.checkNum; i++) {
            var randomIndex = Math.floor(Math.random() * this.fontArr.length);
            var character = this.fontArr.splice(randomIndex, 1)[0];
            this.tips.push(character);
        }
        this.addTips();
    };
    // 获取随机字符
    TextClick.prototype.getRandomCharacter = function (fontStr) {
        var fontStrLen = fontStr.length;
        var randomIndex = Math.floor(Math.random() * fontStrLen);
        var character = fontStr.charAt(randomIndex);
        // debugger
        var isSome = this.fontArr.some(function (item) {
            return item.character === character;
        });
        if (isSome) {
            // console.log(`>>>${character}已存在>>>`)
            return this.getRandomCharacter(fontStr);
        }
        else {
            return character;
        }
    };
    TextClick.prototype.randomColor = function (min, max) {
        var r = this.randomNum(min, max);
        var g = this.randomNum(min, max);
        var b = this.randomNum(min, max);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    };
    TextClick.prototype.randomNum = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };
    TextClick.prototype.createPointer = function (e) {
        var _this = this;
        var x = e.offsetX - 15;
        var y = e.offsetY - 15;
        if (this.pointer.length < this.tips.length) {
            this.pointer.push({ x: x, y: y });
            this.state = 'active';
            this.addCheckIcon();
        }
        if (this.pointer.length === this.tips.length) {
            var isPass = this.verify();
            if (isPass) {
                this.state = 'success';
            }
            else {
                this.state = 'fail';
                // 如果失败则1000毫秒后重置
                this.timeIns = setTimeout(function () {
                    _this.reset();
                }, 1000);
            }
        }
        this.addTips();
    };
    // 判断精度
    TextClick.prototype.verify = function () {
        var _this = this;
        // console.log("验证")
        var result = this.pointer.every(function (item, index) {
            var _left = item.x > _this.tips[index].x - _this.accuracy;
            var _right = item.x < _this.tips[index].x + _this.accuracy;
            var _top = item.y > _this.tips[index].y - _this.accuracy;
            var _bottom = item.y < _this.tips[index].y + _this.accuracy;
            return _left && _right && _top && _bottom;
        });
        // console.log(result)
        this.callback(result);
        return result;
    };
    // 重置
    TextClick.prototype.reset = function () {
        this.fontArr = [];
        this.tips = [];
        this.pointer = [];
        this.state = '';
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawBg();
        // 清理pic
        this.pic.innerHTML = '';
        this.pic.appendChild(this.canvas);
    };
    TextClick.prototype.initView = function () {
        // 创建容器
        var container = document.createElement("div");
        container.style.cssText = verifyContainerCss$1;
        container.style.width = "".concat(this.width, "px");
        var refresh = this.createRefreshContainer();
        var _a = this.createLayerContainer(), layer = _a.pic, canvas = _a.canvas;
        var toolbar = this.createToolbar();
        container.appendChild(refresh);
        container.appendChild(layer);
        container.appendChild(toolbar);
        return { canvas: canvas, view: container, toolbar: toolbar, layer: layer };
    };
    // 创建刷新容器
    TextClick.prototype.createRefreshContainer = function () {
        var refresh = document.createElement("div");
        refresh.style.cssText = refreshCss$1;
        refresh.onclick = this.reset.bind(this);
        // 添加svg
        refresh.innerHTML = "<svg t=\"1637315258145\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2420\" width=\"20\" height=\"20\"><path d=\"M960 416V192l-73.056 73.056a447.712 447.712 0 0 0-373.6-201.088C265.92 63.968 65.312 264.544 65.312 512S265.92 960.032 513.344 960.032a448.064 448.064 0 0 0 415.232-279.488 38.368 38.368 0 1 0-71.136-28.896 371.36 371.36 0 0 1-344.096 231.584C308.32 883.232 142.112 717.024 142.112 512S308.32 140.768 513.344 140.768c132.448 0 251.936 70.08 318.016 179.84L736 416h224z\" p-id=\"2421\" fill=\"#8a8a8a\"></path></svg>";
        return refresh;
    };
    // 创建图层容器
    TextClick.prototype.createLayerContainer = function () {
        var _this = this;
        var pic = document.createElement("div");
        pic.style.cssText = picCss$1;
        // 创建canvas
        var canvas = document.createElement("canvas");
        canvas.style.cssText = canvasCss;
        canvas.onclick = function (e) { return _this.createPointer(e); };
        pic.appendChild(canvas);
        return { pic: pic, canvas: canvas };
    };
    // 创建工具栏
    TextClick.prototype.createToolbar = function () {
        var toolbar = document.createElement("div");
        toolbar.style.cssText = toolbarCss;
        return toolbar;
    };
    // 添加点选Icon
    TextClick.prototype.addCheckIcon = function () {
        // 创建指示物
        for (var i = 0; i < this.pointer.length; i++) {
            var _a = this.pointer[i], x = _a.x, y = _a.y;
            var pointerDiv = document.createElement("div");
            pointerDiv.style.cssText = pointerCss;
            pointerDiv.style.left = "".concat(x, "px");
            pointerDiv.style.top = "".concat(y, "px");
            // 创建i标签
            var pointerICon = document.createElement("i");
            pointerICon.style.cssText = pointerICss;
            pointerICon.innerText = "".concat(i + 1);
            pointerDiv.appendChild(pointerICon);
            this.pic.appendChild(pointerDiv);
        }
    };
    // 添加提示语
    TextClick.prototype.addTips = function () {
        // 清理toolbar下元素
        this.toolbar.innerHTML = '';
        switch (this.state) {
            case 'active':
                this.toolbar.style.cssText += toolbarActiveCss;
                // 创建默认文案
                var defaultP = document.createElement("p");
                var spanStart = document.createElement("span");
                spanStart.innerText = "请顺序点击【";
                defaultP.appendChild(spanStart);
                for (var i = 0; i < this.tips.length; i++) {
                    var tip = this.tips[i];
                    var span = document.createElement("span");
                    span.innerText = tip.character;
                    defaultP.appendChild(span);
                }
                var spanEnd = document.createElement("span");
                spanEnd.innerText = "】";
                defaultP.appendChild(spanEnd);
                this.toolbar.appendChild(defaultP);
                break;
            case 'success':
                this.toolbar.style.cssText += toolbarSuccessCss;
                // 创建success文案
                var successP = document.createElement("p");
                successP.innerText = "验证通过";
                this.toolbar.appendChild(successP);
                break;
            case 'fail':
                this.toolbar.style.cssText += toolbarFailCss;
                // 创建fail文案
                var failP = document.createElement("p");
                failP.innerText = "验证失败";
                this.toolbar.appendChild(failP);
                break;
            default:
                this.toolbar.style.cssText = toolbarCss;
                // 创建默认文案
                var defaultP2 = document.createElement("p");
                var spanStart2 = document.createElement("span");
                spanStart2.innerText = "请顺序点击【";
                defaultP2.appendChild(spanStart2);
                for (var i = 0; i < this.tips.length; i++) {
                    var tip = this.tips[i];
                    var span = document.createElement("span");
                    span.innerText = tip.character;
                    defaultP2.appendChild(span);
                }
                var spanEnd2 = document.createElement("span");
                spanEnd2.innerText = "】";
                defaultP2.appendChild(spanEnd2);
                this.toolbar.appendChild(defaultP2);
                break;
        }
    };
    return TextClick;
}());

var RandomCalc = /** @class */ (function () {
    function RandomCalc(options, callback) {
        this.num1 = 0;
        this.num2 = 0;
        this.symbol = '+';
        this.result = 0; // 计算结果
        this.callback = callback;
        var container = options.container, _a = options.width, width = _a === void 0 ? 320 : _a, _b = options.height, height = _b === void 0 ? 60 : _b, _c = options.range, range = _c === void 0 ? 100 : _c, _d = options.operator, operator = _d === void 0 ? ['+', '-'] : _d;
        this.width = width;
        this.height = height;
        this.range = range;
        this.operator = operator;
        // 创建画布
        var canvas = document.createElement('canvas');
        canvas.style.cssText = "display: block;";
        canvas.width = width;
        canvas.height = height;
        canvas.onclick = this.reset.bind(this);
        this.ctx = canvas.getContext('2d');
        // 初始化视图
        var view = document.createElement('div');
        view.style.cssText = "overflow: hidden; user-select: none; width: ".concat(this.width, "px;");
        view.appendChild(canvas);
        container.appendChild(view);
        this.drawFormula();
    }
    // 绘制图形码
    RandomCalc.prototype.drawFormula = function () {
        this.ctx.fillStyle = this.randomColor(180, 240);
        this.ctx.fillRect(0, 0, this.width, this.height);
        // 绘制干扰线
        for (var j = 0; j < 3; j++) {
            this.ctx.strokeStyle = this.randomColor(40, 180);
            this.ctx.beginPath();
            this.ctx.moveTo(this.randomNum(0, this.width), this.randomNum(0, this.height));
            this.ctx.lineTo(this.randomNum(0, this.width), this.randomNum(0, this.height));
            this.ctx.stroke();
        }
        // 绘制干扰点
        for (var k = 0; k < 30; k++) {
            this.ctx.fillStyle = this.randomColor(0, 255);
            this.ctx.beginPath();
            this.ctx.arc(this.randomNum(0, this.width), this.randomNum(0, this.height), 1, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        var formula = ''; // 公式字符串
        this.num1 = Math.floor(Math.random() * this.range);
        this.num2 = Math.floor(Math.random() * this.range);
        this.symbol = this.operator[Math.floor(Math.random() * 2)];
        if (this.symbol === '+') {
            formula = "".concat(this.num1, "+").concat(this.num2, "=?");
            this.result = this.num1 + this.num2;
        }
        else {
            if (this.num1 >= this.num2) {
                formula = "".concat(this.num1, "-").concat(this.num2, "=?");
            }
            else {
                formula = "".concat(this.num2, "-").concat(this.num1, "=?");
            }
            this.result = Math.abs(this.num1 - this.num2);
        }
        this.callback(this.result);
        for (var i = 0; i < formula.length; i++) {
            // 随机生成字体颜色
            this.ctx.fillStyle = this.randomColor(50, 160);
            // 随机生成字体大小(0.5 - 0.75)高的范围
            this.ctx.font = this.randomNum(this.height * 2 / 4, this.height * 3 / 4) + 'px SimHei';
            // 字体对齐位置
            this.ctx.textBaseline = 'top';
            var x = 20 + i * (this.width / formula.length);
            var y = this.randomNum(5, this.height / 4);
            this.ctx.fillText(formula[i], x, y);
        }
    };
    RandomCalc.prototype.randomColor = function (min, max) {
        var r = this.randomNum(min, max);
        var g = this.randomNum(min, max);
        var b = this.randomNum(min, max);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    };
    RandomCalc.prototype.randomNum = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };
    RandomCalc.prototype.reset = function () {
        this.result = 0;
        this.drawFormula();
    };
    return RandomCalc;
}());

var verifyContainerCss = "position: relative;\n    overflow: hidden;\n    user-select:none;";
var picCss = "width: 100%;position: relative;";
var canvasImgCss = "display: block;";
var canvasBlockCss = "position: absolute;\n    left: 0;\n    top: 0;";
var sliderCss = "height: 40px;\n    border: 1px solid #e4e4e4;\n    background: #f7f7f7;\n    font-family: \"\u5B8B\u4F53\";\n    position: relative;";
var tipCss = "width: 100%;\n    height: 100%;\n    color: #666;\n    font-size: 14px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    position: absolute;";
var barCss = "height: 100%;\n    position: absolute;\n    left: 0;\n    top: 0;";
var activeCss = "background: #D1E9FE;\n    border: 1px solid #1991FA;";
var successCss = "background: #D2F4EF;\n    border: 1px solid #52CCBA;";
var failCss = "background: #fce1e1;\n    border: 1px solid #f57a7a;";
var sliderIconCss = "width: 40px;\n    height: 100%;\n    background: rgba(225, 225, 225, 0.6);\n    border: 1px solid #e3e3e3;\n    color: #666;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    position: absolute;\n    left: 0;\n    top: 0;\n    cursor: pointer;";
var sliderIconSuccessCss = "color: #fff;\n    background: #52CCBA;\n    border: 1px solid #52CCBA;";
var sliderIconActiveCss = "color: #fff;\n    background: #1991FA;\n    border: 1px solid #1991FA;";
var sliderIconFailCss = "color: #fff;\n    background: #f57a7a;\n    border: 1px solid #f57a7a;";
var refreshCss = "display: flex;\n    position: absolute;\n    right: 10px;\n    top: 10px;\n    z-index: 2;\n    cursor: pointer;";

var SliderImg = /** @class */ (function () {
    function SliderImg(options, callback) {
        this.sliderIcon = document.createElement("div");
        this.sliderBar = document.createElement("div");
        this.blockLeft = 0;
        this.startX = 0;
        this.endX = 0;
        this.sliderLeft = 0; // 拖动滑块的滑动距离
        this.slideState = ''; // success fail active
        this.showText = true; // 是否显示滑动提示
        this.isMouseDown = false;
        this.sliderId = Date.now() + ''; // 滑块id
        this.callback = callback;
        var container = options.container, _a = options.width, width = _a === void 0 ? 320 : _a, _b = options.height, height = _b === void 0 ? 160 : _b, _c = options.cuttingWH, cuttingWH = _c === void 0 ? 40 : _c, _d = options.accuracy, accuracy = _d === void 0 ? 5 : _d, _e = options.images, images = _e === void 0 ? [] : _e;
        this.width = width;
        this.height = height;
        this.cuttingWH = cuttingWH;
        this.accuracy = accuracy;
        this.images = images;
        var _f = this.initView(), view = _f.view, canvasImg = _f.canvasImg, canvasBlock = _f.canvasBlock;
        this.canvasImg = canvasImg;
        this.canvasBlock = canvasBlock;
        this.blockRect = {
            w: this.cuttingWH + 2 * this.cuttingWH / 4,
            r: this.cuttingWH / 4,
            x: 0,
            y: 0
        };
        container.appendChild(view);
        this.ctxImg = canvasImg.getContext('2d');
        this.ctxBlock = canvasBlock.getContext('2d');
        this.bgImg = document.createElement("img");
        // 监听pc端mouse事件
        this.mouseEvent();
        this.drawBg();
    }
    // 绘制背景图
    SliderImg.prototype.drawBg = function () {
        if (this.images && this.images.length > 0)
            this.getImg();
        else {
            // canvas 添加背景色
            this.canvasImg.style.backgroundColor = '#E8E8E8';
            this.draw(this.ctxImg, 'fill');
            this.draw(this.ctxBlock, 'clip');
        }
    };
    SliderImg.prototype.getImg = function () {
        var _this = this;
        var img = document.createElement('img');
        var imagesLen = this.images.length;
        var randomIndex = Math.floor(Math.random() * imagesLen);
        img.crossOrigin = "Anonymous";
        img.src = this.images[randomIndex];
        this.bgImg = img;
        img.onload = function () {
            // console.log('图片加载完成')
            _this.ctxImg.drawImage(_this.bgImg, 0, 0, _this.width, _this.height);
            _this.getBlockPostion();
            _this.ctxBlock.drawImage(_this.bgImg, 0, 0, _this.width, _this.height);
            var _yPos = _this.blockRect.y - 2 * _this.blockRect.r;
            var imageData = _this.ctxBlock.getImageData(_this.blockRect.x, _yPos, _this.blockRect.w, _this.blockRect.w + 1);
            _this.canvasBlock.width = _this.blockRect.w;
            _this.ctxBlock.putImageData(imageData, 0, _yPos);
        };
        // console.log(this.bgImg)
    };
    SliderImg.prototype.getBlockPostion = function () {
        var xPos = Math.floor(this.width / 2 + Math.random() * (this.width / 2 - this.blockRect.w));
        var yPos = Math.floor(30 + Math.random() * (this.height - this.blockRect.w - 30));
        this.blockRect.x = xPos;
        this.blockRect.y = yPos;
        this.draw(this.ctxImg, 'fill');
        this.draw(this.ctxBlock, 'clip');
    };
    SliderImg.prototype.draw = function (ctx, operation) {
        var _a = this.blockRect, r = _a.r, x = _a.x, y = _a.y;
        var _w = this.cuttingWH;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x + _w / 2, y - r + 2, r, 0.72 * Math.PI, 2.26 * Math.PI);
        ctx.lineTo(x + _w, y);
        ctx.arc(x + _w + r - 2, y + _w / 2, r, 1.21 * Math.PI, 2.78 * Math.PI);
        ctx.lineTo(x + _w, y + _w);
        ctx.lineTo(x, y + _w);
        ctx.arc(x + r - 2, y + _w / 2, r + 0.4, 2.76 * Math.PI, 1.24 * Math.PI, true);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(225, 225, 225, 0.8)';
        ctx.strokeStyle = 'rgba(225, 225, 225, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx[operation]();
    };
    // pc
    SliderImg.prototype.mouseEvent = function () {
        var _this = this;
        this.sliderIcon.onmousedown = function (e) {
            _this.startX = e.pageX;
            _this.showText = false;
            _this.isMouseDown = true;
            _this.switchSlider();
            document.onmousemove = _this.mouseMove.bind(_this);
            document.onmouseup = _this.mouseUp.bind(_this);
        };
    };
    SliderImg.prototype.mouseMove = function (e) {
        if (!this.isMouseDown) {
            return;
        }
        this.endX = e.pageX - this.startX;
        // 禁止超出边界
        if (this.endX < 0 || this.endX > this.width - this.cuttingWH) {
            return;
        }
        // 拖动的距离
        this.sliderLeft = this.endX;
        this.blockLeft = this.sliderLeft / (this.width - this.cuttingWH) * (this.width - this.blockRect.w);
        this.slideState = 'active';
        this.canvasBlock.style.left = "".concat(this.blockLeft, "px");
        this.sliderIcon.style.left = "".concat(this.sliderLeft, "px");
        this.sliderBar.style.width = "".concat(this.sliderLeft, "px");
        this.switchSlider();
    };
    SliderImg.prototype.mouseUp = function (e) {
        var _this = this;
        document.onmousemove = null;
        document.onmouseup = null;
        if (!this.isMouseDown || this.startX === e.clientX) {
            return;
        }
        this.isMouseDown = false;
        var isPass = this.verify();
        // console.log(isPass)
        if (isPass) {
            this.slideState = 'success';
            this.switchSlider();
        }
        else {
            this.slideState = 'fail';
            this.switchSlider();
            // 如果失败则1000毫秒后重置
            this.timeIns = setTimeout(function () {
                _this.reset();
            }, 1000);
        }
    };
    // mobile
    SliderImg.prototype.touchStart = function (e) {
        this.startX = e.changedTouches[0].pageX;
        this.showText = false;
        this.switchSlider();
    };
    SliderImg.prototype.touchMove = function (e) {
        this.endX = e.changedTouches[0].pageX - this.startX;
        // 禁止超出边界
        if (this.endX < 0 || this.endX > this.width - this.cuttingWH) {
            return;
        }
        // 拖动的距离
        this.sliderLeft = this.endX;
        this.blockLeft = this.sliderLeft / (this.width - this.cuttingWH) * (this.width - this.blockRect.w);
        this.slideState = 'active';
        this.canvasBlock.style.left = "".concat(this.blockLeft, "px");
        this.sliderIcon.style.left = "".concat(this.sliderLeft, "px");
        this.sliderBar.style.width = "".concat(this.sliderLeft, "px");
        this.switchSlider();
    };
    SliderImg.prototype.touchEnd = function (e) {
        var _this = this;
        var isPass = this.verify();
        // console.log(isPass)
        if (isPass) {
            this.slideState = 'success';
            this.switchSlider();
        }
        else {
            this.slideState = 'fail';
            this.switchSlider();
            // 如果失败则1000毫秒后重置
            this.timeIns = setTimeout(function () {
                _this.reset();
            }, 1000);
        }
    };
    // 判断精度
    SliderImg.prototype.verify = function () {
        // console.log(Math.abs(this.blockLeft - this.blockRect.x))
        var bool = Math.abs(this.blockLeft - this.blockRect.x) <= this.accuracy;
        this.callback(bool);
        return bool;
    };
    // 重置
    SliderImg.prototype.reset = function () {
        this.showText = true;
        this.slideState = '';
        this.sliderLeft = 0;
        this.blockLeft = 0;
        this.canvasBlock.width = this.width;
        this.ctxImg.clearRect(0, 0, this.width, this.height);
        this.ctxBlock.clearRect(0, 0, this.width, this.height);
        this.drawBg();
        this.canvasBlock.style.left = "".concat(this.blockLeft, "px");
        this.sliderIcon.style.left = "".concat(this.sliderLeft, "px");
        this.sliderBar.style.width = "".concat(this.sliderLeft, "px");
        this.sliderBar.style.cssText = barCss;
        this.sliderIcon.style.cssText = sliderIconCss;
        var tip = document.getElementById(this.sliderId);
        tip.innerText = '向右滑动完成验证';
    };
    SliderImg.prototype.initView = function () {
        // 创建容器
        var container = document.createElement("div");
        container.style.cssText = verifyContainerCss;
        container.style.width = "".concat(this.width, "px");
        var refresh = this.createRefreshContainer();
        var _a = this.createLayerContainer(), layer = _a.pic, canvasImg = _a.canvasImg, canvasBlock = _a.canvasBlock;
        var slider = this.createSlider();
        container.appendChild(refresh);
        container.appendChild(layer);
        container.appendChild(slider);
        return { canvasImg: canvasImg, canvasBlock: canvasBlock, view: container, slider: slider, layer: layer };
    };
    // 创建刷新容器
    SliderImg.prototype.createRefreshContainer = function () {
        var refresh = document.createElement("div");
        refresh.style.cssText = refreshCss;
        refresh.onclick = this.reset.bind(this);
        // 添加svg
        refresh.innerHTML =
            "<svg t=\"1637315258145\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\"\n                xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2420\" width=\"20\" height=\"20\">\n                <path\n                    d=\"M960 416V192l-73.056 73.056a447.712 447.712 0 0 0-373.6-201.088C265.92 63.968 65.312 264.544 65.312 512S265.92 960.032 513.344 960.032a448.064 448.064 0 0 0 415.232-279.488 38.368 38.368 0 1 0-71.136-28.896 371.36 371.36 0 0 1-344.096 231.584C308.32 883.232 142.112 717.024 142.112 512S308.32 140.768 513.344 140.768c132.448 0 251.936 70.08 318.016 179.84L736 416h224z\"\n                    p-id=\"2421\" fill=\"#8a8a8a\"></path>\n            </svg>";
        return refresh;
    };
    // 创建图层容器
    SliderImg.prototype.createLayerContainer = function () {
        var pic = document.createElement("div");
        pic.style.cssText = picCss;
        // 创建canvas
        var canvasImg = document.createElement("canvas");
        canvasImg.style.cssText = canvasImgCss;
        canvasImg.width = this.width;
        canvasImg.height = this.height;
        var canvasBlock = document.createElement("canvas");
        canvasBlock.style.cssText = canvasBlockCss;
        canvasBlock.width = this.width;
        canvasBlock.height = this.height;
        canvasBlock.style.left = "".concat(this.blockLeft, "px");
        pic.appendChild(canvasImg);
        pic.appendChild(canvasBlock);
        return { pic: pic, canvasImg: canvasImg, canvasBlock: canvasBlock };
    };
    // 创建工具栏
    SliderImg.prototype.createSlider = function () {
        var slider = document.createElement("div");
        slider.style.cssText = sliderCss;
        slider.style.height = "".concat(this.cuttingWH, "px");
        var tip = document.createElement("div");
        tip.innerText = '向右滑动完成验证';
        tip.style.cssText = tipCss;
        tip.id = this.sliderId;
        slider.appendChild(tip);
        var sliderBar = document.createElement("div");
        sliderBar.style.cssText = barCss;
        sliderBar.id = '123';
        sliderBar.style.width = "".concat(this.sliderLeft, "px");
        var sliderIcon = document.createElement("div");
        sliderIcon.ontouchstart = this.touchStart.bind(this);
        sliderIcon.ontouchmove = this.touchMove.bind(this);
        sliderIcon.ontouchend = this.touchEnd.bind(this);
        sliderIcon.style.cssText = sliderIconCss;
        sliderIcon.style.left = "".concat(this.sliderLeft, "px");
        sliderIcon.innerText = '>';
        this.sliderIcon = sliderIcon;
        this.sliderBar = sliderBar;
        slider.appendChild(sliderBar);
        slider.appendChild(sliderIcon);
        return slider;
    };
    // 切换滑块&拼图样式
    SliderImg.prototype.switchSlider = function () {
        if (!this.showText) {
            var tip = document.getElementById(this.sliderId);
            tip.innerText = '';
        }
        switch (this.slideState) {
            case 'active':
                this.sliderBar.style.cssText += activeCss;
                this.sliderIcon.style.cssText += sliderIconActiveCss;
                this.sliderIcon.innerText = '>';
                break;
            case 'success':
                this.sliderBar.style.cssText += successCss;
                this.sliderIcon.style.cssText += sliderIconSuccessCss;
                this.sliderIcon.innerText = '√';
                break;
            case 'fail':
                this.sliderBar.style.cssText += failCss;
                this.sliderIcon.style.cssText += sliderIconFailCss;
                this.sliderIcon.innerText = 'x';
                break;
            default:
                this.sliderIcon.innerText = '>';
                break;
        }
    };
    return SliderImg;
}());

var index = {
    RandomBlock: RandomBlock,
    Slider: Slider,
    TextClick: TextClick,
    RandomCalc: RandomCalc,
    SliderImg: SliderImg,
};

export { index as default };
