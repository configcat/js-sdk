import { RolloutEvaluator, User } from "./RolloutEvaluator";
import { ProjectConfig } from "./ProjectConfigService";
import { IConfigCatClient, ConfigCatClientImpl } from "./ConfigCatClientImpl";

class Startup {
    public static main1(): number {

        console.log("debug");

        let client: IConfigCatClient = new ConfigCatClientImpl("PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A");

        client.getValue(
            "stringDefaultCat",
            "DEF",
            <User>{
                "identifier": "currentUserUniqueIdentifier",
                "email": "myTargetedUser@foo.com"
            }, (v) => {
                console.log(v);
            });

        client.getValue("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"), actual => {

            console.log(actual);

        });

        return 0;
    }
}

Startup.main1();