import React from "react";
import { groupByOwner } from "../../../src/grouping/Grouper";
import { Subscription } from "./overview/Subscription";
import "./OverviewByTeam.css"

type Props = {
    data: AzureResourcesGroupedBySubscriptionId;
};

export function OverviewByTeam({ data }: Props) {
    const allSubscriptionData = data;
      
    const firstKey = Object.getOwnPropertyNames(allSubscriptionData)[0];
    const firstSub = allSubscriptionData[firstKey];
    const grouped: SingleSubscriptionGroupedByTeam = groupByOwner(firstSub);

    return (
        <div id="overview-page">
            <Subscription subscriptionName={firstKey} subscriptionData={grouped} />
        </div>
    );
}
