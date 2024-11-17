import type {Logger} from "loglevel";
import {getLogger as getLoglevelLogger, levels} from "loglevel";
import {DEBUG} from "./mode";
import {name as getName} from "lightdash";

export const getLogger = (consumer: unknown): Logger => {
	const name = getName(consumer);
	if (name == null) {
		throw new TypeError(
			`Cannot find name for consumer: '${String(consumer)}'`,
		);
	}
	const logger = getLoglevelLogger(name);
	logger.setLevel(DEBUG ? levels.DEBUG : levels.WARN);
	return logger;
};
