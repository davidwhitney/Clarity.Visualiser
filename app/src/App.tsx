import { useEffect, useState } from 'react';
import { SubscriptionSelector } from './layout/SubscriptionSelector';
import { VisualisationDropdown, selectVisualisation as renderVisualisation } from './layout/VisualisationDropdown';
import './App.css';

export default function App() {
    const [apiData, setApiData] = useState<SubscriptionAndResources[] | null>(null);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [selectedVisualisation, setSelectedVisualisation] = useState<string>('ArchitectureDiagram');
    const [showAllSubscriptions, setShowAllSubscriptions] = useState<boolean>(false);

    const updateAppData = async () => {
        const result = await fetch('/api/home');
        if (!result.ok) {
            return;
        }
        
        const data: SubscriptionAndResources[] = await result.json();
        if (data.length === 0) {
            return;
        }

        setApiData(data);
        setSelectedSubscription(data[0].Subscription);
    }

    useEffect(() => { 
        updateAppData(); 
    }, []);

    const selectedSub = apiData?.find((data) => data.Subscription.subscriptionId === selectedSubscription?.subscriptionId) || null;
    const subscriptions = apiData?.map((data) => data.Subscription) || [];
    
    // Choose whether to show all subscription data or just the selected one
    const overviewOrEmpty = apiData ? 
        renderVisualisation(
            selectedVisualisation, 
            selectedSub, 
            showAllSubscriptions ? apiData : null
        ) : <></>;

    return (
        <>
        <header>
            <SubscriptionSelector 
                subscriptions={subscriptions} 
                onSelect={setSelectedSubscription} 
                showAllEnabled={selectedVisualisation === 'ArchitectureDiagram'}
                showAllSubscriptions={showAllSubscriptions}
                onToggleShowAll={setShowAllSubscriptions}
            />
            <VisualisationDropdown onChange={setSelectedVisualisation} />
        </header>
        <div className="App">
            {overviewOrEmpty}
        </div>
        </>
    )
}


