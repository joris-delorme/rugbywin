interface IMatche {
    id: string,
    date: string,
    latitude: number,
    longitude: number,
    teams: {
        bet_a: number,
        bet_b: number,
        score_a: number | "N/A",
        score_b: number | "N/A",
        team_a: string,
        team_b: string,
    },
    venue: string
}

interface IHistoryMatch {
    id: string;
    date: string;
    home_team: string;
    away_team: string;
    home_score: number;
    away_score: number;
    competition: string;
    stadium: string;
    city: string;
    country: string;
    neutral: boolean;
    world_cup: boolean;
    winner: 'home_team' | 'away_team' | null;
}