import { db } from "@/config/firebase";
import { useEffect, useState } from "react";
import { and, collection, getDocs, or, query, where } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface HistoryProps {
    home_team?: ITeam
    away_team?: ITeam
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
            if (!home_team || !away_team) return
            const matchesRef = collection(db, "history")
            const data: IHistoryMatch[] = []
            let q = query(matchesRef, or(
                and(where("home_team", "==", home_team.id), where("away_team", "==", away_team.id)), 
                and(where("home_team", "==", away_team.id), where("away_team", "==", home_team.id))
            ))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                data.push({ 
                    ...doc.data(),
                    id: doc.id,
                    home_team: [home_team, away_team].find(x => x.id === doc.data().home_team),
                    away_team: [home_team, away_team].find(x => x.id === doc.data().away_team)
                } as IHistoryMatch)
            })
            setMatches(data)
            setStats({
                home_team_victorys: Math.round(data.filter(x => (x.home_team.id === home_team.id && x.winner === 'home_team') || (x.away_team.id === home_team.id && x.winner === 'away_team')).length),
                away_team_victorys: Math.round(data.filter(x => (x.home_team.id === away_team.id && x.winner === 'away_team') || (x.away_team.id === away_team.id && x.winner === 'away_team')).length)
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

    if (!home_team || !away_team) return <></>

    return (
        <Card className="w-fit max-w-xl">
            <CardHeader>
                <CardTitle>Historique</CardTitle>
                <CardDescription>
                    {home_team.pronoun} {home_team.french_name} a gagné <span className="font-bold">{stats?.home_team_victorys}</span> matchs contre {away_team.pronoun} {away_team.french_name} et en a perdu <span className="font-bold">{stats?.away_team_victorys}</span>. Basé sur l&apos;historique, {home_team.pronoun} {home_team.french_name} a <span className="font-bold">{Math.round(stats.home_team_victorys / (stats.home_team_victorys+stats.away_team_victorys)  * 100)}%</span> de chance de gagner et {away_team.pronoun} {away_team.french_name} en a <span className="font-bold">{Math.round(stats.away_team_victorys / (stats.home_team_victorys+stats.away_team_victorys) * 100)}%</span>.
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
                                            <td className="border p-2 text-xs">
                                                {match.home_team.french_name}: {match.home_score}
                                            </td>
                                            <td className="border p-2 text-xs">
                                                {match.away_team.french_name}: {match.away_score}
                                            </td>
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