import React, { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import Loading from '../Loading';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '../../firebaseconfig';

const db = getFirestore(app);

export default function HostVanDetail() {
    const { id } = useParams()
    const [loading, setLoading] = useState(true);
    const [vanDetail, setVanDetail] = useState(null)
    const getData = async () => {
        const dbRef = doc(db, "BS0nrs2L1yX2JlcUeDgRVKg1xhI2", id);
        const snapshot = await getDoc(dbRef);
        setVanDetail({...snapshot.data(),vanId:snapshot.id});
        setLoading(false);
    }
    useEffect(() => {
        const func = async () => {
            await getData();
        }
        func();
        // eslint-disable-next-line
    }, [])
    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <>
            <div className='my-16'>
                <Link to={`/host/vans`}><span className='hover:underline'><i className="fa fa-arrow-left" aria-hidden="true"></i>Back to all Vans</span></Link>
                {
                    <>
                        <div className='mt-16 space-y-12 px-24'>
                            <p className='text-3xl font-bold'>{vanDetail.name}</p>
                            <div className='w-20 justify-self-end h-8 bg-slate-900 rounded text-xl pl-2 text-slate-100'>{vanDetail.type}</div>
                            <img alt='' src={require('../../images/13.jpg')} />
                        </div>
                        <div className='font-semibold text-lg flex mt-16 space-x-12 xs:px-10 md:px-24'>
                            <NavLink end={true} style={({ isActive }) => { return { textDecoration: isActive ? 'underline' : '', color: isActive ? 'chocolate' : 'black' } }} to={`.`}><p className='hover:underline'>Details</p></NavLink>
                            <NavLink style={({ isActive }) => { return { textDecoration: isActive ? 'underline' : '', color: isActive ? 'chocolate' : 'black' } }} to={`pricing`}><p className='hover:underline'>Pricing</p></NavLink>
                            <NavLink style={({ isActive }) => { return { textDecoration: isActive ? 'underline' : '', color: isActive ? 'chocolate' : 'black' } }} to={`photos`}><p className='hover:underline'>Photos</p></NavLink>
                            <NavLink style={({ isActive }) => { return { textDecoration: isActive ? 'underline' : '', color: isActive ? 'chocolate' : 'black' } }} to={`availability`}><p className='hover:underline'>Availability</p></NavLink>
                        </div>
                        <div className='mt-16 '>
                            <Outlet context={{ data: vanDetail ,setVanDetail}} />
                        </div>
                    </>

                }
            </div>
        </>
    )
}
