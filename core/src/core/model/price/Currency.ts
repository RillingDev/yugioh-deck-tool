interface Currency {
    readonly name: string;
    readonly locale: string;
    readonly id: string;
    readonly val: number;
    readonly fractionDigits: number;
}

export { Currency };
