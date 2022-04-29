var RandomBlock = /** @class */ (function () {
    function RandomBlock(container) {
        var _this = this;
        // 初始化
        // 给到一个div容器
        // 添加canvas
        var canvas = document.createElement('canvas');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        container.appendChild(canvas);
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
        var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < len; i++) {
            result += str[Math.floor(Math.random() * str.length)];
        }
        return result;
    };
    // 绘图
    RandomBlock.prototype.draw = function (ctx, width, height) {
        ctx.strokeStyle = this.randomRgb();
        // 干扰线
        for (var i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.lineTo(Math.random() * width, Math.random() * height);
            ctx.strokeStyle = this.randomRgb();
            ctx.stroke();
        }
        // 干扰散点
        for (var j = 0; j < 20; j++) {
            ctx.beginPath();
            var x = Math.random() * 200;
            var y = Math.random() * 70;
            ctx.arc(x, y, 1, 0, Math.PI * 2, true);
            ctx.fillStyle = this.randomRgb();
            ctx.fill();
        }
        for (var index = 0; index < 4; index++) {
            ctx.save();
            var x = 10 + index * 20;
            var y = Math.random() * 20 + 20;
            ctx.translate(x, y);
            // num = Math.ceil(Math.random() * 9);
            var rds = this.randomChar(1);
            ctx.strokeStyle = this.randomRgb();
            ctx.font = "italic 50px 'Microsoft YaHei'";
            ctx.strokeText(rds, x, y);
            // ctx.strokeText(num, Math.random() * canvas.width / 2, y)
            // ctx.fillText(num, x, y)
            ctx.restore();
        }
    };
    return RandomBlock;
}());

var index = {
    randomBlock: RandomBlock
};

export { index as default };
