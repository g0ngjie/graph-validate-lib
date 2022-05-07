interface IOptions {
    container: HTMLElement;
    width: number;
    height: number;
    cuttingWH: number;
    accuracy: number;
    images: string[];
}
declare type IState = 'success' | 'fail' | 'active' | '';
export default class SliderImg {
    callback: (result: boolean) => void;
    width: number;
    height: number;
    cuttingWH: number;
    accuracy: number;
    images: string[];
    canvasImg: HTMLCanvasElement;
    canvasBlock: HTMLCanvasElement;
    sliderIcon: HTMLElement;
    sliderBar: HTMLElement;
    bgImg: HTMLImageElement;
    ctxImg: CanvasRenderingContext2D;
    ctxBlock: CanvasRenderingContext2D;
    blockRect: {
        w: number;
        r: number;
        x: number;
        y: number;
    };
    blockLeft: number;
    startX: number;
    endX: number;
    sliderLeft: number;
    slideState: IState;
    timeIns: any;
    showText: boolean;
    isMouseDown: boolean;
    sliderId: string;
    constructor(options: IOptions, callback: (result: boolean) => void);
    drawBg(): void;
    getImg(): void;
    getBlockPostion(): void;
    draw(ctx: any, operation: any): void;
    mouseEvent(): void;
    mouseMove(e: any): void;
    mouseUp(e: any): void;
    touchStart(e: any): void;
    touchMove(e: any): void;
    touchEnd(e: any): void;
    verify(): boolean;
    reset(): void;
    initView(): {
        canvasImg: HTMLCanvasElement;
        canvasBlock: HTMLCanvasElement;
        view: HTMLElement;
        slider: HTMLElement;
        layer: HTMLElement;
    };
    createRefreshContainer(): HTMLElement;
    createLayerContainer(): {
        pic: HTMLElement;
        canvasImg: HTMLCanvasElement;
        canvasBlock: HTMLCanvasElement;
    };
    createSlider(): HTMLElement;
    switchSlider(): void;
}
export {};
