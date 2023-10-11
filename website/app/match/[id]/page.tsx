'use client'
import MapComponent from "@/components/map"
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
        <div className="h-screen w-screen pt-32 flex flex-col items-center">
            <div className="font-semibold flex items-center text-3xl mx-auto px-6 py-2 bg-background/30 backdrop-blur-md border border-white/30 rounded-xl">
                <ReactCountryFlag countryCode={getCode(match?.teams.team_a || '') || 'GB'} svg className="mr-2" />
                {match?.teams.team_a} vs
                <ReactCountryFlag countryCode={getCode(match?.teams.team_b || '') || 'GB'} svg className="ml-4 mr-2" />
                {match?.teams.team_b}
            </div>
            <div className="absolute -z-10 h-screen w-full top-0 left-0">
                <MapComponent lat={match?.latitude || 0} lon={match?.longitude || 0} />
            </div>
        </div>
    )
}

export default Page