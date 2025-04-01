type Props = {
    subscriptions: Subscription[];
    onSelect: (subscription: Subscription) => void;
    showAllEnabled?: boolean;
    showAllSubscriptions?: boolean;
    onToggleShowAll?: (showAll: boolean) => void;
};

export function SubscriptionSelector({ 
    subscriptions, 
    onSelect, 
    showAllEnabled = false,
    showAllSubscriptions = false,
    onToggleShowAll = () => {}
}: Props) {
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

    const handleToggleShowAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        onToggleShowAll(e.target.checked);
    };

    return (
        <div className="subscription-dropdown-box">
            <select 
                onChange={onChangeHandler} 
                name="subscriptions" 
                title="subscriptions" 
                className="subscription-dropdown"
                disabled={showAllEnabled && showAllSubscriptions}
            >
                {subsDdl}
            </select>
            
            {showAllEnabled && (
                <div className="show-all-subscriptions">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={showAllSubscriptions} 
                            onChange={handleToggleShowAll} 
                        />
                        Show all subscriptions
                    </label>
                </div>
            )}
        </div>
    );
}
