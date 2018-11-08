import * as EventEmitter from "events";

export abstract class ConfigurationBase {

    constructor() {}

    protected validate(): void {}

    getUrl(apiKey: string): string {
        if (apiKey) {
            return "https://cdn.configcat.com/configuration-files/" + apiKey + "/config_v2.json";
        }

        throw new Error("Invalid project secret");
    }
}

export class AutoPollConfiguration extends ConfigurationBase {
    public pollIntervalSeconds: number;

    public maxInitWaitTimeSeconds: number;

    public configChanged: EventEmitter;

    public static readonly CONFIG_CHANGED_EVENT: string = "AutoPoll_EventChanged";

    constructor() {

        super();

        this.maxInitWaitTimeSeconds = 5;

        this.pollIntervalSeconds = 60;

        this.configChanged = new EventEmitter();
    }

    validate(): void {

        super.validate();

        if (!this.maxInitWaitTimeSeconds || this.maxInitWaitTimeSeconds < 1) {
            throw new Error("Invalid 'maxInitWaitTimeSeconds' value");
        }

        if (!this.pollIntervalSeconds || this.pollIntervalSeconds < 1) {
            throw new Error("Invalid 'pollIntervalSeconds' value");
        }
    }
}

export class ManualPollConfiguration extends ConfigurationBase {

    constructor() {

        super();
    }

    validate(): void {

        super.validate();
    }
}

export class LazyLoadConfiguration extends ConfigurationBase {

    public cacheTimeToLiveSeconds: number;

    constructor() {

        super();

        this.cacheTimeToLiveSeconds = 60;
    }

    validate(): void {

        super.validate();

        if (!this.cacheTimeToLiveSeconds || this.cacheTimeToLiveSeconds < 1) {
            throw new Error("Invalid 'cacheTimeToLiveSeconds' value. Value must be greater than zero.");
        }
    }
}
