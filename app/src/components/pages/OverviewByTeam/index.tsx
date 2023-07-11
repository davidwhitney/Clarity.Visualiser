import React from "react";
import { groupByOwner } from "../../../../../src/grouping/Grouper";
import { Subscription } from "./Subscription";
import "./index.css"

type Props = {
    subscriptionAndResources: SubscriptionAndResources | null;
};

export function OverviewByTeam({ subscriptionAndResources }: Props) {
    if (!subscriptionAndResources) {
        return <></>;
    }
      
    const subName = subscriptionAndResources.Subscription.displayName;
    const firstSub = subscriptionAndResources.Resources;
    const grouped: SingleSubscriptionGroupedByTeam = groupByOwner(firstSub);

    return (
        <div id="overview-page">
            <Subscription subscriptionName={subName} subscriptionData={grouped} />
        </div>
    );
}
