'use client'
import { db } from '@/config/firebase'
import { collection, getDocs } from '@firebase/firestore'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

interface MatchesContextProps {
    matches: IMatche[]
}

const MatchesContext = createContext<MatchesContextProps | undefined>(undefined)

export const MatchesProvider = ({ children }: { children: ReactNode }) => {
  const [matches, setMatches] = useState<IMatche[]>([])
  const [historyMatches, setHistoryMatches] = useState<IMatche[]>([])

    const getMatches = async () => {
        const data = await getDocs(collection(db, 'matches'))
        data.docs.forEach((matche) => {
            setMatches(old => [...old, {id: matche.id, ...matche.data()} as IMatche])
        }) 
    }

    useEffect(() => { if (!matches.length) getMatches() }, [matches])

  return (
    <MatchesContext.Provider value={{ matches }}>
      {children}
    </MatchesContext.Provider>
  )
}

export const useMatches = () => {
  const context = useContext(MatchesContext)
  if (context === undefined) {
    throw new Error('useMatches must be used within an MatchesProvider')
  }
  return context
}
