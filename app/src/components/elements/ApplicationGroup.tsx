import React from "react";
import { assetTypeGlyphs, knownAssetType } from "../../metadata";

export function ApplicationGroup(props: {appName: string, apps: any[]}) {
    const totalResourceCount = props.apps.length;
    const assetTypeCounts = new Map<string, number>();

    for (const assetType of knownAssetType.keys()) {
        const recognised = props.apps.filter((asset: any) => {
            const lowercaseKnownAssetType = assetType.toLowerCase();
            const lowercaseAssetType = asset.type.toLowerCase();
            return lowercaseAssetType.startsWith(lowercaseKnownAssetType);
        });

        assetTypeCounts.set(assetType, recognised.length);            
    }

    const assetTypeCountsWithLabel = Array.from(assetTypeCounts.entries()).map(([assetType, count]) => {
        const fontAwesomeGlyph = assetTypeGlyphs.get(assetType)?.toString() || "";

        if (count === 0) {
            return <></>;
        }

        return (
            <li>
                <i className={fontAwesomeGlyph}></i>
                {count} {knownAssetType.get(assetType)}
            </li>
        );
    });

    const countOfEverythingElse = props.apps.length - Array.from(assetTypeCounts.values()).reduce((acc, cur) => acc + cur, 0);
    if (countOfEverythingElse > 0) {
        assetTypeCountsWithLabel.push(
            <li>
                <i className="fas fa-question"></i>
                {countOfEverythingElse} Other
            </li>
        );
    }

    const resourcesOfUnknownType: string[] = [];
    for (let resource of props.apps) {

        let isKnownResourceType = false;
        for (let knownResourceType of knownAssetType.keys()) {
            const lowercaseKnownResourceType = knownResourceType.toLowerCase();
            const lowercaseResourceType = resource.type.toLowerCase();
            if (lowercaseResourceType.startsWith(lowercaseKnownResourceType)) {
                isKnownResourceType = true;
                break;
            }                
        }

        if (!isKnownResourceType) {
            resourcesOfUnknownType.push(resource);
        }
        
    }

    const namesOfOtherResources = resourcesOfUnknownType.map((asset: any) => {
        return asset.type;
    });

    return (
        <div className="app"> 
            <h2>{props.appName} ({totalResourceCount})</h2>
            <div className="app-details">
                <ul>
                    {assetTypeCountsWithLabel}
                </ul>
                <ul>
                    {namesOfOtherResources}
                </ul>
            </div>
        </div>
    );
}
