import { useEffect, useState } from 'react';
import { OverviewByTeam } from './components/pages/OverviewByTeam/index';
import { SubscriptionSelector } from './components/elements/SubscriptionSelector';
import { VisualisationDropdown } from './components/elements/VisualisationDropdown';
import './App.css';

export default function App() {
    const [apiData, setApiData] = useState<SubscriptionAndResources[] | null>(null);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [selectedVisualisation, setSelectedVisualisation] = useState<string>('OverviewByTeam');

    useEffect(() => {
        (async () => {
            const result = await fetch('/api/home');
            const data = await result.json();
            setApiData(data);
            data.length > 0 && setSelectedSubscription(data[0].Subscription);
        })();
    }, []);

    const getActiveVisualisation = () => {
        switch (selectedVisualisation) {
            case 'OverviewByTeam':
                return <OverviewByTeam subscriptionAndResources={selectedSub} />;
            default:
                return <></>;
        }        
    };

    const selectedSub = apiData?.find((data) => data.Subscription.subscriptionId === selectedSubscription?.subscriptionId) || null;
    const subscriptions = apiData?.map((data) => data.Subscription) || [];
    const overviewOrEmpty = apiData ? getActiveVisualisation() : <></>;

    return (
        <>
        <header>
            <SubscriptionSelector subscriptions={subscriptions} onSelect={setSelectedSubscription} />
            <VisualisationDropdown onChange={setSelectedVisualisation} />
        </header>
        <div className="App">
            {overviewOrEmpty}
        </div>
        </>
    )
}


