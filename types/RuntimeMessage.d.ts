declare interface RuntimeMessage {
    id?: any;
    x?: 'left' | 'right';
    y?: 'top' | 'bottom';
    color?: string;
    mode?: 'multi-line' | 'vertical' | 'single';
    timeout?: number;
    html: string;
}
