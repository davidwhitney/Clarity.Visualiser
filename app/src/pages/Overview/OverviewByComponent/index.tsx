import React from "react";
import { groupByAppName } from "../../../../../src/grouping/Grouper";
import { ApplicationGroup } from "../../../layout/ApplicationGroup";
import "./index.css"

type OverviewByComponentProps = { subscriptionAndResources: SubscriptionAndResources | null; };
type SubscriptionProps = { subscriptionName: string; subscriptionData: any[]; };

export function OverviewByComponent({ subscriptionAndResources }: OverviewByComponentProps) {
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
        return <ApplicationGroup key={applicationGroup.id} appName={app} apps={applicationGroup} />;
    });

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
