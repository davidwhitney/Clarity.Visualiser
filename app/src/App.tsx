import { useEffect, useState } from 'react';
import './App.css';
import { OverviewByTeam } from './components/OverviewByTeam';

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


    return (
        <div className="App">
            {overviewOrEmpty}
        </div>
    )
}