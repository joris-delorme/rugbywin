import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Button>
        <Link href='/login'>Connecter vous</Link>
      </Button>
    </main>
  )
}
