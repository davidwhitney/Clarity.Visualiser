import { DefaultAzureCredential, InteractiveBrowserCredential  } from "@azure/identity";
import { DiagramBuilder } from "../src/diagram-builder/DiagramBuilder";
import { SubscriptionClient } from "@azure/arm-subscriptions";
import { groupByOwner } from "../src/grouping/Grouper";

console.log("Hello world!");
const appContainer = document.getElementById("container");

// const credential = new InteractiveBrowserCredential({
//     clientId: "my-client-id",
//     tenantId: "2a15a8b5-49d1-49bc-b63c-c7c8c87bdc57"
// });

const result = await fetch("/api/home");
const assets = await result.json();

const exclusions = [
    "Microsoft.AlertsManagement/",
    "Microsoft.Portal/",
    "Microsoft.Insights/",
    //"Microsoft.Web/serverFarms",
    //"Microsoft.Web/sites/slots",
    //"Microsoft.Web/certificates",
    //"Microsoft.DocumentDB/databaseAccounts"
];

const assetTypes = new Map<string, string>();
assetTypes.set("Microsoft.Web/sites", "Web App");
assetTypes.set("Microsoft.Web/serverFarms", "App Service Plan");
assetTypes.set("Microsoft.Web/sites/slots", "Deployment Slot");
assetTypes.set("Microsoft.Web/certificates", "Certificate");
assetTypes.set("Microsoft.DocumentDB/databaseAccounts", "Cosmos DB");
assetTypes.set("Microsoft.AlertsManagement/", "Alert");
assetTypes.set("Microsoft.Portal/", "Portal");
assetTypes.set("Microsoft.Insights/", "Insights");

const assetTypeGlyphs = new Map<string, string>();
assetTypeGlyphs.set("Microsoft.Web/sites", "fas fa-globe");
assetTypeGlyphs.set("Microsoft.Web/serverFarms", "fas fa-server");
assetTypeGlyphs.set("Microsoft.Web/sites/slots", "fas fa-code-branch");
assetTypeGlyphs.set("Microsoft.Web/certificates", "fas fa-certificate");
assetTypeGlyphs.set("Microsoft.DocumentDB/databaseAccounts", "fas fa-database");
assetTypeGlyphs.set("Microsoft.AlertsManagement/", "fas fa-bell");
assetTypeGlyphs.set("Microsoft.Portal/", "fas fa-desktop");
assetTypeGlyphs.set("Microsoft.Insights/", "fas fa-chart-line");


const withoutAnythingFromExclusionList = Object.getOwnPropertyNames(assets).reduce((acc, cur) => {
    if (!exclusions.some(e => cur.toLowerCase().startsWith(e.toLowerCase()))) {
        acc[cur] = assets[cur];
    }
    return acc;
}, {} as any);

const firstKey = Object.getOwnPropertyNames(withoutAnythingFromExclusionList)[0];
const firstSub = withoutAnythingFromExclusionList[firstKey];
const grouped = groupByOwner(firstSub);

const teams = Object.getOwnPropertyNames(grouped);

for (const team of teams) {
    const teamComponents = grouped[team];

    // group by tag "Application"
    const apps = teamComponents.reduce((acc, cur) => {
        const tags = cur.tags;
        const app = tags?.application;
        if (app) {
            if (!acc[app]) {
                acc[app] = [];
            }
            acc[app].push(cur);
        }
        return acc;
    }, {} as any);

    const teamBoundary = document.createElement("div");
    teamBoundary.id = team;
    teamBoundary.className = "team-boundary";

    const teamHeader = document.createElement("h2");
    teamHeader.innerText = team;

    teamBoundary.append(teamHeader);
    teamBoundary.append(document.createElement("br"));   
    
    const teamComponentsDiv = document.createElement("div");
    teamComponentsDiv.id = `${team}-components`;
    teamComponentsDiv.className = "team-components";
    teamBoundary.append(teamComponentsDiv);

    const teamComponentsCount = document.createElement("span");
    teamComponentsCount.innerText = ` (${teamComponents.length})`;
    teamHeader.append(teamComponentsCount);

    // generate div per app
    const appDivs = Object.getOwnPropertyNames(apps).map((app) => {
        const appDiv = document.createElement("div");
        appDiv.id = app;
        appDiv.className = "app";
        appDiv.innerText = app;

        const appCount = document.createElement("span");
        appCount.innerText = ` (${apps[app].length})`;
        appDiv.append(appCount);

        console.log(apps[app]);

        const assetTypeCounts = new Map<string, number>();
        for (const assetType of assetTypes.keys()) {
            const count = apps[app].filter((asset) => {
                return asset.type.toLowerCase().startsWith(assetType.toLowerCase());
            }).length;
            assetTypeCounts.set(assetType, count);            
        }

        const appDetails = document.createElement("div");
        appDetails.className = "app-details";

        const appDetailsList = document.createElement("ul");
        appDetails.append(appDetailsList);        

        const assetTypeCountsWithLabel = Array.from(assetTypeCounts.entries()).map((entry) => {
            const listItem = document.createElement("li");
            listItem.innerText = `${entry[1]} ${assetTypes.get(entry[0])}`;
            
            const icon = document.createElement("i");
            icon.className = assetTypeGlyphs.get(entry[0])?.toString() || "";
            listItem.prepend(icon);

            return listItem;
        });

        appDetailsList.append(...assetTypeCountsWithLabel);

        appDiv.append(appDetails);

        return appDiv;
    });

    teamComponentsDiv.append(...appDivs);
    appContainer?.append(teamBoundary);
}


export {};