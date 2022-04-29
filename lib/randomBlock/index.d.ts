interface IOptions {
    container: HTMLElement;
    line?: boolean;
    point?: boolean;
    fill?: boolean;
    fontSize?: number;
    charNum?: number;
}
export default class RandomBlock {
    onChange: Function;
    private isLine;
    private isPoint;
    private isFill;
    private fontSize;
    private charNum;
    constructor(options: IOptions, onChange: Function);
    private onClick;
    private randomRgb;
    private randomChar;
    private draw;
}
export {};
