import * as dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";
import { AzureDataSource } from "../../src/data-sourcing/AzureDataSource";
import { Context, HttpRequest } from "@azure/functions";
const { gzip } = require('node-gzip');

dotenv.config();

// Hack a cheap In Memory cache in here for dev.

let cache = [];

export async function run(context: Context, req: HttpRequest): Promise<void> {
    if (cache.length === 0) {
      console.log("Collecting assets...");
      const credential = new DefaultAzureCredential();
      const source = new AzureDataSource(credential);  

      const assets = await source.collectAssets();
      cache.push(assets);
    }

    const assets = cache[0];
    const assetsAsString = JSON.stringify(assets, replacer);
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


function replacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
}