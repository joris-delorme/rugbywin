import Image from 'next/image'
import { ReactNode } from 'react'

const Layout = ({children}: {children: ReactNode}) => {
  return (
    <section className='flex h-[100vh] items-center'>
        <div className="w-full relative h-[100vh] md:block hidden">
            <Image className='w-full h-full object-cover' width={20000} height={20000} src="https://images.unsplash.com/photo-1632777165290-9176d53a2dac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2696&q=80" alt="Abstract 3D dark shape" />
        </div>
        <div className="w-full p-4">
            {children}
        </div>
    </section>
  )
}

export default Layout