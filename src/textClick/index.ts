import {
    verifyContainerCss,
    picCss,
    canvasCss,
    pointerCss,
    pointerICss,
    toolbarCss,
    toolbarActiveCss,
    toolbarSuccessCss,
    toolbarFailCss,
    refreshCss
} from "./style";

interface IOptions {
    container: HTMLElement; // 容器
    width?: number; // 宽度
    height?: number; // 高度
    fontStr?: string; // 字符串
    fontNum?: number; // 字符数量
    checkNum?: number; // 校验数量
    accuracy?: number; // 精度
    images?: string[]; // 图片URL
}

type IState = "success" | "fail" | "active" | ''

export default class TextClick {

    callback: (result: boolean) => void
    bgImg: HTMLImageElement; // 背景图
    ctx: CanvasRenderingContext2D; // 背景画笔
    fontArr: any[] = []; // 显示的字符
    tips: any[] = []; // 提示文字
    pointer: { x: number, y: number }[] = []; // 点击序号
    state: IState = '' // success fail active
    timeIns: any;

    width: number;
    height: number;
    images: string[] = [];
    fontStr: string;
    fontNum: number;
    checkNum: number;
    accuracy: number;

    toolbar: HTMLElement;
    pic: HTMLElement;
    canvas: HTMLCanvasElement;

    constructor(options: IOptions, callback: (result: boolean) => void) {
        this.callback = callback

        const {
            container,
            width = 320,
            height = 160,
            images = [],
            fontStr = '1234567890',
            fontNum = 5,
            checkNum = 3,
            accuracy = 15,
        } = options

        this.width = width;
        this.height = height;
        this.images = images;
        this.fontStr = fontStr;
        this.fontNum = fontNum;
        this.checkNum = checkNum;
        this.accuracy = accuracy;

        const { view, canvas, toolbar, layer } = this.initView();
        canvas.width = width;
        canvas.height = height;
        this.toolbar = toolbar;
        this.pic = layer
        this.canvas = canvas;

        container.appendChild(view);

        this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

        this.bgImg = document.createElement("img");

        this.drawBg()
    }

    // 绘制背景图
    drawBg() {
        if (this.images && this.images.length > 0) this.getImg();
        else {
            // canvas 添加背景色
            this.canvas.style.backgroundColor = '#E8E8E8';
            this.draw();
        }
    }

    getImg() {
        // const img = document.createElement('img');
        const imagesLen = this.images.length;
        const randomIndex = Math.floor(Math.random() * imagesLen);
        this.bgImg.crossOrigin = "Anonymous";
        this.bgImg.src = this.images[randomIndex];
        // this.bgImg = img;

        this.bgImg.onload = () => {
            // console.log('图片加载完成')
            this.draw();
        }
        // console.log(this.bgImg)
    }

    draw() {
        // 绘制背景图
        this.ctx.drawImage(this.bgImg, 0, 0, this.width, this.height);


        for (let i = 0; i < this.fontNum; i++) {
            const character = this.getRandomCharacter(this.fontStr);
            // console.log(character)
            const fontSize = this.randomNum(20, this.height * 1 / 4);
            const fontWeight = Math.random() > 0.5 ? 'bold' : 'normal';
            const fontStyle = Math.random() > 0.5 ? 'italic' : 'normal';
            const fontFamily = Math.random() > 0.5 ? 'sans-serif' : 'serif'
            const x = this.width / this.fontNum * i + 10;
            const y = Math.random() * (this.height - fontSize);

            this.ctx.fillStyle = this.randomColor(0, 255);
            this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(character, x, y);

            this.fontArr.push({
                character,
                x,
                y
            })
        }
        // console.log(this.fontArr)

        for (let i = 0; i < this.checkNum; i++) {
            const randomIndex = Math.floor(Math.random() * this.fontArr.length);
            const character = this.fontArr.splice(randomIndex, 1)[0];
            this.tips.push(character);
        }
        this.addTips()
    }
    // 获取随机字符
    getRandomCharacter(fontStr: string) {
        const fontStrLen = fontStr.length;
        const randomIndex = Math.floor(Math.random() * fontStrLen);
        const character = fontStr.charAt(randomIndex);

        // debugger
        const isSome = this.fontArr.some(item => {
            return item.character === character;
        })
        if (isSome) {
            // console.log(`>>>${character}已存在>>>`)
            return this.getRandomCharacter(fontStr);
        } else {
            return character;
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
    createPointer(e) {
        const x = e.offsetX - 15;
        const y = e.offsetY - 15;

        if (this.pointer.length < this.tips.length) {
            this.pointer.push({ x, y });
            this.state = 'active'
            this.addCheckIcon()
        }
        if (this.pointer.length === this.tips.length) {
            const isPass = this.verify();
            if (isPass) {
                this.state = 'success';
            } else {
                this.state = 'fail';
                // 如果失败则1000毫秒后重置
                this.timeIns = setTimeout(() => {
                    this.reset()
                }, 1000)
            }
        }
        this.addTips()
    }
    // 判断精度
    verify() {
        // console.log("验证")
        const result = this.pointer.every((item, index) => {
            const _left = item.x > this.tips[index].x - this.accuracy;
            const _right = item.x < this.tips[index].x + this.accuracy;
            const _top = item.y > this.tips[index].y - this.accuracy;
            const _bottom = item.y < this.tips[index].y + this.accuracy;
            return _left && _right && _top && _bottom;
        })
        // console.log(result)
        this.callback(result)
        return result;
    }
    // 重置
    reset() {
        this.fontArr = [];
        this.tips = [];
        this.pointer = [];
        this.state = '';
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawBg();
        // 清理pic
        this.pic.innerHTML = '';
        this.pic.appendChild(this.canvas);
    }


    initView(): {
        canvas: HTMLCanvasElement,
        view: HTMLElement,
        toolbar: HTMLElement,
        layer: HTMLElement,
    } {
        // 创建容器
        const container = document.createElement("div");
        container.style.cssText = verifyContainerCss;
        container.style.width = `${this.width}px`;
        const refresh = this.createRefreshContainer();
        const { pic: layer, canvas } = this.createLayerContainer();

        const toolbar = this.createToolbar();
        container.appendChild(refresh);
        container.appendChild(layer);
        container.appendChild(toolbar);

        return { canvas, view: container, toolbar, layer };
    }

    // 创建刷新容器
    createRefreshContainer(): HTMLElement {
        const refresh = document.createElement("div");
        refresh.style.cssText = refreshCss;
        refresh.onclick = this.reset.bind(this);
        // 添加svg
        refresh.innerHTML = `<svg t="1637315258145" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2420" width="20" height="20"><path d="M960 416V192l-73.056 73.056a447.712 447.712 0 0 0-373.6-201.088C265.92 63.968 65.312 264.544 65.312 512S265.92 960.032 513.344 960.032a448.064 448.064 0 0 0 415.232-279.488 38.368 38.368 0 1 0-71.136-28.896 371.36 371.36 0 0 1-344.096 231.584C308.32 883.232 142.112 717.024 142.112 512S308.32 140.768 513.344 140.768c132.448 0 251.936 70.08 318.016 179.84L736 416h224z" p-id="2421" fill="#8a8a8a"></path></svg>`
        return refresh
    }

    // 创建图层容器
    createLayerContainer(): { pic: HTMLElement, canvas: HTMLCanvasElement } {
        const pic = document.createElement("div");
        pic.style.cssText = picCss;
        // 创建canvas
        const canvas = document.createElement("canvas");
        canvas.style.cssText = canvasCss;

        canvas.onclick = (e) => this.createPointer(e);

        pic.appendChild(canvas);

        return { pic, canvas };
    }

    // 创建工具栏
    createToolbar(): HTMLElement {
        const toolbar = document.createElement("div");
        toolbar.style.cssText = toolbarCss;
        return toolbar
    }

    // 添加点选Icon
    addCheckIcon() {
        // 创建指示物
        for (let i = 0; i < this.pointer.length; i++) {
            const { x, y } = this.pointer[i];
            const pointerDiv = document.createElement("div");
            pointerDiv.style.cssText = pointerCss;
            pointerDiv.style.left = `${x}px`;
            pointerDiv.style.top = `${y}px`;
            // 创建i标签
            const pointerICon = document.createElement("i");
            pointerICon.style.cssText = pointerICss;
            pointerICon.innerText = `${i + 1}`;
            pointerDiv.appendChild(pointerICon);
            this.pic.appendChild(pointerDiv);
        }
    }

    // 添加提示语
    addTips() {
        // 清理toolbar下元素
        this.toolbar.innerHTML = '';
        switch (this.state) {
            case 'active':
                this.toolbar.style.cssText += toolbarActiveCss;
                // 创建默认文案
                const defaultP = document.createElement("p");
                const spanStart = document.createElement("span");
                spanStart.innerText = "请顺序点击【"
                defaultP.appendChild(spanStart);
                for (let i = 0; i < this.tips.length; i++) {
                    const tip = this.tips[i];
                    const span = document.createElement("span");
                    span.innerText = tip.character;
                    defaultP.appendChild(span);
                }
                const spanEnd = document.createElement("span");
                spanEnd.innerText = "】";
                defaultP.appendChild(spanEnd);
                this.toolbar.appendChild(defaultP);
                break;
            case 'success':
                this.toolbar.style.cssText += toolbarSuccessCss;
                // 创建success文案
                const successP = document.createElement("p");
                successP.innerText = "验证通过";
                this.toolbar.appendChild(successP);
                break;
            case 'fail':
                this.toolbar.style.cssText += toolbarFailCss;
                // 创建fail文案
                const failP = document.createElement("p");
                failP.innerText = "验证失败";
                this.toolbar.appendChild(failP);
                break;
            default:
                this.toolbar.style.cssText = toolbarCss;;
                // 创建默认文案
                const defaultP2 = document.createElement("p");
                const spanStart2 = document.createElement("span");
                spanStart2.innerText = "请顺序点击【"
                defaultP2.appendChild(spanStart2);
                for (let i = 0; i < this.tips.length; i++) {
                    const tip = this.tips[i];
                    const span = document.createElement("span");
                    span.innerText = tip.character;
                    defaultP2.appendChild(span);
                }
                const spanEnd2 = document.createElement("span");
                spanEnd2.innerText = "】";
                defaultP2.appendChild(spanEnd2);
                this.toolbar.appendChild(defaultP2);
                break;
        }
    }
}