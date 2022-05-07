
import {
    verifyContainerCss,
    picCss,
    canvasImgCss,
    canvasBlockCss,
    sliderCss,
    tipCss,
    barCss,
    activeCss,
    successCss,
    failCss,
    sliderIconCss,
    sliderIconSuccessCss,
    sliderIconActiveCss,
    sliderIconFailCss,
    refreshCss,
} from "./style";

interface IOptions {
    container: HTMLElement;
    width: number;
    height: number;
    cuttingWH: number; // 裁剪canvas宽高
    accuracy: number; // 精度
    images: string[]; // 图片路径
}

type IState = 'success' | 'fail' | 'active' | '';

export default class SliderImg {

    callback: (result: boolean) => void;

    width: number;
    height: number;
    cuttingWH: number;
    accuracy: number;
    images: string[];

    canvasImg: HTMLCanvasElement;
    canvasBlock: HTMLCanvasElement;
    sliderIcon: HTMLElement = document.createElement("div");
    sliderBar: HTMLElement = document.createElement("div");

    // data属性
    bgImg: HTMLImageElement; // 背景图
    ctxImg: CanvasRenderingContext2D; // 背景画笔
    ctxBlock: CanvasRenderingContext2D; // 滑块画笔

    blockRect: { w: number, r: number, x: number, y: number } // 滑块宽、圆半径、坐标
    blockLeft: number = 0;

    startX: number = 0;
    endX: number = 0;

    sliderLeft: number = 0 // 拖动滑块的滑动距离
    slideState: IState = '' // success fail active
    timeIns: any;
    showText: boolean = true // 是否显示滑动提示
    isMouseDown: boolean = false

    sliderId: string = Date.now() + ''; // 滑块id

    constructor(options: IOptions, callback: (result: boolean) => void) {

        this.callback = callback;
        const {
            container,
            width = 320,
            height = 160,
            cuttingWH = 40,
            accuracy = 5,
            images = [],
        } = options;
        this.width = width;
        this.height = height;
        this.cuttingWH = cuttingWH;
        this.accuracy = accuracy;
        this.images = images;
        const { view, canvasImg, canvasBlock } = this.initView();

        this.canvasImg = canvasImg;
        this.canvasBlock = canvasBlock;

        this.blockRect = {
            w: this.cuttingWH + 2 * this.cuttingWH / 4,
            r: this.cuttingWH / 4,
            x: 0,
            y: 0
        }
        container.appendChild(view);
        this.ctxImg = <CanvasRenderingContext2D>canvasImg.getContext('2d');
        this.ctxBlock = <CanvasRenderingContext2D>canvasBlock.getContext('2d');

        this.bgImg = document.createElement("img");

        // 监听pc端mouse事件
        this.mouseEvent()

        this.drawBg();
    }

    // 绘制背景图
    drawBg() {
        if (this.images && this.images.length > 0) this.getImg();
        else {
            // canvas 添加背景色
            this.canvasImg.style.backgroundColor = '#E8E8E8';
            this.draw(this.ctxImg, 'fill');
            this.draw(this.ctxBlock, 'clip')
        }
    }

    getImg() {
        const img = document.createElement('img');
        const imagesLen = this.images.length;
        const randomIndex = Math.floor(Math.random() * imagesLen);
        img.crossOrigin = "Anonymous";
        img.src = this.images[randomIndex];
        this.bgImg = img;

        img.onload = () => {
            // console.log('图片加载完成')
            this.ctxImg.drawImage(this.bgImg, 0, 0, this.width, this.height);
            this.getBlockPostion()
            this.ctxBlock.drawImage(this.bgImg, 0, 0, this.width, this.height);

            const _yPos = this.blockRect.y - 2 * this.blockRect.r;
            const imageData = this.ctxBlock.getImageData(this.blockRect.x, _yPos, this.blockRect.w, this.blockRect.w + 1);
            this.canvasBlock.width = this.blockRect.w;
            this.ctxBlock.putImageData(imageData, 0, _yPos)
        }
        // console.log(this.bgImg)
    }
    getBlockPostion() {
        const xPos = Math.floor(this.width / 2 + Math.random() * (this.width / 2 - this.blockRect.w));
        const yPos = Math.floor(30 + Math.random() * (this.height - this.blockRect.w - 30));
        this.blockRect.x = xPos;
        this.blockRect.y = yPos;

        this.draw(this.ctxImg, 'fill');
        this.draw(this.ctxBlock, 'clip')

    }
    draw(ctx, operation) {
        const { r, x, y } = this.blockRect;
        const _w = this.cuttingWH;
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
    }
    // pc
    mouseEvent() {
        this.sliderIcon.onmousedown = (e) => {
            this.startX = e.pageX;
            this.showText = false;
            this.isMouseDown = true;

            this.switchSlider();
            document.onmousemove = this.mouseMove.bind(this);
            document.onmouseup = this.mouseUp.bind(this);
        }
    }

    mouseMove(e) {
        if (!this.isMouseDown) {
            return
        }
        this.endX = e.pageX - this.startX;
        // 禁止超出边界
        if (this.endX < 0 || this.endX > this.width - this.cuttingWH) {
            return
        }
        // 拖动的距离
        this.sliderLeft = this.endX;
        this.blockLeft = this.sliderLeft / (this.width - this.cuttingWH) * (this.width - this.blockRect.w);
        this.slideState = 'active';

        this.canvasBlock.style.left = `${this.blockLeft}px`;
        this.sliderIcon.style.left = `${this.sliderLeft}px`;
        this.sliderBar.style.width = `${this.sliderLeft}px`;

        this.switchSlider()
    }
    mouseUp(e) {
        document.onmousemove = null;
        document.onmouseup = null;
        if (!this.isMouseDown || this.startX === e.clientX) {
            return
        }
        this.isMouseDown = false;
        const isPass = this.verify();
        // console.log(isPass)
        if (isPass) {
            this.slideState = 'success';
            this.switchSlider();
        } else {
            this.slideState = 'fail';
            this.switchSlider();
            // 如果失败则1000毫秒后重置
            this.timeIns = setTimeout(() => {
                this.reset()
            }, 1000)
        }
    }
    // mobile
    touchStart(e) {
        this.startX = e.changedTouches[0].pageX;
        this.showText = false;
        this.switchSlider();
    }
    touchMove(e) {
        this.endX = e.changedTouches[0].pageX - this.startX;
        // 禁止超出边界
        if (this.endX < 0 || this.endX > this.width - this.cuttingWH) {
            return
        }
        // 拖动的距离
        this.sliderLeft = this.endX;
        this.blockLeft = this.sliderLeft / (this.width - this.cuttingWH) * (this.width - this.blockRect.w);
        this.slideState = 'active';

        this.canvasBlock.style.left = `${this.blockLeft}px`;
        this.sliderIcon.style.left = `${this.sliderLeft}px`;
        this.sliderBar.style.width = `${this.sliderLeft}px`;
        this.switchSlider()
    }
    touchEnd(e) {
        const isPass = this.verify()
        // console.log(isPass)
        if (isPass) {
            this.slideState = 'success';
            this.switchSlider();
        } else {
            this.slideState = 'fail';
            this.switchSlider();
            // 如果失败则1000毫秒后重置
            this.timeIns = setTimeout(() => {
                this.reset()
            }, 1000)
        }
    }
    // 判断精度
    verify(): boolean {
        // console.log(Math.abs(this.blockLeft - this.blockRect.x))
        const bool = Math.abs(this.blockLeft - this.blockRect.x) <= this.accuracy
        this.callback(bool)
        return bool
    }
    // 重置
    reset() {
        this.showText = true;
        this.slideState = '';
        this.sliderLeft = 0;
        this.blockLeft = 0;
        this.canvasBlock.width = this.width;
        this.ctxImg.clearRect(0, 0, this.width, this.height);
        this.ctxBlock.clearRect(0, 0, this.width, this.height);
        this.drawBg();

        this.canvasBlock.style.left = `${this.blockLeft}px`;
        this.sliderIcon.style.left = `${this.sliderLeft}px`;
        this.sliderBar.style.width = `${this.sliderLeft}px`;
        this.sliderBar.style.cssText = barCss;
        this.sliderIcon.style.cssText = sliderIconCss;
        const tip = <HTMLElement>document.getElementById(this.sliderId);
        tip.innerText = '向右滑动完成验证';
    }

    initView(): {
        canvasImg: HTMLCanvasElement,
        canvasBlock: HTMLCanvasElement,
        view: HTMLElement,
        slider: HTMLElement,
        layer: HTMLElement,
    } {
        // 创建容器
        const container = document.createElement("div");
        container.style.cssText = verifyContainerCss;
        container.style.width = `${this.width}px`;
        const refresh = this.createRefreshContainer();
        const { pic: layer, canvasImg, canvasBlock } = this.createLayerContainer();

        const slider = this.createSlider();
        container.appendChild(refresh);
        container.appendChild(layer);
        container.appendChild(slider);

        return { canvasImg, canvasBlock, view: container, slider, layer };
    }

    // 创建刷新容器
    createRefreshContainer(): HTMLElement {
        const refresh = document.createElement("div");
        refresh.style.cssText = refreshCss;
        refresh.onclick = this.reset.bind(this);
        // 添加svg
        refresh.innerHTML =
            `<svg t="1637315258145" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="2420" width="20" height="20">
                <path
                    d="M960 416V192l-73.056 73.056a447.712 447.712 0 0 0-373.6-201.088C265.92 63.968 65.312 264.544 65.312 512S265.92 960.032 513.344 960.032a448.064 448.064 0 0 0 415.232-279.488 38.368 38.368 0 1 0-71.136-28.896 371.36 371.36 0 0 1-344.096 231.584C308.32 883.232 142.112 717.024 142.112 512S308.32 140.768 513.344 140.768c132.448 0 251.936 70.08 318.016 179.84L736 416h224z"
                    p-id="2421" fill="#8a8a8a"></path>
            </svg>`
        return refresh
    }

    // 创建图层容器
    createLayerContainer(): { pic: HTMLElement, canvasImg: HTMLCanvasElement, canvasBlock: HTMLCanvasElement } {
        const pic = document.createElement("div");
        pic.style.cssText = picCss;
        // 创建canvas
        const canvasImg = document.createElement("canvas");
        canvasImg.style.cssText = canvasImgCss;
        canvasImg.width = this.width;
        canvasImg.height = this.height;

        const canvasBlock = document.createElement("canvas");
        canvasBlock.style.cssText = canvasBlockCss;
        canvasBlock.width = this.width;
        canvasBlock.height = this.height;
        canvasBlock.style.left = `${this.blockLeft}px`;

        pic.appendChild(canvasImg);
        pic.appendChild(canvasBlock);

        return { pic, canvasImg, canvasBlock };
    }

    // 创建工具栏
    createSlider(): HTMLElement {
        const slider = document.createElement("div");
        slider.style.cssText = sliderCss;
        slider.style.height = `${this.cuttingWH}px`;

        const tip = document.createElement("div");
        tip.innerText = '向右滑动完成验证';
        tip.style.cssText = tipCss;
        tip.id = this.sliderId;
        slider.appendChild(tip);

        const sliderBar = document.createElement("div");
        sliderBar.style.cssText = barCss;
        sliderBar.id = '123'
        sliderBar.style.width = `${this.sliderLeft}px`;

        const sliderIcon = document.createElement("div");
        sliderIcon.ontouchstart = this.touchStart.bind(this);
        sliderIcon.ontouchmove = this.touchMove.bind(this);
        sliderIcon.ontouchend = this.touchEnd.bind(this);
        sliderIcon.style.cssText = sliderIconCss;

        sliderIcon.style.left = `${this.sliderLeft}px`;
        sliderIcon.innerText = '>';

        this.sliderIcon = sliderIcon;
        this.sliderBar = sliderBar;

        slider.appendChild(sliderBar);
        slider.appendChild(sliderIcon);

        return slider
    }

    // 切换滑块&拼图样式
    switchSlider() {
        if (!this.showText) {
            const tip = <HTMLElement>document.getElementById(this.sliderId);
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
    }
}