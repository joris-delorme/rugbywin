'use client'
import MapComponent from "@/components/map"
import { CardsMetric } from "@/components/match/cotes"
import { History } from "@/components/match/history"
import { useToast } from "@/components/ui/use-toast"
import { useMatches } from "@/context/matchesContext"
import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

interface IPrediction {
    away_team: number,
    home_team: number
}

const Page = () => {

    const [match, setMatch] = useState<IMatche | undefined>(undefined)
    const { matches } = useMatches()
    const params = useParams()
    const [AI, setAI] = useState<IPrediction>({
        away_team: 0,
        home_team: 0
    })

    const { toast } = useToast()

    async function forcastData(selectMatch: IMatche) {
        try {
            console.log(selectMatch?.teams.team_a.name, selectMatch?.teams.team_b.name);
            
            const response = await axios.post('https://us-central1-rugby-win-1696856418173.cloudfunctions.net/ai', {
                team_a: selectMatch?.teams.team_a.name,
                team_b: selectMatch?.teams.team_b.name
            })
            setAI(await response.data.probabilities)
        } catch (err) {
            console.log(err)
            toast({
                title: "Un erreur de connexion c'est produite",
                description: (err as Error).message,
                variant: "destructive"
            })
        }
        
    }

    useEffect(() => {
        if (!match) {
            console.log('eee');
            
            const selectMatch = matches.find(x => x.id === params.id)
            if (selectMatch?.teams.team_a.name && selectMatch?.teams.team_b.name) {                
                setMatch(selectMatch)
                forcastData(selectMatch)
            }
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
            <div className="bg-background mt-[70vh] lg:p-20 p-10 h-fit">
                    {AI?.home_team && <h2 className="sm:text-3xl text-xl mb-20 text-center max-w-2xl font-bold mx-auto">Notre <span className='gradient-text'>intelligence artificiel</span> prédie que <span className="whitespace-nowrap">{match?.teams?.team_a?.pronoun} {match?.teams?.team_a?.french_name}</span> à <span className="font-black underline">{Math.round(AI?.home_team*100)}%</span> de chance de gagner et {match?.teams?.team_b?.pronoun} {match?.teams?.team_b?.french_name} en a <span className="font-black underline">{Math.round(AI?.away_team*100)}%</span>.</h2>}

                <div className="flex gap-4">
                    <History home_team={match?.teams.team_a} away_team={match?.teams.team_b} />
                    <div className="grid gap-4 w-full">
                        <CardsMetric team={match?.teams.team_b} />
                        <CardsMetric team={match?.teams.team_a} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
