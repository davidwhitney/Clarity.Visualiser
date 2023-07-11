import React from "react";
import { groupByOwner } from "../../../src/grouping/Grouper";
import { Subscription } from "./overview/Subscription";
import "./OverviewByTeam.css"

type Props = {
    data: SubscriptionAndResources[];
};

export function OverviewByTeam({ data }: Props) {
    const allSubscriptionData = data;
      
    const subName = allSubscriptionData[0].Subscription.displayName;
    const firstSub = allSubscriptionData[0].Resources;
    const grouped: SingleSubscriptionGroupedByTeam = groupByOwner(firstSub);

    return (
        <div id="overview-page">
            <Subscription subscriptionName={subName} subscriptionData={grouped} />
        </div>
    );
}
