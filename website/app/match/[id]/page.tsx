'use client'
import MapComponent from "@/components/map"
import { History } from "@/components/matche/history"
import { useMatches } from "@/context/matchesContext"
import { getCode } from "country-list"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import ReactCountryFlag from "react-country-flag"

const Page = () => {

    const [match, setMatch] = useState<IMatche | null>()
    const { matches } = useMatches()
    const params = useParams()

    useEffect(() => {
        setMatch(matches.find(x => x.id === params.id))
    }, [matches])

    return (
        <div className="min-h-screen w-full">
            <div className="fixed top-32 left-1/2 -translate-x-1/2 -z-10 font-semibold flex items-center sm:text-3xl w-fit text-xl mx-auto px-6 py-2 bg-background/30 backdrop-blur-md border border-white/30 rounded-xl">
                <div className="flex gap-2">
                <span className="flex w-fulle"><ReactCountryFlag countryCode={getCode(match?.teams.team_a || '') || 'GB'} svg className="mr-2" /> <span className="whitespace-nowrap">{match?.teams.team_a}</span> </span>
                <span className="block">vs</span>
                <span className="flex"><ReactCountryFlag countryCode={getCode(match?.teams.team_b || '') || 'GB'} svg className="ml-4 mr-2" /> <span className="whitespace-nowrap">{match?.teams.team_b}</span> </span>
                </div>
            </div>
            <div className="h-[80vh] -z-20 fixed top-0 left-0 w-full">
                <MapComponent lat={match?.latitude || 0} lon={match?.longitude || 0} />
            </div>
            <div className="h-screen bg-background mt-[70vh] lg:p-20 p-10">
                <History home_team={match?.teams.team_a || ''} away_team={match?.teams.team_b || ''} />
            </div>
        </div>
    )
}

export default Page