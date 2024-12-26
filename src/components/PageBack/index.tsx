'use client'
import React from 'react'

import{useRouter} from 'next/navigation'


export default function PageBack(){
 const router = useRouter();
 const pageBack=()=>{
   router.back()
 }

 return (
   <span className ="text-xs hover:underline hover:cursor-pointer " onClick={pageBack}> &lt; Back </span>
 )

}
