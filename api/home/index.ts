import * as dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";
import { AzureDataSource, SubscriptionAndResources } from "../../src/data-sourcing/AzureDataSource";
import { Context, HttpRequest } from "@azure/functions";
import { gzip } from 'node-gzip';

dotenv.config();

// Hack a cheap In Memory cache in here for dev.

let assets: SubscriptionAndResources[] = null;

export async function run(context: Context, req: HttpRequest): Promise<void> {
    if (assets === null) {
      console.log("Collecting assets...");
      const credential = new DefaultAzureCredential();
      const source = new AzureDataSource(credential);
      assets = await source.collectAssets();
    }

    const assetsAsString = JSON.stringify(assets);
    const compressed = await gzip(assetsAsString);

    context.res = {
      status: 200,
      headers: { 
        "content-type": "application/json",
        "content-encoding": "gzip"
      },
      body: compressed
    };
}