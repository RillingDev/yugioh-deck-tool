import { name as getName } from "lightdash";

interface Logger {
	error: typeof console.error;
	warn: typeof console.warn;
	info: typeof console.info;
	debug: typeof console.debug;
}

const DEBUG = import.meta.env.MODE === "development";

export const getLogger = (consumer: unknown): Logger => {
	const name = getName(consumer);
	if (name == null) {
		throw new TypeError(
			`Cannot find name for consumer: '${String(consumer)}'`,
		);
	}
	return {
		error: (...args) => console.error(name, ...args),
		warn: (...args) => console.warn(name, ...args),
		info: (...args) => console.info(name, ...args),
		debug: (...args) => {
			if (DEBUG) {
				console.debug(name, ...args);
			}
		},
	};
};
