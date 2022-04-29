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

    var index = {
        randomBlock: RandomBlock
    };

    return index;

}));
