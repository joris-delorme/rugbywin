"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { useMatches } from "@/context/matchesContext"
import { useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton"

interface IBet {
  team_a: string,
  team_b: string,
  team_a_bet: number,
  team_b_bet: number,
  date: string
}

export function CardsMetric({ team }: { team?: ITeam }) {
  const [cotes, setCotes] = useState<IBet[]>([])
  const { matches } = useMatches()

  useEffect(() => {
    if (team?.id && matches.length && !cotes.length) {      
      const data = matches.filter(x => x.teams.team_a.id === team.id || x.teams.team_b.id === team.id)
      data.forEach((match) => {
        setCotes(old => [...old, {
          team_a: team.french_name,
          team_b: match.teams.team_a.id === team.id ? match.teams.team_b.french_name : match.teams.team_a.french_name,
          team_a_bet: match.teams.team_a === team ? match.teams.bet_a : match.teams.bet_b,
          team_b_bet: match.teams.team_a === team ? match.teams.bet_b : match.teams.bet_a,
          date: match.date
        }])
      })
    }
  }, [team, matches])

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Exercise Minutes</CardTitle>
        <CardDescription>
          Your excercise minutes are ahead of where you normally are.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {cotes.length === 0 ?
          <Skeleton className="h-[200px] w-full" />
          :
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={cotes}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {(payload[0].payload as IBet).team_a}
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0].value}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {(payload[0].payload as IBet).team_b}
                              </span>
                              <span className="font-bold">
                                {payload[1].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    return null
                  }}
                />
                <Line
                  type="monotone"
                  strokeWidth={2}
                  dataKey="team_b_bet"
                  activeDot={{
                    r: 8,
                  }}
                  style={
                    { opacity: 1 } as React.CSSProperties
                  }
                />
                <Line
                  type="monotone"
                  dataKey="team_a_bet"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                  }}
                  style={
                    { opacity: 0.5 } as React.CSSProperties
                  }
                />
              </LineChart>
            </ResponsiveContainer>
          </div>}
      </CardContent>
    </Card>
  )
}