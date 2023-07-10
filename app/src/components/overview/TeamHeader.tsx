import React from "react";


export function TeamHeader(props: {teamName: string, teamData: any}) {
    const componentCount = Object.keys(props.teamData).length;

    return (
        <>
            <h2 role="header" className="team-boundary-header">{props.teamName} ({componentCount})</h2>
            <br />
        </>
    );
}
