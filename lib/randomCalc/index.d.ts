declare type IOperator = '+' | '-';
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
    num1: number;
    num2: number;
    symbol: IOperator;
    result: number;
    ctx: CanvasRenderingContext2D;
    constructor(options: IOptions, callback: (result: number) => void);
    drawFormula(): void;
    randomColor(min: any, max: any): string;
    randomNum(min: any, max: any): number;
    reset(): void;
}
export {};
