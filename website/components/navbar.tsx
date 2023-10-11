'use client'
import Link from "next/link"
import { Button } from "./ui/button"
import { auth } from "@/config/firebase"
import { User2 } from "lucide-react"
import { useAuthState } from 'react-firebase-hooks/auth';

export const Navbar = () => {
    const [user] = useAuthState(auth)

    return (
        <nav className="py-4 sm:px-20 px-6 flex w-full justify-between items-center fixed top-0 left-0 bg-black/30 backdrop-blur-md z-[9999]">
            <Link href='/' className="font-black">RUGBY WIN</Link>
            {
                user ?
                <div className="h-10 cursor-pointer w-10 rounded-full bg-muted flex items-center justify-center">
                    <User2 size={16} />
                </div>
                :
                <Button>
                <Link href='/login'>Connecter vous</Link>
            </Button>}
        </nav>
    )
}