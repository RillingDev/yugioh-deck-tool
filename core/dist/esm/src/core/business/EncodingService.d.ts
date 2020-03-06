declare class EncodingService {
    private readonly textEncoder;
    private readonly textDecoder;
    constructor();
    encodeString(str: string): Uint8Array;
    decodeString(arr: Uint8Array): string;
    encodeUriSafeBase64String(arr: Uint8Array): string;
    decodeUriSafeBase64String(str: string): Uint8Array;
}
export { EncodingService };
