import { InteractiveBrowserCredential  } from "@azure/identity";
import { DiagramBuilder } from "../src/diagram-builder/DiagramBuilder";
import { SubscriptionClient } from "@azure/arm-subscriptions";

console.log("Hello world!");

const credential = new InteractiveBrowserCredential({
    clientId: "my-client-id",
    tenantId: "2a15a8b5-49d1-49bc-b63c-c7c8c87bdc57"
});

const subsClient = new SubscriptionClient(credential);
const subscriptions = subsClient.subscriptions.list();

for await (const subscription of subscriptions) {
    console.log(subscription.displayName);
}


export {};