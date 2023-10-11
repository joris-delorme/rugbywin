'use client'
import { useMatches } from "@/context/matchesContext"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const Page = () => {
    
    const [matche, setMatche] = useState<IMatche | null>()
    const { matches } = useMatches()
    const params = useParams()

    useEffect(() => {
        setMatche(matches.find(x => x.id === params.id))
    }, [matches])
    
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            {matche?.id}
        </div>
    )
}

export default Page