import type { Logger } from "loglevel";
import { getLogger as getLoglevelLogger, levels } from "loglevel";
import { DEVELOPMENT_MODE } from "./mode";
import { name as getName } from "lightdash";

const getLogger = (consumer: unknown): Logger => {
    const name = getName(consumer);
    if (name == null) {
        throw new TypeError(
            `Cannot find name for consumer: '${String(consumer)}'`
        );
    }
    const logger = getLoglevelLogger(name);
    logger.setLevel(DEVELOPMENT_MODE ? levels.DEBUG : levels.WARN);
    return logger;
};

export { getLogger };
