import React from "react";
import { TeamHeader } from "./TeamHeader";
import { Team } from "./Team";

export function TeamBoundary(props: {teamName: string, teamData: any}) {
    return (
        <div className="team-boundary">
            <TeamHeader teamName={props.teamName} teamData={props.teamData}  />
            <Team teamName={props.teamName} teamData={props.teamData} />
        </div>
    );
}


