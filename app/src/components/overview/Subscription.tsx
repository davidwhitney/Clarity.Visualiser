import React from "react";
import { Team } from "./Team";

type Props = {
    subscriptionName: string; 
    subscriptionData: SingleSubscriptionGroupedByTeam;
};

export function Subscription({ subscriptionName, subscriptionData }: Props) {
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

