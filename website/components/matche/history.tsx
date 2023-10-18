import { db } from "@/config/firebase";
import { getCode } from "country-list";
import { and, collection, getDocs, or, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface HistoryProps {
    home_team: string
    away_team: string
}

interface IHistoryStats {
    home_team_victorys: number
    away_team_victorys: number
}

export function History({ home_team, away_team }: HistoryProps) {

    const [matches, setMatches] = useState<IHistoryMatch[]>([])
    const [stats, setStats] = useState<IHistoryStats>({
        home_team_victorys: 0,
        away_team_victorys: 0
    })

    useEffect(() => {
        const getMatches = async () => {
            const matchesRef = collection(db, "history")
            const data: IHistoryMatch[] = []
            let q = query(matchesRef, or(
                and(where("home_team", "==", home_team), where("away_team", "==", away_team)), 
                and(where("home_team", "==", away_team), where("away_team", "==", home_team))
            ))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as IHistoryMatch)
            })
            setMatches(data)
            setStats({
                home_team_victorys: Math.round(data.filter(x => (x.home_team === home_team && x.winner === 'home_team') || (x.away_team === home_team && x.winner === 'away_team')).length),
                away_team_victorys: Math.round(data.filter(x => (x.home_team === away_team && x.winner === 'away_team') || (x.away_team === away_team && x.winner === 'away_team')).length)
            })
        }
        if (!matches.length && home_team) getMatches()
    }, [home_team])

    const groupedByYear = matches.reduce<Record<string, IHistoryMatch[]>>(
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
                <CardTitle>Histrique</CardTitle>
                <CardDescription>
                    La {home_team} à gagné <span className="font-bold">{stats?.home_team_victorys}</span> contre la {away_team} et perdu <span className="font-bold">{stats?.away_team_victorys}</span>.
                    Basé sur l'historique {home_team} a <span className="font-bold">{Math.round(stats.away_team_victorys / (stats.home_team_victorys+stats.away_team_victorys)  * 100)}%</span> de chance et {away_team} a <span className="font-bold">{Math.round(stats.home_team_victorys / (stats.home_team_victorys+stats.away_team_victorys) * 100)}%</span>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[600px] overflow-y-scroll">
                    {Object.entries(groupedByYear).reverse().map(([year, matches]) => (
                        <div key={year} className="mb-6">
                            <h2 className="text-lg font-semibold mb-1">{year}</h2>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border p-1 text-sm">Informtaion</th>
                                        <th className="border p-1 text-sm">Home</th>
                                        <th className="border p-1 text-sm">Away</th>
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