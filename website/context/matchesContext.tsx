'use client'
import { db } from '@/config/firebase'
import { collection, getDocs } from '@firebase/firestore'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

interface MatchesContextProps {
  matches: IMatche[]
}

const MatchesContext = createContext<MatchesContextProps | undefined>(undefined)

export const MatchesProvider = ({ children }: { children: ReactNode }) => {
  const [matches, setMatches] = useState<IMatche[]>([]);

  const getMatches = async () => {
    const matchesData: IMatche[] = []
    const teams = await getTeams()
    const data = await getDocs(collection(db, 'matches'))
    data.docs.map((matchDoc) => {

      if (teams.find(x => x.id === matchDoc.data().teams.team_a) && teams.find(x => x.id === matchDoc.data().teams.team_b)) {
        matchesData.push({
          ...matchDoc.data() as IMatche,
          id: matchDoc.id,
          teams: {
            ...(matchDoc.data() as IMatche).teams,
            team_a: teams.find(x => x.id === matchDoc.data().teams.team_a)!,
            team_b: teams.find(x => x.id === matchDoc.data().teams.team_b)!
          }
        }) 
      } 
    })
    setMatches(matchesData)
  }

  const getTeams = async () => {
    let teams: ITeam[] = []
    const data = await getDocs(collection(db, 'teams'))
    data.docs.forEach((teamDoc) => {
      teams.push({
        ...teamDoc.data() as ITeam,
        id: teamDoc.id
      })
    })    
    return teams
  }

  useEffect(() => {
    if (!matches.length) getMatches();
  }, [matches]);

  return (
    <MatchesContext.Provider value={{ matches }}>
      {children}
    </MatchesContext.Provider>
  );
}

export const useMatches = () => {
  const context = useContext(MatchesContext)
  if (context === undefined) {
    throw new Error('useMatches must be used within an MatchesProvider')
  }
  return context
}
