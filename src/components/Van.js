import React from 'react';
import { Link } from 'react-router-dom';
export default function Van({ vandata, searchParams }) {
    const { vanName, price, type, available } = vandata.data();
    return (
        <Link to={`/van/${vandata.id}`} state={{ search: searchParams.toString() }}>
            <div style={{ backgroundColor: '#F8F8FF' }} className='h-90 shadow-lg w-80 space-y-4 '>
                <img alt='' className='h-48 w-80 brightness-90 rounded-lg hover:scale-125 tansition duration-300 ease-in-out' src={require('../images/1.jpg')} />
                <h1 className='text-lg font-semibold'>{vanName}</h1>
                {!available ?
                    <div style={{ backgroundColor: 'rgba(255, 0, 0, 0.05)' }} className='border-2 border-red-400 text-red-500 w-fit p-1.5 rounded-lg flex space-x-2'>
                        <div className='h-2 w-2 bg-red-600 rounded-full mt-[0.6rem]'></div>
                        <p className='font-semibold'>Currently Not In Service</p>
                    </div> :
                    <div style={{ backgroundColor: 'rgba(170, 240, 209, 0.2)' }} className='border-2 border-green-500 text-green-600 w-fit p-1.5 rounded-lg flex space-x-2'>
                        <div className='h-2 w-2 bg-green-500 rounded-full mt-[0.6rem]'></div>
                        <p className='font-semibold'>Available</p>
                    </div>

                }

                <div className='grid grid-rows-1 grid-flow-col'>
                    <h1 className='w-1/2 text-lg font-medium'>${price}/day</h1>
                    <div className='w-1/2 justify-self-end h-8 bg-slate-900 rounded text-xl pl-2 text-slate-100'>{type}</div>
                </div>
            </div>
        </Link>
    )
}