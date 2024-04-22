import React from "react";
import { groupByAppName, groupByDescriptionTag } from "../../../../../src/grouping/Grouper";
import "./index.css"

type OverviewByWebAppProps = { subscriptionAndResources: SubscriptionAndResources | null; };
type SubscriptionProps = { subscriptionName: string; subscriptionData: any[]; };

export function OverviewByWebApp({ subscriptionAndResources }: OverviewByWebAppProps) {
    if (!subscriptionAndResources) {
        return <></>;
    }
      
    const { Subscription: subscription, Resources: resources } = subscriptionAndResources;

    return (
        <div id="overview-page">
            <Subscription subscriptionName={subscription.displayName} subscriptionData={resources} />
        </div>
    );
}

function Subscription({ subscriptionName, subscriptionData }: SubscriptionProps) {
    const id = subscriptionName + "-components";
    const componentCount = Object.keys(subscriptionData).length;

    const apps = groupByAppName(subscriptionData);

    const applicationGroups = Object.keys(apps).map((app: string) => {
        const applicationGroup = apps[app];
        return <ApplicationGroup key={applicationGroup.id} appName={app} resources={applicationGroup} />;
    });

    if (applicationGroups.length === 0) {
        return <></>;
    }

    return (
        <div className="team-boundary">
            <h2 role="header" className="team-boundary-header">{subscriptionName} ({componentCount})</h2>
            <br />
            <div id={id} className="team-components">
                {applicationGroups}
            </div>
        </div>
    );
}


export function ApplicationGroup({ appName, resources }: {appName: string, resources: any[]}) {
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
        return <></>;
    }

    return (
        <div className="app"> 
            <h2>{appName}</h2>
            <div className="app-contents">
                {pairs.map((site: any) => {
                    return <WebSiteSet key={site.id} site={site} />;
                })}
            </div>
        </div>
    );
}

export function WebSiteSet({ site }: {site: any}) {   
    const farmName = site.name;
    const siteStub = farmName.substring(8);

    const iconForEachInstallation = site.installations.map((installation: any) => {
        return (<div>{installation.name} - {installation.location}</div>);
    });

    return (
        <div className="app-service-plan">
            <h3>{site.tags?.description}</h3>
            <span>{site.tags?.buildVersion}{site.tags?.buildversion}</span>
            <div>
                <div>{siteStub}</div>
                <div className="owner-name">Owner: {site.tags?.team}</div>
                <div className="created-date">Created: {site.tags?.createdDate}</div>
                <div className="kind">Kind: {site.kind}</div>
            </div>
            <div>
                {iconForEachInstallation}
            </div>
        </div>
    )
}
