"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "@/components/ui/loader"
import { useToast } from "@/components/ui/use-toast"
import { auth } from "@/config/firebase"
import { firebaseError } from "@/lib/utils"
import { sendPasswordResetEmail } from "firebase/auth"
import { Link } from "lucide-react"
import { useState } from "react"

const Page = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handler = async () => {
        setLoading(true)
        try {
            await sendPasswordResetEmail(auth, email)
            toast({
                title: "Email de récupération envoyé avec succès !",
                variant: "destructive"
            })
        } catch (err) {
            toast({
                title: "Une erreur de connexion s'est produite",
                description: firebaseError(err as Error),
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8">
            <Button asChild variant="ghost" className="absolute right-10 top-10">
                <Link href={'/login'}>Se connecter</Link>
            </Button>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">Mot de passe oublié</h1>
                    <p className="text-sm text-muted-foreground">Entrez vos informations en dessous pour récuperer votre mot de passe</p>
                </div>

                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Adresse mail</Label>
                    <Input placeholder="nom@exemple.com" type="email" id="email" onChange={(e) => setEmail(e.target.value)} />
                </div>

                <Button onClick={() => handler()} disabled={loading}>{loading && <Loader />}Récuperer</Button>
            </div>
        </div>
    )
}

export default Page