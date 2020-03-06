declare class CompressionService {
    deflate(arr: Uint8Array | number[]): Uint8Array;
    inflate(arr: Uint8Array | number[]): Uint8Array;
    inflateString(str: string): string;
}
export { CompressionService };
