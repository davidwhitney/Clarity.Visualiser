import React from "react";
import { assetTypeGlyphs, knownAssetType } from "../metadata";

export function ApplicationGroup(props: {appName: string, apps: any[]}) {
    const totalResourceCount = props.apps.length;
    const assetTypeCounts = new Map<string, number>();
    const unknowns: any[] = [];

    for (let app of props.apps) {
        const category = getMatchingType(app.type);
        app.category = category;

        if (category === "Other") {
            unknowns.push(app);
        }   

        if (!assetTypeCounts.has(app.category)) {
            assetTypeCounts.set(app.category, 0);
        }   
        
        assetTypeCounts.set(app.category, assetTypeCounts.get(app.category)! + 1);               
    }

    const unknownNames = unknowns.map((asset) => { return asset.type; });
    const assetTypeCountsWithLabel = Array.from(assetTypeCounts.entries()).map(([assetType, count]) => {
        if (count === 0) {
            return <></>;
        }

        const assetLabel = knownAssetType.get(assetType);
        const assetIcon = assetTypeGlyphs.get(assetType);

        return (
            <li>
                <i className={assetIcon}></i>
                {count} {assetLabel}
            </li>
        );
    });


    return (
        <div className="app"> 
            <h2>{props.appName} ({totalResourceCount})</h2>
            <div className="app-details">
                <ul>
                    {assetTypeCountsWithLabel}
                </ul>
                <ul>
                    {unknownNames.join(", ")}
                </ul>
            </div>
        </div>
    );
}


function getMatchingType(resourceType: string) {
    for (let knownResourceType of knownAssetType.keys()) {
        const lowercaseKnownResourceType = knownResourceType.toLowerCase();
        const lowercaseResourceType = resourceType.toLowerCase();
        
        if (lowercaseKnownResourceType.endsWith("/") && lowercaseResourceType.startsWith(lowercaseKnownResourceType)) {
            return knownResourceType;

        } else if (lowercaseKnownResourceType === lowercaseResourceType) {                
            return knownResourceType;
        }                
    }

    return "Other";
}