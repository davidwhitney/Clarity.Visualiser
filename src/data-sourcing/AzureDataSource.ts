import { TokenCredential } from "@azure/identity";
import { ResourceManagementClient } from "@azure/arm-resources";
import { SubscriptionClient } from "@azure/arm-subscriptions";
import { PagedAsyncIterableIterator } from "@azure/core-paging";

export class AzureDataSource {
    constructor(
        private credentials: TokenCredential
    ) {
    }

    async collectAssets() {
        const subsClient = new SubscriptionClient(this.credentials);
        const subscriptionsItr = subsClient.subscriptions.list();
        const subs = await listAll(subscriptionsItr);
    
        const prodSubs = subs.filter((sub) => sub.displayName?.includes("PRD"));
    
        const subsAndResources: Record<string, any> = {};
    
        for (const sub of prodSubs) {
            subsAndResources[sub.subscriptionId!] = [];
    
            // Get all resources in our production subscription
            const resourceClient = new ResourceManagementClient(this.credentials, sub.subscriptionId!);
            const resourcesItr = resourceClient.resources.list();
            const allResources = await listAll(resourcesItr);
    
            subsAndResources[sub.subscriptionId!] = allResources;
    
            console.log("Resources Count: " + allResources.length);
        }
    
        return subsAndResources;
    }
}

async function listAll<TElement, TPage, TPageSettings>(iterator: PagedAsyncIterableIterator<TElement, TPage, TPageSettings>) {
    const results = [];
    for await (const item of iterator) {
        results.push(item);
    }
    return results;
}