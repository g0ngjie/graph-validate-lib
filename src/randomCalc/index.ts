

type IOperator = '+' | '-';

interface IOptions {
    container: HTMLElement;
    width: number;
    height: number;
    range: number;
    operator: IOperator[];
}

export default class RandomCalc {

    callback: (result: number) => void;
    width: number;
    height: number;
    range: number;
    operator: IOperator[];

    num1: number = 0;
    num2: number = 0;
    symbol: IOperator = '+';
    result: number = 0; // 计算结果

    ctx: CanvasRenderingContext2D;

    constructor(options: IOptions, callback: (result: number) => void) {

        this.callback = callback;
        const { container, width = 320, height = 60, range = 100, operator = ['+', '-'] } = options
        this.width = width
        this.height = height
        this.range = range
        this.operator = operator

        // 创建画布
        const canvas = document.createElement('canvas')
        canvas.style.cssText = `display: block;`
        canvas.width = width
        canvas.height = height
        canvas.onclick = this.reset.bind(this)
        this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d')

        // 初始化视图
        const view = document.createElement('div')
        view.style.cssText = `overflow: hidden; user-select: none; width: ${this.width}px;`

        view.appendChild(canvas)
        container.appendChild(view)

        this.drawFormula();
    }

    // 绘制图形码
    drawFormula() {
        this.ctx.fillStyle = this.randomColor(180, 240);
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 绘制干扰线
        for (let j = 0; j < 3; j++) {
            this.ctx.strokeStyle = this.randomColor(40, 180)
            this.ctx.beginPath()
            this.ctx.moveTo(this.randomNum(0, this.width), this.randomNum(0, this.height))
            this.ctx.lineTo(this.randomNum(0, this.width), this.randomNum(0, this.height))
            this.ctx.stroke()
        }
        // 绘制干扰点
        for (let k = 0; k < 30; k++) {
            this.ctx.fillStyle = this.randomColor(0, 255)
            this.ctx.beginPath()
            this.ctx.arc(this.randomNum(0, this.width), this.randomNum(0, this.height), 1, 0, 2 * Math.PI)
            this.ctx.fill()
        }

        let formula = ''; // 公式字符串
        this.num1 = Math.floor(Math.random() * this.range);
        this.num2 = Math.floor(Math.random() * this.range);
        this.symbol = this.operator[Math.floor(Math.random() * 2)];
        if (this.symbol === '+') {
            formula = `${this.num1}+${this.num2}=?`
            this.result = this.num1 + this.num2;
        } else {
            if (this.num1 >= this.num2) {
                formula = `${this.num1}-${this.num2}=?`
            } else {
                formula = `${this.num2}-${this.num1}=?`
            }
            this.result = Math.abs(this.num1 - this.num2);
        }
        this.callback(this.result)

        for (let i = 0; i < formula.length; i++) {

            // 随机生成字体颜色
            this.ctx.fillStyle = this.randomColor(50, 160);
            // 随机生成字体大小(0.5 - 0.75)高的范围
            this.ctx.font = this.randomNum(this.height * 2 / 4, this.height * 3 / 4) + 'px SimHei';
            // 字体对齐位置
            this.ctx.textBaseline = 'top';

            let x = 20 + i * (this.width / formula.length);
            let y = this.randomNum(5, this.height / 4);
            this.ctx.fillText(formula[i], x, y);
        }

    }
    randomColor(min, max) {
        let r = this.randomNum(min, max)
        let g = this.randomNum(min, max)
        let b = this.randomNum(min, max)
        return 'rgb(' + r + ',' + g + ',' + b + ')'
    }

    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }

    reset() {
        this.result = 0;
        this.drawFormula();
    }

}