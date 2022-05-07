(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.lib = factory());
})(this, (function () { 'use strict';

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

    var verifyContainerCss = "margin: 20px auto;\n    position: relative;\n    overflow: hidden;\n    user-select:none;";
    var picCss = "position: relative;";
    var canvasCss = "display: block;";
    var pointerCss = "background: #1abd6c;\n    border-radius: 50%;\n    padding: 10px;\n    position: absolute;";
    var pointerICss = "color: #fff;\n    font-style: normal;\n    font-size: 12px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    position: absolute;\n    left: 0;\n    top: 0;\n    right: 0;\n    bottom: 0;";
    var toolbarCss = "width: 100%;\n    height: 40px;\n    border: 1px solid #e4e4e4;\n    background: #f7f7f7;\n    color: #666;\n    font-size: 14px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    position: relative;";
    var toolbarActiveCss = "color: #fff;\n    background: #1991FA;\n    border: 1px solid #1991FA;";
    var toolbarSuccessCss = "color: #fff;\n    background: #52CCBA;\n    border: 1px solid #52CCBA;";
    var toolbarFailCss = "color: #fff;\n    background: #f57a7a;\n    border: 1px solid #f57a7a;";
    var refreshCss = "display: flex;\n    position: absolute;\n    right: 10px;\n    top: 10px;\n    z-index: 2;\n    cursor: pointer;";

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
            container.style.cssText = verifyContainerCss;
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
            refresh.style.cssText = refreshCss;
            refresh.onclick = this.reset.bind(this);
            // 添加svg
            refresh.innerHTML = "<svg t=\"1637315258145\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2420\" width=\"20\" height=\"20\"><path d=\"M960 416V192l-73.056 73.056a447.712 447.712 0 0 0-373.6-201.088C265.92 63.968 65.312 264.544 65.312 512S265.92 960.032 513.344 960.032a448.064 448.064 0 0 0 415.232-279.488 38.368 38.368 0 1 0-71.136-28.896 371.36 371.36 0 0 1-344.096 231.584C308.32 883.232 142.112 717.024 142.112 512S308.32 140.768 513.344 140.768c132.448 0 251.936 70.08 318.016 179.84L736 416h224z\" p-id=\"2421\" fill=\"#8a8a8a\"></path></svg>";
            return refresh;
        };
        // 创建图层容器
        TextClick.prototype.createLayerContainer = function () {
            var _this = this;
            var pic = document.createElement("div");
            pic.style.cssText = picCss;
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

    var index = {
        RandomBlock: RandomBlock,
        Slider: Slider,
        TextClick: TextClick
    };

    return index;

}));
