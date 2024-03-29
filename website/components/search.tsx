'use client'
import { useMatches } from "@/context/matchesContext";
import Fuse from 'fuse.js';
import { useEffect, useState } from "react";
import Link from "next/link";

export const Search = () => {
    const { matches } = useMatches()
    const [search, setSearch] = useState("")
    const [results, setResults] = useState<IMatche[]>([])

    const fuse = new Fuse(matches, {
        keys: ['teams.team_a.french_name', 'teams.team_b.french_name'],
        threshold: 0.9
    })

    useEffect(() => {
        console.log('Matches :', matches);
        
    }, [matches])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (e.target.value.length >= 3) {
            setResults(fuse.search(e.target.value).map(result => result.item));
        } else {
            setResults([]);
        }
    }

    return (
        <div className="max-w-xl mx-auto relative p-4 z-10 border rounded-xl bg-background w-full">
            <input
                type="text"
                value={search}
                onChange={handleSearch}
                className="w-full outline-none bg-transparent placeholder:text-muted-foreground"
                placeholder="Cherchez une équipe..."
            />
            {results.length > 0 && (
                <div className="mt-2 z-10 max-h-80 overflow-y-scroll">
                    {results.slice(0,10).map(match => (
                        <Link href={`/match/${match.id}`} key={match.id} className="p-2 border-b hover:bg-muted/80 cursor-pointer transition-all block">
                            <div className="font-semibold">
                                <span className="mr-2 text-xl">{match.teams.team_a.unicode}</span>
                                {match.teams.team_a.french_name} vs 
                                <span className="mx-2 text-xl">{match.teams.team_b.unicode}</span>
                                {match.teams.team_b.french_name}
                            </div>
                            <div className="text-sm text-muted-foreground">{match.date}</div>
                            <div className="text-sm text-muted-foreground">{match.venue}</div>
                        </Link>
                    ))}
                </div>
            )}
            {results.length === 0 && search.length >= 3 && (
                <div className="mt-2 text-muted-foreground">
                    Aucun résultat trouvé.
                </div>
            )}
        </div>
    );
};
