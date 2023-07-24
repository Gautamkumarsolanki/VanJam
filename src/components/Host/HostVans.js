import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Loading from '../Loading';
import { app } from '../../firebaseconfig';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore(app);
const auth = getAuth();

export default function HostVans() {
    const [loading, setLoading] = useState(true);
    const [vansList, setVansList] = useState(null)
    const getData = async () => {
        const q = query(collection(db, "BS0nrs2L1yX2JlcUeDgRVKg1xhI2"), where("uid", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        setVansList(querySnapshot.docs);
        setLoading(false);
    }
    useEffect(() => {
        const func = async () => {
            await getData();
        }
        func();
    }, [])
    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <>
            <div className='my-16 px-[11.5rem] space-y-16'>
                <p className='font-bold text-4xl text-orange-400'> Your Listed Vans</p>
                <ul className='px-32 space-y-16'>
                    <Link className='bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded inline-flex items-center' to='/host/addvan'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>Add Van</span>
                    </Link>
                    {vansList.map((ele) => {
                        return <Link key={ele.id} to={`/host/van/${ele.id}`}><li className='my-12 flex hover:scale-125 transition ease-in-out space-x-4 rounded-lg p-2 h-40 w-96 shadow-lg bg-orange-200'>
                            <img className='h-36 w-36 rounded ' alt='' src={require('../../images/11.jpg')} />
                            <p className='py-16'>{ele.data().vanName}</p>
                        </li></Link>
                    })}
                </ul>
            </div>
        </>
    )
}
