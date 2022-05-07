interface IOptions {
    container: HTMLElement;
    success?: string;
    title?: string;
}
export default class Slider {
    callback: (result: boolean) => void;
    constructor(options: IOptions, callback: (result: boolean) => void);
    getMaterials(title: string): {
        container: HTMLDivElement;
        slider: HTMLDivElement;
        titleDiv: HTMLDivElement;
        bgDiv: HTMLDivElement;
    };
    init(c: IOptions): void;
}
export {};
