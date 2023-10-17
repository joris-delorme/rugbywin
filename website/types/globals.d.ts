interface IMatche {
    id: string,
    date: string,
    latitude: number,
    longitude: number,
    teams: {
        bet_a: number | "Closed",
        bet_b: number | "Closed",
        score_a: number | "N/A",
        score_b: number | "N/A",
        team_a: string,
        team_b: string,
    },
    venue: string
}