import { ArchitectureDiagram } from "../pages/Overview/ArchitectureDiagram";
import { OverviewByComponent } from "../pages/Overview/OverviewByComponent";
import { OverviewByTeam } from "../pages/Overview/OverviewByTeam";
import { OverviewByWebApp } from "../pages/Overview/OverviewByWebApp";

export function selectVisualisation(visualisationKey: string, selectedSub: SubscriptionAndResources | null) {
    switch (visualisationKey) {
        case 'OverviewByTeam':
            return <OverviewByTeam subscriptionAndResources={selectedSub} />;
        case 'OverviewByComponent':
            return <OverviewByComponent subscriptionAndResources={selectedSub} />;
        case 'OverviewByWebApp':
            return <OverviewByWebApp subscriptionAndResources={selectedSub} />;
        case 'ArchitectureDiagram':
            return <ArchitectureDiagram subscriptionAndResources={selectedSub} />;
        default:
            return <></>;
    }
}

export function VisualisationDropdown({ onChange }: { onChange: (visualisation: string) => void; }) {
    const options = [
        { value: 'OverviewByTeam', label: 'Overview By Team' },
        { value: 'OverviewByComponent', label: 'Overview By Component' },
        { value: 'OverviewByWebApp', label: 'Overview By Web App' },
        { value: 'ArchitectureDiagram', label: 'Architecture Diagram' },
    ];

    const elements = options.map((option) => {
        return <option key={option.value} value={option.value}>{option.label}</option>;
    });

    return (
        <div className="visualisation-dropdown">
            <select onChange={(e) => onChange(e.target.value)} name="visualisation" id="visualisation">
                {elements}
            </select>
        </div>
    );
}
