import * as dotenv from "dotenv";
import { Context, HttpRequest } from "@azure/functions";

dotenv.config();

export async function run(context: Context, req: HttpRequest): Promise<void> {

    
    context.res = {
      status: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        foo: "bar"
      })
    };
}