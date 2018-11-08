import { ProjectConfig } from "./ProjectConfigService";
import * as sha1 from "js-sha1";

export interface IRolloutEvaluator {
    Evaluate(config: ProjectConfig, key: string, defaultValue: any, User: User): any;
}

/** Object for variation evaluation */
export class User {

    constructor(identifier: string) {
        this.identifier = identifier;
    }

    /** Unique identifier for the User or Session. e.g. Email address, Primary key, Session Id */
    identifier: string;

    /** Optional parameter for easier targeting rule definitions */
    email: string;

    /** Optional parameter for easier targeting rule definitions */
    country: string;

    /** Optional dictionary for custom attributes of the User for advanced targeting rule definitions. e.g. User role, Subscription type */
    custom: { [key: string]: string } = {};
}

export class RolloutEvaluator implements IRolloutEvaluator {

    constructor() {}
    
    Evaluate(config: ProjectConfig, key: string, defaultValue: any, User: User): any {

        if (!config || !config.JSONConfig) {

            return defaultValue;
        }

        let json: any = JSON.parse(config.JSONConfig);

        if (!json[key]) {

            return defaultValue;
        }

        let result: any;

        if (User) {

            result = this.EvaluateRules(json[key].RolloutRules, User);

            if (result == null) {

                result = this.EvaluateVariations(json[key].RolloutPercentageItems, key, User);
            }
        }

        return result == null ? json[key].Value : result;
    }

    private EvaluateRules(rolloutRules: any, User: User): any {

        if (rolloutRules && rolloutRules.length > 0) {

            for (let i: number = 0; i < rolloutRules.length; i++) {

                let rule: any = rolloutRules[i];

                let ca: string = this.GetUserAttribute(User, rule.ComparisonAttribute);

                switch (rule.Comparator) {
                    case 0: // in

                        let cvs: string[] = rule.ComparisonValue.split(",");

                        for (let ci: number = 0; ci < cvs.length; ci++) {

                            if (cvs[ci].trim() === ca) {
                                return rule.Value;
                            }
                        }

                        break;

                    case 1: // notIn

                        if (!rule.ComparisonValue.split(",").some(e => {
                            if (e.trim() === ca) {
                                return true;
                            }

                            return false;
                        })) {

                            return rule.Value;
                        }

                        break;

                    case 2: // contains

                        if (ca.search(rule.ComparisonValue) !== -1) {
                            return rule.Value;
                        }

                        break;

                    case 3: // not contains

                        if (ca.search(rule.ComparisonValue) === -1) {
                            return rule.Value;
                        }

                        break;

                    default:
                        break;
                }
            }
        }

        return null;
    }

    private EvaluateVariations(rolloutPercentageItems: any, key: string, User: User, ro?: number): any {

        if (rolloutPercentageItems && rolloutPercentageItems.length > 0) {

            let hashCandidate: string = key + User.identifier;
            let hashValue: any = sha1(hashCandidate).substring(0, 12);
            let hashScale: number = parseInt(hashValue, 16) % 100;
            let bucket: number = 0;

            for (let i: number = 0; i < rolloutPercentageItems.length; i++) {
                const variation: any = rolloutPercentageItems[i];
                bucket += +variation.Percentage;

                if (hashScale < bucket) {
                    return variation.Value;
                }
            }
        }

        return null;
    }

    private GetUserAttribute(User: User, attribute: string): string {
        switch (attribute) {
            case "Identifier":
                return User.identifier;
            case "Email":
                return User.email;
            case "Country":
                return User.country;
            default:
                return User.custom[attribute];
        }
    }
}