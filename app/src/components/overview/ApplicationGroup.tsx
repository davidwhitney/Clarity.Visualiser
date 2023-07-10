import React from "react";
import { assetTypeGlyphs, assetTypes } from "../../metadata";

export function ApplicationGroup(props: {appName: string, apps: any[]}) {
    const assetTypeCounts = new Map<string, number>();

    for (const assetType of assetTypes.keys()) {
        const count = props.apps.filter((asset: any) => {
            return asset.type.toLowerCase().startsWith(assetType.toLowerCase());
        }).length;

        assetTypeCounts.set(assetType, count);            
    }

    const assetTypeCountsWithLabel = Array.from(assetTypeCounts.entries()).map(([assetType, count]) => {
        const fontAwesomeGlyph = assetTypeGlyphs.get(assetType)?.toString() || "";

        return (
            <li>
                <i className={fontAwesomeGlyph}></i>
                {count} {assetTypes.get(assetType)}
            </li>
        );
    });

    return (
        <div className="app"> 
            <h2>{props.appName}</h2>
            <div className="app-details">
                <ul>
                    {assetTypeCountsWithLabel}
                </ul>
            </div>
        </div>
    );
}
