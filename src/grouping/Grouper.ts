export function groupByOwner(data: any[]) {
    const grouped = data.reduce((acc, cur) => {
        const tags = cur.tags;
        const team = tags?.team;
        if (team) {
            if (!acc[team]) {
                acc[team] = [];
            }
            acc[team].push(cur);
        }
        return acc;
    }, {} as any);

    return grouped;

}