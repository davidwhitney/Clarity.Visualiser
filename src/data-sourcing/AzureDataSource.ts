import { TokenCredential } from "@azure/identity";
import { ResourceManagementClient } from "@azure/arm-resources";
import { Subscription, SubscriptionClient } from "@azure/arm-subscriptions";
import { PagedAsyncIterableIterator } from "@azure/core-paging";
import { DiskCache } from "./DiskCache";

export type SubscriptionAndResources = {
    Subscription: Subscription;
    Resources: any[];
}

export class AzureDataSource {
    private cache: DiskCache;

    constructor(
        private credentials: TokenCredential
    ) {
        this.cache = new DiskCache("./cache.json");
    }

    async collectAssets(): Promise<SubscriptionAndResources[]> {

        if (this.cache.get("assets")) {
            console.log("Cache exists, loading...");
            return this.cache.get<SubscriptionAndResources[]>("assets");
        }

        const subsClient = new SubscriptionClient(this.credentials);
        const subscriptionsItr = subsClient.subscriptions.list();
        const subs = await listAll(subscriptionsItr);
    
        const prodSubs = subs.filter((sub) => sub.displayName?.includes("PRD"));
    
        const subsAndResources: SubscriptionAndResources[] = [];
    
        for (const sub of prodSubs) {    
            const resourceClient = new ResourceManagementClient(this.credentials, sub.subscriptionId!);
            const resourcesItr = resourceClient.resources.list();
            const allResources = await listAll(resourcesItr);
    
            subsAndResources.push({
                Subscription: sub,
                Resources: allResources
            });
    
            console.log("Resources Count: " + allResources.length);
        }

        this.cache.set("assets", subsAndResources);
    
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