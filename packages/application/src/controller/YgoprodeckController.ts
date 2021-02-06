import type { Credentials } from "../../../core/src/main";
import { YGOPRODECK_TYPES, YgoprodeckService } from "../../../core/src/main";
import { inject, injectable } from "inversify";

declare global {
    interface Window {
        ygoprodeckUsername?: string;
        ygoprodeckToken?: string;
    }
}

@injectable()
export class YgoprodeckController {
    private readonly ygoprodeckService: YgoprodeckService;

    constructor(
        @inject(YGOPRODECK_TYPES.YgoprodeckService)
        ygoprodeckService: YgoprodeckService
    ) {
        this.ygoprodeckService = ygoprodeckService;
    }

    /**
     * Checks if ygoprodeck.com credentials are available.
     */
    public hasCredentials(): boolean {
        this.ygoprodeckService.validateEnv();
        return (
            window.ygoprodeckUsername != null && window.ygoprodeckToken != null
        );
    }

    /**
     * Retrieves ygoprodeck.com credentials.
     */
    public getCredentials(): Credentials {
        this.ygoprodeckService.validateEnv();
        if (!this.hasCredentials()) {
            throw new TypeError("Insufficient credentials available.");
        }
        return {
            username: window.ygoprodeckUsername!,
            token: window.ygoprodeckToken!,
        };
    }
}
