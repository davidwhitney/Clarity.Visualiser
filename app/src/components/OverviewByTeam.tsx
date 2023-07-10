import React from "react";
import { groupByOwner } from "../../../src/grouping/Grouper";
import { Subscription } from "./overview/Subscription";
import "./OverviewByTeam.css"

export function OverviewByTeam(props: any) {
    const allSubscriptionData = props.data;  
    console.log(props);
      
    const firstKey = Object.getOwnPropertyNames(allSubscriptionData)[0];
    const firstSub = allSubscriptionData[firstKey];
    const grouped = groupByOwner(firstSub);

    return (
        <div id="overview-page">
            <Subscription subscriptionName={firstKey} subscriptionData={grouped} />
        </div>
    );
}


