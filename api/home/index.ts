import * as dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";
import { AzureDataSource } from "../../src/data-sourcing/AzureDataSource";
import { groupByOwner } from "../../src/grouping/Grouper";
import { Context, HttpRequest } from "@azure/functions";

dotenv.config();

// Hack a cheap In Memory cache in here for dev.

let assets: any = null;

export async function run(context: Context, req: HttpRequest): Promise<void> {
    if (assets === null) {
      const credential = new DefaultAzureCredential();
      const source1 = new AzureDataSource(credential);      
      assets = await source1.collectAssets();
    }

    const firstKey = assets.keys().next().value;
    const firstSub = assets.get(firstKey)!;
    const grouped = groupByOwner(firstSub);

    context.res = {
      status: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(grouped)
    };
}