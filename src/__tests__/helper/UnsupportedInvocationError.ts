/**
 * Helper to throw if mock invocations are invalid.
 */
export class UnsupportedInvocationError extends Error {
	constructor() {
		super("Unsupported invocation.");
		this.name = "UnsupportedInvocationError";
	}
}
