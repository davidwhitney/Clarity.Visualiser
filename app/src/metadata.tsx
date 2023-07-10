
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

export {
    exclusions,
    assetTypes,
    assetTypeGlyphs
}