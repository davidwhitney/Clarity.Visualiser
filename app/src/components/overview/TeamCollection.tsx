import React from "react";
import { TeamBoundary } from "./TeamBoundary";

export function TeamCollection(props: any) {
    const data = props.data;

    return Object.keys(data).map((teamName: string) => {        
        return (<TeamBoundary key={teamName} teamName={teamName} teamData={data[teamName]} />)
    });
}
