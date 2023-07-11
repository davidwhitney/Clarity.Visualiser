import * as fs from "fs";

export class DiskCache {
    private cache: { [key: string]: any; } = {};

    constructor(
        private cachePath: string
    ) {
        if (fs.existsSync(this.cachePath)) {
            const cacheFile = fs.readFileSync(this.cachePath, "utf8");
            this.cache = JSON.parse(cacheFile);
        }
    }

    public get<T>(key: string): T {
        return this.cache[key];
    }

    public set<T>(key: string, value: T): void {
        this.cache[key] = value;
        this.save();
    }

    private save(): void {
        const cacheFile = JSON.stringify(this.cache);
        fs.writeFileSync(this.cachePath, cacheFile, "utf8");
        console.log("Cache saved.");
    }
}
