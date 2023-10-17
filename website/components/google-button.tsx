"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/config/firebase';
import { firebaseError } from '@/lib/utils';
import { Loader } from '@/components/ui/loader';
import axios from 'axios'
import { useToast } from './ui/use-toast';

const GoogleButton = () => {

    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handler = async () => {
        try {
            const userCreditential = await signInWithPopup(auth, provider)
            await axios.post('https://us-central1-rugby-win-1696856418173.cloudfunctions.net/newsletter', {
                email: userCreditential.user.email
            })
        } catch (err) {
            console.log(err);
            
            toast({
                title: "Un erreur de connexion c'est produite",
                description: (err as Error).message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
            <Button disabled={loading} className="w-full" onClick={() => handler()} variant="outline">
                {loading && <Loader />} <span>Google</span>
            </Button>
    )
}

export default GoogleButton