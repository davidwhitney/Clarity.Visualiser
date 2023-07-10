import React from "react";
import { ApplicationGroup } from "./ApplicationGroup";

export function Team(props: { teamName: string; teamData: any; }) {
    const id = props.teamName + "-components";
    const componentCount = Object.keys(props.teamData).length;

    // group by tag "Application"
    const apps = props.teamData.reduce((acc: { [x: string]: any[]; }, cur: { tags: any; }) => {
        const tags = cur.tags;
        const app = tags?.application;
        if (app) {
            if (!acc[app]) {
                acc[app] = [];
            }
            acc[app].push(cur);
        }
        return acc;
    }, {} as any);

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
