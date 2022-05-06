
// 容器样式
const containerCss =
    `user-select: none;
    position: relative;
    background-color: #E8E8E8;`
// 滑块样式
const sliderCss =
    `position: absolute;
    top: 0;
    left: 0;
    width: 36px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    cursor: pointer;
    font-family: "宋体";
    z-index: 1;
    font-weight: bold;
    color: #929292;`
// 文本样式
const textCss =
    `position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: #444;`
// 景色容器样式
const bgCss =
    `background-color: #BFBFBF;
    height: 100%;
    position: absolute;
    left: 0;`

interface IOptions {
    container: HTMLElement; // 容器
    success?: string; // 成功文案
    title?: string; // 默认展示文案
}

export default class Slider {

    callback: Function

    constructor(options: IOptions, callback: Function) {
        this.callback = callback
        // 初始化
        if (!options.title) {
            options.title = "滑动解锁"
        }
        if (!options.success) {
            options.success = "解锁成功"
        }

        this.init(options)
    }

    getMaterials(title: string) {
        // 创建容器
        const container = document.createElement('div');
        // 设置样式
        container.style.cssText = containerCss;
        // 创建滑块
        const slider = document.createElement('div');
        // 设置样式
        slider.style.cssText = sliderCss
        slider.innerText = '>>'
        // 创建滑块上的文本
        const titleDiv = document.createElement('div');
        // 设置样式
        titleDiv.style.cssText = textCss
        titleDiv.innerText = title
        // 创建动态背景色容器
        const bgDiv = document.createElement('div');
        // 设置样式
        bgDiv.style.cssText = bgCss
        // 组装容器
        container.appendChild(bgDiv);
        container.appendChild(slider);
        container.appendChild(titleDiv);
        return { container, slider, titleDiv, bgDiv }
    }

    init(c: IOptions) {
        const { container, slider, titleDiv, bgDiv } = this.getMaterials(c.title as string);
        // 设置容器宽高
        container.style.width = c.container.clientWidth + 'px';
        container.style.height = c.container.clientHeight + 'px';

        c.container.appendChild(container);

        let left, leftoffset;
        const px = container.offsetWidth - slider.offsetWidth
        slider.onmousedown = (event) => {
            const downEvent = <MouseEvent>window.event || event
            left = downEvent.clientX - slider.offsetLeft //鼠标按下时的位置

            document.onmousemove = (event) => { //鼠标移动

                const moveEvent = <MouseEvent>window.event || event
                leftoffset = moveEvent.clientX - left //鼠标移动的距离
                if (leftoffset < 0) {
                    leftoffset = 0
                } else if (leftoffset > px) {
                    leftoffset = px
                }
                slider.style.left = leftoffset + "px"
                // 变更bgDiv的宽度
                bgDiv.style.width = leftoffset + "px"
            }
            document.onmouseup = (event) => { //鼠标抬起
                const upEvent = <MouseEvent>window.event || event;
                document.onmousemove = null;
                document.onmouseup = null;

                leftoffset = upEvent.clientX - left;
                if (leftoffset < 0) {
                    leftoffset = 0;
                    titleDiv.innerHTML = c.title as string;
                    this.callback(false)
                } else if (px < leftoffset) {
                    leftoffset = px
                    titleDiv.innerHTML = c.success as string;
                    slider.innerHTML = '√';
                    slider.onmousedown = null;
                    this.callback(true)
                } else {
                    this.callback(false)
                    leftoffset = 0;
                    slider.style.transition = 'left .5s ease 0s';
                    bgDiv.style.width = "0";
                    bgDiv.style.transition = 'width .5s ease 0s';
                    // 监听动画结束
                    slider.addEventListener('transitionend', () => {
                        slider.style.transition = '';
                        bgDiv.style.transition = '';
                    })
                }
                slider.style.left = leftoffset + 'px';
            }
        }
    }
}