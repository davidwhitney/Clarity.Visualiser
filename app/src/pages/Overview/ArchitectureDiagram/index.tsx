import React from "react";
import { groupByAppName, groupByDescriptionTag } from "../../../../../src/grouping/Grouper";
import "./index.css"
import Mermaid from "../../../Mermaid";

type OverviewByWebAppProps = { subscriptionAndResources: SubscriptionAndResources | null; };

export function ArchitectureDiagram({ subscriptionAndResources }: OverviewByWebAppProps) {
    if (!subscriptionAndResources) {
        return <></>;
    }
      
    const { Subscription: subscription, Resources: resources } = subscriptionAndResources;

    //const appServicePlans = resources.filter(x=> x.type === "Microsoft.Web/serverFarms");
    //console.log(appServicePlans);

    const header = `C4Context
title Diagram\r\n
`;
    const diagram = Subscription(subscription.displayName, resources);

    return (
        <div id="overview-page">
            <Mermaid chart={header + diagram} />
        </div>
    );
}

function Subscription(subscriptionName: string, subscriptionData: any[]) {
    const id = subscriptionName + "-components";
    const apps = groupByAppName(subscriptionData);

    const applicationGroups = Object.keys(apps).map((app: string) => {
        const applicationGroup = apps[app];
        return ApplicationGroup(app, applicationGroup);
    });

    if (applicationGroups.length === 0) {
        return "";
    }

    return `Boundary(${id}, "${subscriptionName}", "one-desc") {
        ${applicationGroups.join("\n\t\t")}
    }`;;
}


export function ApplicationGroup(appName: string, resources: any[]) {
    const sites = resources.filter((app: any) => app.type.toLowerCase() === "microsoft.web/sites");
    const groupedByDescriptionTag = groupByDescriptionTag(sites);

    const pairs = Object.keys(groupedByDescriptionTag).map((description: string) => {
        const sites = groupedByDescriptionTag[description];

        const locations = [];
        for (let i = 0; i < sites.length; i++) {
            const site = sites[i];
            
            locations.push({
                name: site.name,
                location: site.location
            });
        }

        return {
            ...sites[0],
            installations: locations
        }
    });

    if (pairs.length === 0) {
        return "";
    }

    const sitesss = pairs.map((site: any) => {    
        const farmName = site.name;
        const siteStub = farmName.substring(8);

        //console.log(site);

        return `System(${siteStub}, "${site.tags.description}", "${site.name}")`;
    }).join("\n\t");

    return `Boundary(${appName}, "${appName}", "one-desc") {
        ${sitesss}
    }`;
}