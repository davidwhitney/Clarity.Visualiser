import * as dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";
import { AzureDataSource } from "../../src/data-sourcing/AzureDataSource";
import { groupByOwner } from "../../src/grouping/Grouper";
import { Context, HttpRequest } from "@azure/functions";

dotenv.config();

// Hack a cheap In Memory cache in here for dev.

const cache = new Array<any>();

export async function run(context: Context, req: HttpRequest): Promise<void> {

    if (cache.length > 0) {
        context.res = {
            status: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify(cache[0])
        };
        return;
    }

    const credential = new DefaultAzureCredential();
    const source1 = new AzureDataSource(credential);
    
    const assets = await source1.collectAssets();

    const firstKey = assets.keys().next().value;
    const firstSub = assets.get(firstKey)!;
    const grouped = groupByOwner(firstSub);

    cache.push(grouped);

    context.res = {
      status: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(grouped)
    };
}