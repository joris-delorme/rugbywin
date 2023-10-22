interface ITeam {
    id: string
    french_name: string
    name: string
    pronoun: string
    unicode: string
};

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
        team_a: ITeam,
        team_b: ITeam,
    },
    venue: string
}

interface IHistoryMatch {
    id: string;
    date: string;
    home_team: ITeam;
    away_team: ITeam;
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