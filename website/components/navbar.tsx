import Link from "next/link"
import { Button } from "./ui/button"

export const Navbar = () => {
    return (
        <nav className="py-4 px-20 flex w-full justify-between items-center fixed top-0 left-0 bg-black/30 backdrop-blur-md z-[9999]">
            <Link href='/' className="font-black">RUGBY WIN</Link>
            <Button>
                <Link href='/login'>Connecter vous</Link>
            </Button>
        </nav>
    )
}