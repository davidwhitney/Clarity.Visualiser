import * as dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";
import { AzureDataSource } from "./data-sourcing/AzureDataSource";
import { groupByOwner } from "./grouping/Grouper";
dotenv.config();

export async function main(args: Args): Promise<number> {
    console.log("Hello world!");

    const credential = new DefaultAzureCredential();
    const source1 = new AzureDataSource(credential);
    
    const assets = await source1.collectAssets();

    const firstKey = Object.getOwnPropertyNames(assets)[0];
    const firstSub = assets[firstKey];

    console.log("First Sub: ", firstSub);
    console.table(firstSub);

    const grouped = groupByOwner(firstSub);
    console.log(grouped);


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