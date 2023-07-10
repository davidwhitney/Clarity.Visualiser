import React from "react";
import { TeamCollection } from "./TeamCollection";

export function Subscription(props: { subscriptionName: string; subscriptionData: any; }) {
    const id = props.subscriptionName + "-components";

    return (
        <>
            <div id={id} className="subscription-components"></div>
            <TeamCollection data={props.subscriptionData} />
        </>
    );
}
