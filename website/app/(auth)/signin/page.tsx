"use client"
import GoogleButton from "@/components/google-button"
import { Loader } from "@/components/ui/loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/config/firebase"
import { firebaseError } from "@/lib/utils"
import { createUserWithEmailAndPassword } from "firebase/auth"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { useRouter } from "next/navigation"

const Page = () => {
    const [user, setUser] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handler = async () => {
        setLoading(true)
        try {
            const userCreditential = await createUserWithEmailAndPassword(auth, user.email, user.password)
            const res = await axios.post('https://us-central1-rugby-win-1696856418173.cloudfunctions.net/newsletter', {
                email: userCreditential.user.email
            })
            console.log(res.data)

        } catch (err) {
            toast({
                title: "Un erreur de connexion c'est produite",
                description: firebaseError(err as Error),
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const navigate = useRouter()
    useEffect(() => { if (auth.currentUser) { navigate.push('/') } }, [auth.currentUser])

    return (
        <div className="h-screen flex items-center justify-center relative">
            <div className="p-8 sm:relative">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center mb-8">
                        <h1 className="text-2xl font-semibold tracking-tight">Créer un compte</h1>
                        <p className="text-sm text-muted-foreground">Entrez vos inforamtions en dessous.</p>
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">Votre meilleur adresse mail.</Label>
                        <Input placeholder="nom@exemple.com" type="email" id="email" onChange={(e) => setUser(old => ({ ...old, email: e.target.value }))} />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="password">Votre mot de passe</Label>
                        <Input placeholder="monmotdepasse*" type="password" id="password" onChange={(e) => setUser(old => ({ ...old, password: e.target.value }))} />
                    </div>

                    <Button onClick={() => handler()} disabled={loading}>{loading && <Loader />}S&apos;inscrire</Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
                        </div>
                    </div>
                    <GoogleButton />
                    <p className="t-muted-foreground text-xs px-8 text-center">En cliquan sur le bouton, vous acceptez nos <Link className="hover:text-primary underline underline-offset-2" href={'#'}>Terms of Service</Link> et <Link href={"#"} className="hover:text-primary underline underline-offset-2">Politique de Confidentialité</Link>.</p>
                </div>
            </div>
            <Link href='/login' className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"><span className="whitespace-nowrap">Vous avez déjà un compte ?</span> <span className="underline" >Connectez-vous</span></Link>
        </div>
    )
}

export default Page