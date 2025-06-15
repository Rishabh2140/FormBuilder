"use client";
import { LibraryBig, LineChart, MessageSquare } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

function SideNav() {
  const menuList = [
    {
      id: 1,
      name: 'My Forms',
      icon: LibraryBig,
      path: '/dashboard'
    },
    {
      id: 3,
      name: 'Analytics',
      icon: LineChart,
      path: '/dashboard/analytics'
    }
  ]

  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path])

  return (
    <aside className='h-screen bg-card border-r border-border flex flex-col'>
      {/* Navigation Menu */}
      <nav className='flex-1 p-4 overflow-y-auto pt-8'>
        {menuList.map((menu) => (
          <Link href={menu.path} key={menu.id}>
            <div className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg
              transition-all duration-200 cursor-pointer group
              ${path === menu.path 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
              }
            `}>
              <menu.icon className={`w-5 h-5 ${path === menu.path ? '' : 'group-hover:scale-110 transition-transform'}`} />
              <span className='font-medium'>{menu.name}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default SideNav



