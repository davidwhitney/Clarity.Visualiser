import { useEffect, useState } from 'react';
import './App.css';
import { OverviewByTeam } from './components/pages/OverviewByTeam/index';
import { SubscriptionSelector } from './components/elements/SubscriptionSelector';

export default function App() {
    const [apiData, setApiData] = useState<SubscriptionAndResources[] | null>(null);

    useEffect(() => {
        (async () => {
            const result = await fetch('/api/home');
            const data = await result.json();
            setApiData(data);
        })();
    }, []);

    const overviewOrEmpty = apiData ? <OverviewByTeam data={apiData} /> : <div></div>;


    const subscriptionDropDownBox = apiData ? <div className="subscription-dropdown-box">
        <select className="subscription-dropdown">
            {apiData.map((subscription) => {
                return <option key={subscription.Subscription.id}>{subscription.Subscription.displayName}</option>
            })}
        </select>
    </div> : <div></div>;

    const subscriptions = apiData ? apiData.map((data) => data.Subscription) : [];

    return (
        <>
        <SubscriptionSelector subscriptions={subscriptions} />
        <div className="App">
            {overviewOrEmpty}
        </div>
        </>
    )
}

