
const exclusions = [
    "Microsoft.AlertsManagement/",
    "Microsoft.Portal/",
    "Microsoft.Insights/",
    //"Microsoft.Web/serverFarms",
    //"Microsoft.Web/sites/slots",
    //"Microsoft.Web/certificates",
    //"Microsoft.DocumentDB/databaseAccounts"
];

const knownAssetType = new Map<string, string>();
knownAssetType.set("Microsoft.Web/sites", "Web Apps");
knownAssetType.set("Microsoft.Web/serverFarms", "App Service Plans");
knownAssetType.set("Microsoft.Web/sites/slots", "Deployment Slots");
knownAssetType.set("Microsoft.Web/certificates", "Certificates");
knownAssetType.set("Microsoft.DocumentDB/databaseAccounts", "Cosmos DBs");
knownAssetType.set("Microsoft.AlertsManagement/", "Alerts");
knownAssetType.set("Microsoft.Portal/", "Portals");
knownAssetType.set("Microsoft.Insights/", "Insights");
knownAssetType.set("Microsoft.Network/", "Networking Components");
knownAssetType.set("Microsoft.Storage/", "Storage Accounts");
knownAssetType.set("Microsoft.KeyVault/", "KeyVaults");
knownAssetType.set("Microsoft.Cdn", "CDNs");
knownAssetType.set("Microsoft.ServiceBus", "Service Buses");
knownAssetType.set("Microsoft.SaaS/resources", "SaaS Resources");
knownAssetType.set("Microsoft.AppConfiguration/", "Configuration Stores");
knownAssetType.set("Microsoft.ManagedIdentity/", "Managed Identities");
knownAssetType.set("Microsoft.Sql/servers", "MsSQL Servers");
knownAssetType.set("Microsoft.Databricks/", "Databrick Workspaces");
knownAssetType.set("Microsoft.DataFactory/", "DataFactories");
knownAssetType.set("Microsoft.EventGrid/", "EventGrids");
knownAssetType.set("Microsoft.Cache/Redis", "EventHubs");
knownAssetType.set("Microsoft.Batch/", "Microsoft Batch");

const assetTypeGlyphs = new Map<string, string>();
assetTypeGlyphs.set("Microsoft.Web/sites", "fas fa-globe");
assetTypeGlyphs.set("Microsoft.Web/serverFarms", "fas fa-server");
assetTypeGlyphs.set("Microsoft.Web/sites/slots", "fas fa-code-branch");
assetTypeGlyphs.set("Microsoft.Web/certificates", "fas fa-certificate");
assetTypeGlyphs.set("Microsoft.DocumentDB/databaseAccounts", "fas fa-database");
assetTypeGlyphs.set("Microsoft.AlertsManagement/", "fas fa-bell");
assetTypeGlyphs.set("Microsoft.Portal/", "fas fa-desktop");
assetTypeGlyphs.set("Microsoft.Insights/", "fas fa-chart-line");
assetTypeGlyphs.set("Microsoft.Network/", "fas fa-network-wired");
assetTypeGlyphs.set("Microsoft.Storage/", "fas fa-hdd");
assetTypeGlyphs.set("Microsoft.KeyVault/", "fas fa-key");
assetTypeGlyphs.set("Microsoft.Cdn", "fas fa-cloud");
assetTypeGlyphs.set("Microsoft.ServiceBus", "fas fa-bus");
assetTypeGlyphs.set("Microsoft.SaaS/resources", "fas fa-cloud");
assetTypeGlyphs.set("Microsoft.AppConfiguration/", "fas fa-cogs");
assetTypeGlyphs.set("Microsoft.ManagedIdentity/", "fas fa-user-secret");
assetTypeGlyphs.set("Microsoft.Sql/servers", "fas fa-database");
assetTypeGlyphs.set("Microsoft.Databricks/", "fas fa-code");
assetTypeGlyphs.set("Microsoft.DataFactory/", "fas fa-code");
assetTypeGlyphs.set("Microsoft.EventGrid/", "fas fa-code");
assetTypeGlyphs.set("Microsoft.Cache/Redis", "fas fa-code");
assetTypeGlyphs.set("Microsoft.Batch/", "fas fa-code");

export {
    exclusions,
    knownAssetType,
    assetTypeGlyphs
}