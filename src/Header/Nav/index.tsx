'use client'

import React from 'react'
import {useCart} from '@/providers/Cart'
import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import {ShoppingCartIcon} from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const { cart } = useCart();

  return (
    <nav className="flex w-full items-center justify-between ">
      <div className="flex gap-3 items-center">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="link" />
        })}
      </div>
      <div className="flex flex-row items center gap-3 mr-4">
        <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>
        <Link className={'relative'} href={'/cart'}>
          <ShoppingCartIcon className="w-5 text-primary" />
          <div className={'w-5 h-5 rounded-full text-xs scale-50 flex absolute -top-2 left-2.5 items-center justify-center bg-white border border-2 border-gray-600'}>
            {cart.length}
          </div>

        </Link>
      </div>

    </nav>
  )
}
