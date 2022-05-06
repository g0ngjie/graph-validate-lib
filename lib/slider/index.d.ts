interface IOptions {
    container: HTMLElement;
    success?: string;
    title?: string;
}
export default class Slider {
    callback: Function;
    constructor(options: IOptions, callback: Function);
    getMaterials(title: string): {
        container: HTMLDivElement;
        slider: HTMLDivElement;
        titleDiv: HTMLDivElement;
        bgDiv: HTMLDivElement;
    };
    init(c: IOptions): void;
}
export {};
