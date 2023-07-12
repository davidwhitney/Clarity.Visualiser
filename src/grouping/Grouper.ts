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

export function groupByAppName(data: any[]) {
    return data.reduce((acc: { [x: string]: any[]; }, cur: { tags: any; }) => {
        const tags = cur.tags;
        const app = tags?.application;
        if (app) {
            if (!acc[app]) {
                acc[app] = [];
            }
            acc[app].push(cur);
        }
        return acc;
    }, {} as any);
}