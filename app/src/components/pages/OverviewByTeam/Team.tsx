import React from "react";
import { ApplicationGroup } from "./ApplicationGroup";
import { groupByAppName } from "../../../../../src/grouping/Grouper";

export function Team(props: { teamName: string; teamData: any; }) {
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
