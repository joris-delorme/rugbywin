'use client'
import { useMatches } from "@/context/matchesContext"
import Fuse from 'fuse.js';
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { getCode } from 'country-list';
import Link from "next/link";

export const Search = () => {
    const { matches } = useMatches()

    const [search, setSearch] = useState("");
    const [results, setResults] = useState<IMatche[]>([]);

    const fuse = new Fuse(matches, {
        keys: ['teams.team_a', 'teams.team_b'],
        threshold: 0.3
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (e.target.value.length >= 3) {
            setResults(fuse.search(e.target.value).map(result => result.item))
        } else {
            setResults([])
        }
    }

    return (
        <div className="max-w-xl mx-auto relative p-4 z-10 border rounded-xl bg-background w-full">
            <input
                type="text"
                value={search}
                onChange={handleSearch}
                className="w-full outline-none bg-transparent placeholder:text-muted-foreground"
                placeholder="Search for a team..."
            />
            {results.length > 0 && (
                <div className="mt-2 z-10 max-h-80 overflow-y-scroll">
                    {results.slice(0,10).map(match => (
                        <Link href={`/match/${match.id}`} key={match.id} className="p-2 border-b hover:bg-muted/80 cursor-pointer transition-all block">
                            <div className="font-semibold">
                                <ReactCountryFlag countryCode={getCode(match.teams.team_a) || 'GB'} svg className="mr-2" />
                                {match.teams.team_a} vs 
                                <ReactCountryFlag countryCode={getCode(match.teams.team_b) || 'GB'} svg className="mx-2" />
                                {match.teams.team_b}</div>
                            <div className="text-sm text-muted-foreground">{match.date}</div>
                            <div className="text-sm text-muted-foreground">{match.venue}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
