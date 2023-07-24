import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Loading from './Loading'
import { app } from '../firebaseconfig'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore'

const auth = getAuth(app);
const db=getFirestore();

export default function Header() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const getUser = async () => {
        onAuthStateChanged(auth,async (user) => {
            if (user) {
                const userDoc=await getDoc(doc(db,"Users",user.uid));
                setUser({...userDoc.data(),uid:userDoc.id});
            }
            setLoading(false);
        })
    }

    useEffect(() => {
        async function func() {
            await getUser();
        }
        func();
    }, [])
   
    if (loading) {
        return <Loading />;
    }
    return (
        <>
            <div className='relative'>
                <Navbar user={user} setUser={setUser} />
                <Outlet context={{ user, setUser }} />
                <footer style={{
                    position: 'static',
                    left: '0',
                    bottom: '0',
                    width: '100%',
                    backgroundColor: 'gray',
                    color: 'white',
                    textAlign: 'center'
                }}>

                    &#169; 2023 #VanJam
                </footer >
            </div>
        </>
    )
}