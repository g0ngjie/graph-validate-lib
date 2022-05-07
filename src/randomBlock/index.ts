
interface IOptions {
    container: HTMLElement;
    // 干扰线
    line?: boolean;
    // 噪点
    point?: boolean;
    // 字体填充
    fill?: boolean;
    // 字体大小
    fontSize?: number;
    // 字符数量
    charNum?: number;
    // 随机因子
    factor?: string;
}

export default class RandomBlock {

    callback: (randomStr: string) => void
    private isLine: boolean
    private isPoint: boolean
    private isFill: boolean
    private fontSize: number
    private charNum: number
    private factorStr: string

    constructor(
        options: IOptions,
        callback: (randomStr: string) => void
    ) {
        this.callback = callback
        this.isLine = options.line as boolean
        this.isPoint = options.point as boolean
        this.isFill = options.fill as boolean
        this.fontSize = options.fontSize as number || 50
        this.charNum = options.charNum as number || 4
        this.factorStr = options.factor as string || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        // 初始化
        // 给到一个div容器
        // 添加canvas
        const canvas = document.createElement('canvas');
        canvas.width = options.container.clientWidth;
        canvas.height = options.container.clientHeight;
        options.container.appendChild(canvas);
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
        let result = '';
        for (let i = 0; i < len; i++) {
            result += this.factorStr[Math.floor(Math.random() * this.factorStr.length)];
        }
        return result;
    }

    // 绘图
    private draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
        ctx.strokeStyle = this.randomRgb()

        if (this.isLine) {
            // 干扰线
            for (let i = 0; i < 10; i++) {
                ctx.beginPath()
                ctx.moveTo(Math.random() * width, Math.random() * height)
                ctx.lineTo(Math.random() * width, Math.random() * height)
                ctx.strokeStyle = this.randomRgb()
                ctx.stroke()
            }
        }

        if (this.isPoint) {
            // 干扰散点
            for (let j = 0; j < 20; j++) {
                ctx.beginPath()
                let x = Math.random() * width;
                let y = Math.random() * height;
                ctx.arc(x, y, 1, 0, Math.PI * 2, true)
                ctx.fillStyle = this.randomRgb()
                ctx.fill();
            }
        }

        let randomStr = '';
        for (let index = 0; index < this.charNum; index++) {
            ctx.save();

            let x = width / this.charNum * (index) / 2;
            let y = Math.random() * height / 4 + height / 4;

            ctx.translate(x, y);

            const rds = this.randomChar(1);
            randomStr += rds;
            ctx.font = `italic ${this.fontSize}px 'Microsoft YaHei'`;

            if (this.isFill) {
                ctx.fillStyle = this.randomRgb()
                ctx.fillText(rds, x, y)
            }
            else {
                ctx.strokeStyle = this.randomRgb();
                ctx.strokeText(rds, x, y)
            }

            ctx.restore();
        }

        this.callback(randomStr)
    }

}