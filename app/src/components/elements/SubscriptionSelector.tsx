type Props = {
    subscriptions: Subscription[];
    onSelect: (subscription: Subscription) => void;
};

export function SubscriptionSelector({ subscriptions, onSelect }: Props) {
    if (!subscriptions || subscriptions.length === 0) {
        return <></>;
    }

    const subsDdl = subscriptions.map((subscription) => {
        return (
            <option key={subscription.subscriptionId} value={subscription.subscriptionId}>
                {subscription.displayName}
            </option>
        );
    });

    const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSubId = e.target.value;
        const selectedSub = subscriptions.find((sub) => sub.subscriptionId === selectedSubId);
        selectedSub && onSelect(selectedSub);
    };

    return (
        <div className="subscription-dropdown-box">
            <select onChange={onChangeHandler} name="subscriptions" title="subscriptions" className="subscription-dropdown">
                {subsDdl}
            </select>
        </div>
    );
}
