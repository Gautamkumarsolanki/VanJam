import { getAuth } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseconfig'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import Loading from '../Loading';

const auth = getAuth(app);
const db = getFirestore();
export default function Dashboard() {
    const [data, setData] = useState({ username: '', phone: '', companyname: '' })
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const onChangeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async () => {
        try {
            await setDoc(doc(db, "Users", `${auth.currentUser.uid}`), {
                ...data, uid: auth.currentUser.uid
            })
            window.alert("Data Saved Successfully");
        } catch (error) {
            setError(error.message);
        }
    }
    useEffect(() => {
        async function func() {
            try {
                const docSnap = await getDoc(doc(db, "Users", `${auth.currentUser.uid}`))
                if (docSnap.exists()) {
                    setData({ ...docSnap.data(), uid: null });
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }
        }
        func();
    }, [])
    if (loading) {
        return <Loading />;
    }
    else {
        return (
            <div className='mt-24 mb-24 mx-4 flex justify-center'>
                <div className='flex flex-col space-y-10'>
                    {error && <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <span class="block sm:inline">{error}</span>
                        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <svg onClick={() => setError(null)} class="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                        </span>
                    </div>}
                    <img className='md:h-36 md:w-36 lg:w-48 lg:h-48 sm:w-20 sm:h-20 self-center' src='/profile.png' alt='profile pic' />
                    <div className='grid sm:grid-cols-1 md:grid-cols-2 sm:gap-8 md:gap-16 lg:gap-x-48 lg:gap-y-16'>
                        <input className='bg-slate-200 sm:w-80 md:w-56 lg:w-96 h-10 p-2 tracking-wider' onChange={onChangeHandler} placeholder='Username' type='text' name='username' value={data.username} />
                        <input className='bg-slate-200 sm:w-80 md:w-56 lg:w-96 h-10 p-2 tracking-wider' disabled type='text' name='email' value={auth.currentUser.email} />
                        <input className='bg-slate-200 sm:w-80 md:w-56 lg:w-96 h-10 p-2 tracking-wider' placeholder='Phone' onChange={onChangeHandler} type='text' name='phone' value={data.phone} />
                        <input className='bg-slate-200 sm:w-80 md:w-56 lg:w-96 h-10 p-2 tracking-wider' placeholder='company name' onChange={onChangeHandler} type='text' name='companyname' value={data.companyname} />
                        <input onClick={onSubmitHandler} className='bg-orange-600 rounded-lg text-slate-100 w-32 h-8' type='button' value={'Save'} />
                    </div>
                </div>
            </div>
        )
    }
}