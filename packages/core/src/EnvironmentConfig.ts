/**
 * Specifies the current environment the system is using.
 */
export enum Environment {
    /**
     * No special handling.
     */
    DEFAULT = "DEFAULT",

    /**
     * Enable functionality only available on ygoprodeck.com.
     */
    YGOPRODECK = "YGOPRODECK",
}

/**
 * Allows access to data on the current environment.
 */
export interface EnvironmentConfig {
    /**
     * Gets the current {@link Environment}.
     */
    getEnvironment: () => Environment;
}
