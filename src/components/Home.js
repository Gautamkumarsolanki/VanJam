import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <>
            <div className='relative'>
                <img className='brightness-75 h-100 w-full' alt='' src={require('../images/stefan-widua-vdds_nsH-FE-unsplash.jpg')} />
                <p className='absolute top-20 left-60 text-6xl text-slate-100'>You got travel plans, we got travel vans. </p>
                <p className='absolute top-56 left-[30rem] font-semibold text-xl text-slate-100'>Add Adventure to your life by joining the <span className='text-orange-400'>#VanJam </span>movement.<br/>Rent the perfect van to make your perfect road trip.</p>
                <Link to='vans' className='absolute w-96 top-96 h-8 text-center rounded-lg left-[36rem] font-medium bg-orange-600 text-slate-100' >Find your van</Link>
            </div>
            
        </>
    )
}