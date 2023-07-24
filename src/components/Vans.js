import React, { useEffect, useState } from 'react'
import Van from './Van'
import { Link, useSearchParams } from 'react-router-dom';
import Loading from './Loading';
import { app } from '../firebaseconfig';
import {collection, getDocs, getFirestore} from 'firebase/firestore';


const db=getFirestore(app);

export default function Vans() {
    const [vansData, setVansData] = useState(null);
    const [loading, setLoading] = useState(true);
    const getData = async () => {
        getDocs(collection(db,"BS0nrs2L1yX2JlcUeDgRVKg1xhI2")).then((response)=>{
            setVansData(response.docs);
            setLoading(false);
        })
        .catch((error)=>{
            console.log(error.message);
        });
    }
    useEffect(() => {
        const func = async () => {
            await getData();
        }
        func();
    }, [])
    const [searchParams, setSearchParams] = useSearchParams();
    const filterType = searchParams.get("type");
    const showData = (vansData) ? (filterType) ? vansData.filter((ele) => { return ele.data().type.toLowerCase() === filterType }) : vansData : null;
    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <>
            <div className='mx-auto px-14 my-10 space-y-8'>
                <h1 className='font-bold text-4xl'>Explore our van options</h1>
                <div className='flex space-x-12'>
                    <button style={{ backgroundColor: filterType === 'simple' ? "orange" : 'rgb(254 215 170)' }} onClick={() => setSearchParams({ type: "simple" })} className='h-8 w-24 pl-1 text-lg text-medium rounded-md bg-orange-200 '>Simple</button>
                    <button style={{ backgroundColor: filterType === 'luxury' ? "orange" : 'rgb(254 215 170)' }} onClick={() => setSearchParams({ type: "luxury" })} className='h-8 w-24 pl-1 text-lg text-medium rounded-md bg-orange-200 '>Luxury</button>
                    <button style={{ backgroundColor: filterType === 'rugged' ? "orange" : 'rgb(254 215 170)' }} onClick={() => setSearchParams({ type: "rugged" })} className='h-8 w-24 pl-1 text-lg text-medium rounded-md bg-orange-200 '>Rugged</button>
                    {filterType &&
                        <Link to={'.'} className='h-8 w-30 text-md text-medium'>Clear filters</Link>}
                </div>
                <hr className='border-1' />
                <div className='grid justify-items-center md:grid-cols-2 lg:grid-cols-3 gap-14'>
                    {showData && showData.map((ele) => <Van key={ele.id} searchParams={searchParams} vandata={ele} />)}
                </div>
            </div>
        </>
    )
}
