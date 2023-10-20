'use client'
import { db } from '@/config/firebase'
import { collection, getDocs } from '@firebase/firestore'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { Team } from '@/components/match/countriesMap';  // Adjust the path accordingly

interface MatchesContextProps {
  matches: IMatche[];
  teams: Record<string, Team>; // Add this line
}

const MatchesContext = createContext<MatchesContextProps | undefined>(undefined)

export const MatchesProvider = ({ children }: { children: ReactNode }) => {
  const [matches, setMatches] = useState<IMatche[]>([]);
  const [teams, setTeams] = useState<Record<string, Team>>({});  // Initialize teams state

  const getMatches = async () => {
      const data = await getDocs(collection(db, 'matches'));
      const matchesData: IMatche[] = data.docs.map((matchDoc) => ({
          id: matchDoc.id,
          ...matchDoc.data()
      } as IMatche));
      setMatches(matchesData);
  };

  const getTeams = async () => {
      const data = await getDocs(collection(db, 'teams'));
      let teamsData: Record<string, Team> = {};
      data.docs.forEach((teamDoc) => {
          teamsData[teamDoc.id] = teamDoc.data() as Team;
      });
      setTeams(teamsData);
  };

  useEffect(() => { 
      if (!matches.length) getMatches();
  }, [matches]);

  useEffect(() => {
      if (Object.keys(teams).length === 0) getTeams();
  }, [teams]);

  return (
      <MatchesContext.Provider value={{ matches, teams }}>
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
