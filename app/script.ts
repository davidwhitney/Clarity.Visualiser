import { DefaultAzureCredential, InteractiveBrowserCredential  } from "@azure/identity";
import { DiagramBuilder } from "../src/diagram-builder/DiagramBuilder";
import { SubscriptionClient } from "@azure/arm-subscriptions";
import { groupByOwner } from "../src/grouping/Grouper";

console.log("Hello world!");

// const credential = new InteractiveBrowserCredential({
//     clientId: "my-client-id",
//     tenantId: "2a15a8b5-49d1-49bc-b63c-c7c8c87bdc57"
// });

const result = await fetch("/api/home");
const assets = await result.json();

console.log(assets);

const firstKey = Object.getOwnPropertyNames(assets)[0];
const firstSub = assets[firstKey];
const grouped = groupByOwner(firstSub);

console.table(grouped);

export {};