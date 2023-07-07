import { TokenCredential } from "@azure/identity";
import { ResourceManagementClient } from "@azure/arm-resources";
import { SubscriptionClient } from "@azure/arm-subscriptions";

export class DiagramBuilder {
    constructor(private credentials: TokenCredential) {
    }

    public async build(): Promise<void> {
        console.log("Building diagram...");

        const subsClient = new SubscriptionClient(this.credentials);
        const subscriptions = subsClient.subscriptions.list();
    
        for await (const subscription of subscriptions) {
            console.log(subscription.displayName);
        }
    }
}