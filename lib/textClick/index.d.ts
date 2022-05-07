interface IOptions {
    container: HTMLElement;
    width?: number;
    height?: number;
    fontStr?: string;
    fontNum?: number;
    checkNum?: number;
    accuracy?: number;
    images?: string[];
}
declare type IState = "success" | "fail" | "active" | '';
export default class TextClick {
    callback: (result: boolean) => void;
    bgImg: HTMLImageElement;
    ctx: CanvasRenderingContext2D;
    fontArr: any[];
    tips: any[];
    pointer: {
        x: number;
        y: number;
    }[];
    state: IState;
    timeIns: any;
    width: number;
    height: number;
    images: string[];
    fontStr: string;
    fontNum: number;
    checkNum: number;
    accuracy: number;
    toolbar: HTMLElement;
    pic: HTMLElement;
    canvas: HTMLCanvasElement;
    constructor(options: IOptions, callback: (result: boolean) => void);
    drawBg(): void;
    getImg(): void;
    draw(): void;
    getRandomCharacter(fontStr: string): any;
    randomColor(min: any, max: any): string;
    randomNum(min: any, max: any): number;
    createPointer(e: any): void;
    verify(): boolean;
    reset(): void;
    initView(): {
        canvas: HTMLCanvasElement;
        view: HTMLElement;
        toolbar: HTMLElement;
        layer: HTMLElement;
    };
    createRefreshContainer(): HTMLElement;
    createLayerContainer(): {
        pic: HTMLElement;
        canvas: HTMLCanvasElement;
    };
    createToolbar(): HTMLElement;
    addCheckIcon(): void;
    addTips(): void;
}
export {};
