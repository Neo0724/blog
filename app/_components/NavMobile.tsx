import React from 'react'

import { NavItemsType } from './Navbar'
import Navitem from './Navitem';
import SignOut from '../(auth)/sign-in/_components/SignOut';

export default function NavMobile({ navItems } : { navItems: NavItemsType[]}) {
  return (
    <div className="h-[8%] overflow-scroll md:hidden flex fixed bottom-0 left-0 right-0 items-center justify-between p-5 shadow-md bg-zinc-500">
      <div className='mr-5 text-white'>Blog</div>
      <div className="flex items-center justify-betweem gap-3">
        {navItems.map((navItem) => {
          return (
            <Navitem
              key={navItem.href}
              name={navItem.name}
              href={navItem.href}
              active={navItem.active}
              icon={navItem.icon}
            />
          );
        })}
        <SignOut />
      </div>
    </div>
  )
}
