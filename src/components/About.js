import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <>
            <img alt='' className='h-100 w-full' src={require('../images/tommy-lisbin-tQeTKUnI4Ow-unsplash.jpg')} />
            <div className='m-16 space-y-8'>
                <p className='text-6xl font-bold'>Don't Squueze in a Sedan When You Could Relax In A Van.</p>
                <p className='font-medium'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <p>Our team is full of vanjam enthusiasts who know the firsthand the magic of touring the world on 4-wheels.</p>
                    <div className='flex bg-orange-300 h-32 rounded-md'>
                        <p className='p-12 w-2/3 text-xl font-bold tracking-wider'>Your Destination is Waiting.&nbsp; Your Van is Ready.</p>
                        <Link className='text-slate-100 w-1/3 font-bold mt-10 rounded-lg w-40 h-10 bg-gray-900 p-2 pl-3' to={'/vans'}>Explore Our Vans</Link>
                    </div>
            </div>
        </>
    )
}