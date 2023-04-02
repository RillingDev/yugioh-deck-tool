import { fromByteArray, toByteArray } from "base64-js";

/**
 * Service handling text/byte array en-/decoding.
 */
export class EncodingService {
	readonly #textEncoder: TextEncoder = new TextEncoder();
	readonly #textDecoder: TextDecoder = new TextDecoder();

	/**
	 * @see TextEncoder#encode
	 */
	encodeText(text: string): Uint8Array {
		return this.#textEncoder.encode(text);
	}

	/**
	 * @see TextDecoder#decode
	 */
	decodeText(input: BufferSource): string {
		return this.#textDecoder.decode(input);
	}

	/**
	 * Encodes binary data to base64.
	 *
	 * @param input Input to encode.
	 */
	encodeBase64String(input: Uint8Array): string {
		return fromByteArray(input);
	}

	/**
	 * Decodes base64 to binary data.
	 *
	 * @param base64 Base64 to decode.
	 */
	decodeBase64String(base64: string): Uint8Array {
		return toByteArray(base64);
	}
}
