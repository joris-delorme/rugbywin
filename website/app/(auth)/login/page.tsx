"use client"
import GoogleButton from "@/components/google-button"
import { Loader } from "@/components/ui/loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/config/firebase"
import { firebaseError } from "@/lib/utils"
import { signInWithEmailAndPassword } from "firebase/auth"
import Link from "next/link"
import { useState } from "react"
import { async } from "@firebase/util"
import { useToast } from "@/components/ui/use-toast"

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
            await signInWithEmailAndPassword(auth, user.email, user.password)
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

    return (
        <div className="lg:p-8">
            <Button asChild variant="ghost" className="absolute right-10 top-10">
                <Link href={'/signin'}>S&apos;inscrire</Link>
            </Button>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
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

                <Button onClick={() => handler()} disabled={loading}>{loading && <Loader />}Connexion</Button>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
                    </div>
                </div>
                <GoogleButton />
                <p className="t-muted-foreground text-sm px-8 text-center">En cliquan sur le bouton, vous acceptez nos <Link className="hover:text-primary underline underline-offset-2" href={'#'}>Terms of Service</Link> et <Link href={"#"} className="hover:text-primary underline underline-offset-2">Politique de Confidentialité</Link>.</p>
            </div>
        </div>
    )
}

export default Page