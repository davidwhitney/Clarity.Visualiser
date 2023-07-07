import { ResourceManagementClient } from "@azure/arm-resources";
import { SubscriptionClient } from "@azure/arm-subscriptions";
import { DefaultAzureCredential } from "@azure/identity";
import * as dotenv from "dotenv";
dotenv.config();

export async function main(args: Args): Promise<number> {
    console.log("Hello world!");


    // For client-side applications running in the browser, use InteractiveBrowserCredential instead of DefaultAzureCredential. See https://aka.ms/azsdk/js/identity/examples for more details.

    // const subscriptionId = "00000000-0000-0000-0000-000000000000";
    // const client = new ResourceManagementClient(new DefaultAzureCredential(), subscriptionId);

    // const subsClient = new SubscriptionClient(new DefaultAzureCredential());
    // const subscriptions = subsClient.subscriptions.list();

    // for await (const subscription of subscriptions) {
    //     console.log(subscription.displayName);
    // }

    // For client-side applications running in the browser, use this code instead:
    // const credential = new InteractiveBrowserCredential({
    //   tenantId: "<YOUR_TENANT_ID>",
    //   clientId: "<YOUR_CLIENT_ID>"
    // });
    // const client = new ResourceManagementClient(credential, subscriptionId);

    // list all subscriptions
    


    return 0;
}

if (process.argv.includes("--run")) {
    main({}).then((exitCode) => {
        process.exit(exitCode);
    }
    ).catch((err) => {
        console.error(err);
        process.exit(1);
    });
}