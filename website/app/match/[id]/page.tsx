'use client'
import MapComponent from "@/components/map"
import { CardsMetric } from "@/components/match/cotes"
import { History } from "@/components/match/history"
import { useMatches } from "@/context/matchesContext"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const Page = () => {

    const [match, setMatch] = useState<IMatche | undefined>(undefined)
    const { matches } = useMatches()
    const params = useParams()
    const [AI, setAI] = useState()

    async function forcastData(url = '', data = {}) {
        const response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'ApiKey 7d49ef56-6110-11ee-a67f-aed432a5522d'
          },
          body: JSON.stringify(data)
        });
        //@ts-ignore
        setAI(await response.json())
        console.log(await response.json());
        
    }

    useEffect(() => {
        if (match === undefined) {
            console.log('eee');
            
            const selectMatch = matches.find(x => x.id === params.id)
            setMatch(selectMatch)
            /*
            forcastData("https://api.obviously.ai/v3/model/automl/predict/single/ffc23890-6117-11ee-a611-4715fb958c39", {
                "home_team": selectMatch?.teams.team_a.name,
                "away_team": selectMatch?.teams.team_b.name,
                "neutral": "True",
                "world_cup": "True"
            })
            */
        }
    }, [matches])

    return (
        <div className="min-h-screen">
            <div className="fixed top-32 flex-col left-1/2 -translate-x-1/2 -z-10 font-semibold flex gap-2 items-center px-6 py-2 bg-background/30 backdrop-blur-md border border-white/30 rounded-xl">
                <div className="flex justify-between sm:gap-3 gap-2 min-w-max items-center">
                    <span className="flex items-center min-w-fit">
                        <span className="ml-2 sm:text-3xl text-2xl">{match?.teams.team_a.unicode}</span>
                        <span className="whitespace-nowrap sm:text-2xl text-base">{match?.teams.team_a.french_name}</span>
                    </span>
                    <span className="block sm:text-2xl text-base">vs</span>
                        <span className="flex items-center min-w-fit">
                        <span className="ml-2 sm:text-3xl text-2xl">{match?.teams.team_b.unicode}</span>
                        <span className="whitespace-nowrap sm:text-2xl text-base">{match?.teams.team_b.french_name}</span>
                    </span>
                </div>
                {//@ts-ignore
                match?.teams.bet_a !== 'N/A' && <div className="text-3xl text-center font-black flex items-center justify-around w-full">
                    <span>{match?.teams.bet_a}</span> <span className="flex flex-col text-sm font-normal">côte</span> <span>{match?.teams.bet_b}</span>
                </div>}
                {//@ts-ignore
                match?.teams.bet_a !== 'N/A' && <div className="text-3xl text-center items-center font-black flex justify-around w-full">
                    <span>{match?.teams.score_a}</span> <span className="flex flex-col text-sm font-normal">score</span> <span>{match?.teams.score_b}</span>
                </div>}
            </div>
            <div className="h-[80vh] -z-20 fixed top-0 left-0 w-full">
                <MapComponent lat={match?.latitude || 0} lon={match?.longitude || 0} />
            </div>
            <div className="bg-background mt-[70vh] lg:p-20 p-10 flex gap-4 h-fit">
                <div className="">

                </div>
                <History home_team={match?.teams.team_a} away_team={match?.teams.team_b} />
                <div className="grid gap-4 w-full">
                    <CardsMetric team={match?.teams.team_b} />
                    <CardsMetric team={match?.teams.team_a} />
                </div>
            </div>
        </div>
    )
}

export default Page
