// 获取元素
let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")

// 点击事件
canvas.onclick = function () {
    // 清屏
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw()
}

// 随机一个0 - 255的数
function randomNum() {
    return Math.floor(Math.random() * 255)
}

// 随机颜色
function ranColor() {
    let r = randomNum()
    let g = randomNum()
    let b = randomNum()
    return `rgb(${r}, ${g}, ${b})`
}

// 随机字符
function randomStr(len = 4) {
    const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let res = "";
    for (let i = 0; i < len; i++) {
        let index = Math.floor(Math.random() * str.length);
        res += str[index];
    }
    return res;
}

function draw() {
    ctx.strokeStyle = ranColor()

    // 干扰线
    for (let i = 0; i < 10; i++) {
        ctx.beginPath()
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.strokeStyle = ranColor()
        ctx.stroke()
    }

    // 干扰散点
    for (let j = 0; j < 20; j++) {
        ctx.beginPath()
        let x = Math.random() * 200;
        let y = Math.random() * 70;
        ctx.arc(x, y, 1, 0, Math.PI * 2, true)
        ctx.fillStyle = ranColor()
        ctx.fill();
    }

    for (let index = 0; index < 4; index++) {
        ctx.save();

        let x = 10 + index * 20;
        let y = Math.random() * 20 + 20;

        ctx.translate(x, y);

        // num = Math.ceil(Math.random() * 9);
        num = randomStr(1);
        ctx.strokeStyle = ranColor();
        ctx.font = "italic 50px 'Microsoft YaHei'";
        ctx.strokeText(num, x, y)
        // ctx.strokeText(num, Math.random() * canvas.width / 2, y)
        // ctx.fillText(num, x, y)

        ctx.restore();
    }
}

draw()