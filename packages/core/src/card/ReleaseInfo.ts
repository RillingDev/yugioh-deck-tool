import type { Format } from "./format/Format";

/**
 * Stores UNIX milliseconds timestamps for when a card was released. May be null if a card was not released in TCG or OCG.
 */
export interface ReleaseInfo {
	readonly [Format.TCG]: number | null;
	readonly [Format.OCG]: number | null;
}
