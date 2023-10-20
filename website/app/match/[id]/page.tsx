'use client'
import MapComponent from "@/components/map"
import { CardsMetric } from "@/components/match/cotes"
import { History } from "@/components/match/history"
import { useMatches } from "@/context/matchesContext"
import { getCode } from "country-list"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getTranslatedCountry } from '../../../components/match/countriesMap'; // Remplacez par le chemin correct

const Page = () => {

    const [match, setMatch] = useState<IMatche | null>()
    const { matches } = useMatches()
    const params = useParams()
    const { teams } = useMatches(); // Uncomment this if you are fetching teams using context

    useEffect(() => {
        setMatch(matches.find(x => x.id === params.id))
    }, [matches])

    return (
        <div className="min-h-screen">
            <div className="fixed top-32 left-1/2 -translate-x-1/2 -z-10 font-semibold flex items-center px-6 py-2 bg-background/30 backdrop-blur-md border border-white/30 rounded-xl">
                <div className="flex justify-between sm:gap-3 gap-2 min-w-max items-center">
                    <span className="flex items-center min-w-fit">
                        <span className="ml-2 mr-4 sm:text-3xl text-2xl">{teams[match?.teams?.team_a ?? '']?.unicode || '🇬🇧'}</span>
                        <span className="whitespace-nowrap sm:text-2xl text-base">{getTranslatedCountry(match?.teams.team_a || '', teams)}</span>
                    </span>
                    <span className="block sm:text-2xl text-base">vs</span>
                        <span className="flex items-center min-w-fit">
                        <span className="ml-2 mr-4 sm:text-3xl text-2xl">{teams[match?.teams?.team_b ?? '']?.unicode || '🇬🇧'}</span>
                        <span className="whitespace-nowrap sm:text-2xl text-base">{getTranslatedCountry(match?.teams.team_b || '', teams)}</span>
                    </span>
                </div>
            </div>
            <div className="h-[80vh] -z-20 fixed top-0 left-0 w-full">
                <MapComponent lat={match?.latitude || 0} lon={match?.longitude || 0} />
            </div>
            <div className="bg-background mt-[70vh] lg:p-20 p-10 flex gap-4 h-fit">
                <History home_team={match?.teams.team_a || ''} away_team={match?.teams.team_b || ''} />
                <div className="grid gap-4 w-full">
                    <CardsMetric team={match?.teams.team_b || ''} />
                    <CardsMetric team={match?.teams.team_a || ''} />
                </div>
            </div>
        </div>
    )
}

export default Page
