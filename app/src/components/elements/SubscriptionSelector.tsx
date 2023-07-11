export function SubscriptionSelector({ subscriptions }: { subscriptions: any[]; }) {
    if (!subscriptions) {
        return <></>;
    }

    return (
        <div className="subscription-dropdown-box">
            <select className="subscription-dropdown">
                {subscriptions.map((subscription) => {
                    return <option key={subscription.id}>{subscription.displayName}</option>;
                })}
            </select>
        </div>
    );
}
