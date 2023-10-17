'use client'
import Link from "next/link"
import { Button } from "./ui/button"
import { auth } from "@/config/firebase"
import { ArrowRight, User2 } from "lucide-react"
import { useAuthState } from 'react-firebase-hooks/auth';
import { cn } from "@/lib/utils";
import { useState } from "react";

const linkCN = "hover:opacity-50 transition-all"

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [user] = useAuthState(auth)
    return (
        <>
            <nav>
                <div className="h-[64px] px-10 flex w-full justify-between items-center fixed top-0 left-0 bg-backgound/80 backdrop-blur-xl z-[999] border-b">
                    <Link href='/' className="font-black">RUGBY WIN</Link>
                    <ul className="gap-10 md:flex text-sm hidden items-center">
                        <li className={linkCN}><Link href='/'>Découvrir</Link></li>
                        <li className={linkCN}><Link href='/prix'>Prix</Link></li>
                        <li className={linkCN}><Link href='/contact'>Contact</Link></li>
                        <li>

                            {
                                user ?
                                    <div className="h-10 cursor-pointer w-10 rounded-full bg-muted flex items-center justify-center">
                                        <User2 size={16} />
                                    </div>
                                    :
                                    <Button size='sm' asChild>
                                        <Link className="flex" href='/login'>Rejoindre <ArrowRight className="h-4 w-4 ml-1" /></Link>
                                    </Button>
                            }</li>
                    </ul>

                    <button className="relative group md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                        <div className="relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all ring-opacity-30 duration-200">
                            <div className="flex flex-col justify-between w-[26px] h-[17px] transform transition-all duration-300 origin-center overflow-hidden">
                                <div className={cn(menuOpen && "translate-x-10", "bg-foreground h-[2px] w-8 transform transition-all duration-300 origin-left")}></div>
                                <div className={cn(menuOpen && "translate-x-10", "bg-foreground h-[2px] w-8 rounded transform transition-all duration-300 delay-75")}></div>
                                <div className={cn(menuOpen && "translate-x-10", "bg-foreground h-[2px] w-8 transform transition-all duration-300 origin-left delay-150")}></div>

                                <div className={cn("absolute items-center justify-between transform transition-all duration-500 top-1/2 -translate-x-10 flex w-0", menuOpen && "translate-x-0 w-12")}>
                                    <div className={cn("absolute bg-foreground h-[2px] w-6 transform transition-all duration-500 rotate-0 delay-300", menuOpen && "rotate-45")}></div>
                                    <div className={cn("absolute bg-foreground h-[2px] w-6 transform transition-all duration-500 -rotate-0 delay-300", menuOpen && "-rotate-45")}></div>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
                <ul className={cn("md:hidden transition-all duration-1000 ease-in-out h-screen w-full fixed justify-end pb-40 pl-10 text-3xl font-black flex flex-col gap-10 top-0 left-0 bg-background/80 z-[99] backdrop-blur-xl", menuOpen ? "translate-y-0" : "-translate-y-full")}>
                    <li className={linkCN}><Link href='/'>Découvrir</Link></li>
                    <li className={linkCN}><Link href='/prix'>Prix</Link></li>
                    <li className={linkCN}><Link href='/contact'>Contact</Link></li>
                    <li>
                        {
                            user ?
                                <div className="h-10 cursor-pointer w-10 rounded-full bg-muted flex items-center justify-center">
                                    <User2 size={16} />
                                </div>
                                :
                                <Button size='lg' asChild>
                                    <Link className="flex" href='/login'>Rejoindre <ArrowRight className="h-4 w-4 ml-1" /></Link>
                                </Button>
                        }
                    </li>
                </ul>
            </nav>
        </>
    )
}