import * as dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";
import { DiagramBuilder } from "./diagram-builder/DiagramBuilder";
dotenv.config();

export async function main(args: Args): Promise<number> {
    console.log("Hello world!");

    const credential = new DefaultAzureCredential();
    const builder = new DiagramBuilder(credential);

    await builder.build();


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