export function VisualisationDropdown({ onChange }: { onChange: (visualisation: string) => void; }) {
    const options = [
        { value: 'OverviewByTeam', label: 'Overview By Team' },
        { value: 'visualisation-2', label: 'Visualisation 2' },
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
