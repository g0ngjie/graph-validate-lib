

export default class RandomBlock {

    constructor(
        container: HTMLElement
    ) {
        // 初始化
        // 给到一个div容器
        // 添加canvas
        const canvas = document.createElement('canvas');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        container.appendChild(canvas);
        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
        // 点击
        canvas.onclick = () => this.onClick(ctx as CanvasRenderingContext2D, canvas.width, canvas.height)
        // 绘图
        this.draw(ctx as CanvasRenderingContext2D, canvas.width, canvas.height)
    }

    // 点击事件
    private onClick(ctx: CanvasRenderingContext2D, width: number, height: number) {
        // 清屏
        ctx.clearRect(0, 0, width, height)
        this.draw(ctx, width, height)
    }

    // 随机颜色
    private randomRgb() {
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
    }

    // 随机字符
    private randomChar(len: number = 4) {
        let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < len; i++) {
            result += str[Math.floor(Math.random() * str.length)];
        }
        return result;
    }

    // 绘图
    private draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
        ctx.strokeStyle = this.randomRgb()

        // 干扰线
        for (let i = 0; i < 10; i++) {
            ctx.beginPath()
            ctx.moveTo(Math.random() * width, Math.random() * height)
            ctx.lineTo(Math.random() * width, Math.random() * height)
            ctx.strokeStyle = this.randomRgb()
            ctx.stroke()
        }

        // 干扰散点
        for (let j = 0; j < 20; j++) {
            ctx.beginPath()
            let x = Math.random() * 200;
            let y = Math.random() * 70;
            ctx.arc(x, y, 1, 0, Math.PI * 2, true)
            ctx.fillStyle = this.randomRgb()
            ctx.fill();
        }

        for (let index = 0; index < 4; index++) {
            ctx.save();

            let x = 10 + index * 20;
            let y = Math.random() * 20 + 20;

            ctx.translate(x, y);

            // num = Math.ceil(Math.random() * 9);
            const rds = this.randomChar(1);
            ctx.strokeStyle = this.randomRgb();
            ctx.font = "italic 50px 'Microsoft YaHei'";
            ctx.strokeText(rds, x, y)
            // ctx.strokeText(num, Math.random() * canvas.width / 2, y)
            // ctx.fillText(num, x, y)

            ctx.restore();
        }
    }

}