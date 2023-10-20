'use client'
import MapComponent from "@/components/map"
import { CardsMetric } from "@/components/match/cotes"
import { History } from "@/components/match/history"
import { useMatches } from "@/context/matchesContext"
import { getCode } from "country-list"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import ReactCountryFlag from "react-country-flag"
import { getTranslatedCountry } from '../../../components/match/countriesMap'; // Remplacez par le chemin correct

const Page = () => {

    const [match, setMatch] = useState<IMatche | null>()
    const { matches } = useMatches()
    const params = useParams()

    useEffect(() => {
        setMatch(matches.find(x => x.id === params.id))
    }, [matches])

    return (
        <div className="min-h-screen">
            <div className="fixed top-32 left-1/2 -translate-x-1/2 -z-10 font-semibold flex items-center px-6 py-2 bg-background/30 backdrop-blur-md border border-white/30 rounded-xl">
                <div className="flex justify-between gap-2 min-w-max">
                    <span className="flex items-center min-w-fit">
                        <ReactCountryFlag countryCode={getCode(match?.teams.team_a || '') || 'GB'} svg className="mr-4 text-xl" />
                        <span className="whitespace-nowrap sm:text-xl text-base">{getTranslatedCountry(match?.teams.team_a || '')}</span>
                    </span>
                    <span className="block sm:text-xl text-base">vs</span>
                    <span className="flex items-center min-w-fit">
                        <ReactCountryFlag countryCode={getCode(match?.teams.team_b || '') || 'GB'} svg className="ml-2 mr-2 text-xl" />
                        <span className="whitespace-nowrap sm:text-xl text-base">{getTranslatedCountry(match?.teams.team_b || '')}</span>
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
