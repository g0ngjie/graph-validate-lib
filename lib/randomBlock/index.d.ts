interface IOptions {
    container: HTMLElement;
    line?: boolean;
    point?: boolean;
    fill?: boolean;
    fontSize?: number;
    charNum?: number;
    factor?: string;
}
export default class RandomBlock {
    callback: (randomStr: string) => void;
    private isLine;
    private isPoint;
    private isFill;
    private fontSize;
    private charNum;
    private factorStr;
    constructor(options: IOptions, callback: (randomStr: string) => void);
    private onClick;
    private randomRgb;
    private randomChar;
    private draw;
}
export {};
