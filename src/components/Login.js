import React, { useState } from 'react'
import { app } from '../firebaseconfig'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Navigate, useOutletContext } from 'react-router-dom';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const auth = getAuth(app);
const db=getFirestore();

export default function Login() {
  const { setUser, user } = useOutletContext();
  const [data, setData] = useState({ email: "", password: "" });
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }
  const logInUser = () => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        const userDoc = await getDoc(doc(db, "Users", userCredential.user.uid));
        setUser({ ...userDoc.data(), uid: userDoc.id });
      })
      .catch((error) => {
        console.log(error.message);
      })
  }
  if (user) {
    return <Navigate to={'/'} />
  }
  return (
    <>
      <div className='flex flex-col px-[12rem] my-28 space-y-12'>
        <h1 className='text-2xl font-bold'>Login</h1>
        <input onChange={(e) => onChange(e)} value={data.email} name='email' className='bg-slate-800 h-12 rounded-full p-4 w-96 text-white' type='email' placeholder='email' required />
        <input onChange={(e) => onChange(e)} value={data.password} name='password' className='bg-slate-800 h-12 rounded-full p-4 w-96 text-white' type='password' placeholder='password' required />
        <input className='bg-orange-600 w-24 h-10 rounded-full text-xl font-semibold text-slate-100' type='button' onClick={logInUser} value="Log in" required />
      </div>
    </>
  )
}