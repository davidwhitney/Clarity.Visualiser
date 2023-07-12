import React from "react";
import { groupByOwner, groupByAppName } from "../../../../../../src/grouping/Grouper";
import { ApplicationGroup } from "../../../elements/ApplicationGroup";
import "./index.css"

type OverviewByTeamProps = { subscriptionAndResources: SubscriptionAndResources | null; };
type SubscriptionProps = { subscriptionName: string; subscriptionData: SingleSubscriptionGroupedByTeam; };
type TeamProps = { teamName: string; teamData: any; };

export function OverviewByTeam({ subscriptionAndResources }: OverviewByTeamProps) {
    if (!subscriptionAndResources) {
        return <></>;
    }
      
    const { Subscription: subscription, Resources: resources } = subscriptionAndResources;
    const grouped: SingleSubscriptionGroupedByTeam = groupByOwner(resources);

    return (
        <div id="overview-page">
            <Subscription subscriptionName={subscription.displayName} subscriptionData={grouped} />
        </div>
    );
}

function Subscription({ subscriptionName, subscriptionData }: SubscriptionProps) {
    const id = subscriptionName + "-components";

    const teamBoundaries = Object.keys(subscriptionData).map((teamName: string) => {
        const data = subscriptionData[teamName];
        return <Team teamName={teamName} teamData={data} />;
    });

    return (
        <>
            <h1>{subscriptionName}</h1>
            <div className="subscription">
                <div id={id} className="subscription-components"></div>
                {teamBoundaries}
            </div>
        </>
    );
}

function Team(props: TeamProps) {
    const id = props.teamName + "-components";
    const componentCount = Object.keys(props.teamData).length;

    const apps = groupByAppName(props.teamData);

    const applicationGroups = Object.keys(apps).map((app: string) => {
        const applicationGroup = apps[app];
        return <ApplicationGroup key={applicationGroup.id} appName={app} apps={applicationGroup} />;
    });

    return (
        <div className="team-boundary">
            <h2 role="header" className="team-boundary-header">{props.teamName} ({componentCount})</h2>
            <br />
            <div id={id} className="team-components">
                {applicationGroups}
            </div>
        </div>
    );
}
