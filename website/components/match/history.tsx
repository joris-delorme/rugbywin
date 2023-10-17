import { db } from "@/config/firebase";
import { getCode } from "country-list";
import { and, collection, getDocs, or, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import countries from './countriesMap';

interface HistoryProps {
    home_team: string
    away_team: string
}

interface IHistoryStats {
    home_team_victorys: number
    away_team_victorys: number
}

export function History({ home_team, away_team }: HistoryProps) {

    const [matches, setMatches] = useState<RugbyMatch[]>([])
    const [stats, setStats] = useState<IHistoryStats>({
        home_team_victorys: 0,
        away_team_victorys: 0
    })

    const getArticleByGender = (country: string) => {
        const gender = countries[country]?.gender || 'm';
        return gender === 'f' ? 'la' : 'le';
    };
    
    const countriesWithApostrophe = [
        "Afrique du Sud",
        "Angleterre",
        "Australie",
        "Irlande",
        "Écosse",
        "Argentine",
        "Italie",
        "Uruguay"
    ];
    
    const getArticleWithApostrophe = (country: string) => {
        const translatedCountry = getTranslatedCountry(country);
        
        if (countriesWithApostrophe.includes(translatedCountry)) {
            return "l'";
        }
        return getArticleByGender(country) + ' ';
    };       
    
    const getTranslatedCountry = (country: string) => countries[country]?.translation || country;
    
    const getTranslatedCountryPossessive = (country: string) => {
        const translatedCountry = getTranslatedCountry(country);
        
        if (countriesWithApostrophe.includes(translatedCountry)) {
            return `l'${translatedCountry}`;
        }
        return `${getArticleByGender(country)} ${translatedCountry}`;
    };    
    
    const homeTeamArticle = getArticleByGender(home_team);
    const awayTeamArticle = getArticleByGender(away_team);
    const homeTeamTranslated = getTranslatedCountry(home_team);
    const awayTeamTranslated = getTranslatedCountry(away_team);
    const homeTeamArticleApostrophe = getArticleWithApostrophe(home_team);
    const awayTeamArticleApostrophe = getArticleWithApostrophe(away_team);

    useEffect(() => {
        const getMatches = async () => {
            const matchesRef = collection(db, "history")
            const data: RugbyMatch[] = []
            let q = query(matchesRef, or(
                and(where("home_team", "==", home_team), where("away_team", "==", away_team)), 
                and(where("home_team", "==", away_team), where("away_team", "==", home_team))
            ))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as RugbyMatch)
            })
            setMatches(data)
            setStats({
                home_team_victorys: Math.round(data.filter(x => (x.home_team === home_team && x.winner === 'home_team') || (x.away_team === home_team && x.winner === 'away_team')).length),
                away_team_victorys: Math.round(data.filter(x => (x.home_team === away_team && x.winner === 'away_team') || (x.away_team === away_team && x.winner === 'away_team')).length)
            })
        }
        if (!matches.length && home_team) getMatches()
    }, [home_team])

    const groupedByYear = matches.reduce<Record<string, RugbyMatch[]>>(
        (acc, match) => {
            const year = new Date(match.date).getFullYear().toString();
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(match);
            return acc;
        },
        {}
    );

    return (
        <Card className="w-fit max-w-xl">
            <CardHeader>
                <CardTitle>Historique</CardTitle>
                <CardDescription>
                    {homeTeamArticleApostrophe.charAt(0).toUpperCase() + homeTeamArticleApostrophe.slice(1)}{homeTeamTranslated} a gagné <span className="font-bold">{stats?.home_team_victorys}</span> matchs contre {awayTeamArticleApostrophe}{awayTeamTranslated} et en a perdu <span className="font-bold">{stats?.away_team_victorys}</span>. Basé sur l'historique, {getTranslatedCountryPossessive(home_team)} a <span className="font-bold">{Math.round(stats.away_team_victorys / (stats.home_team_victorys+stats.away_team_victorys)  * 100)}%</span> de chance de gagner et {getTranslatedCountryPossessive(away_team)} en a <span className="font-bold">{Math.round(stats.home_team_victorys / (stats.home_team_victorys+stats.away_team_victorys) * 100)}%</span>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] overflow-y-scroll">
                    {Object.entries(groupedByYear).reverse().map(([year, matches]) => (
                        <div key={year} className="mb-6">
                            <h2 className="text-lg font-semibold mb-1">{year}</h2>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border p-1 text-sm">Information</th>
                                        <th className="border p-1 text-sm">Domicile</th>
                                        <th className="border p-1 text-sm">Extérieur</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matches.map(match => (
                                        <tr key={match.date}>
                                            <td className="border p-2 text-xs max-w-[150px]">
                                                Le {match.date} à {match.city} au {match.stadium}.
                                            </td>
                                            <td className="border p-2 text-xs">{match.home_team}: {match.home_score}</td>
                                            <td className="border p-2 text-xs">{match.away_team}: {match.away_score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}