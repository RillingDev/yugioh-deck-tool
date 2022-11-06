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
	 * @param useUriParamSafeAlphabet If an alphabet suitable for URI query parameters should be used. If this is enabled, this flag also has to be set when decoding.
	 */
	encodeBase64String(
		input: Uint8Array,
		useUriParamSafeAlphabet: boolean
	): string {
		let encoded = fromByteArray(input);
		if (useUriParamSafeAlphabet) {
			encoded = encoded
				.replace(/=/g, "~")
				.replace(/\+/g, "_")
				.replace(/\//g, "-");
		}
		return encoded;
	}

	/**
	 * Decodes base64 to binary data.
	 *
	 * @param base64 Base64 to decode.
	 * @param useUriParamSafeAlphabet If an alphabet suitable for URI query parameters was used for encoding.
	 */
	decodeBase64String(
		base64: string,
		useUriParamSafeAlphabet: boolean
	): Uint8Array {
		let encoded = base64;
		if (useUriParamSafeAlphabet) {
			encoded = encoded
				.replace(/~/g, "=")
				.replace(/_/g, "+")
				.replace(/-/g, "/");
		}
		return toByteArray(encoded);
	}
}
