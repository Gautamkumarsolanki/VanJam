import React, { useState } from 'react'
import { app } from '../firebaseconfig'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Navigate, useOutletContext } from 'react-router-dom';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore();

export default function Login() {
  const { setUser, user } = useOutletContext();
  const [data, setData] = useState({ email: "", password: "" ,username:"",phone:'',companyName:""});
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }
  const signUpUser = () => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        await setDoc(doc(db, "Users", userCredential.user.uid), {
          ...data
        });
        await setDoc(doc(db,"Response",userCredential.user.uid),{});
        setUser({ ...data, uid: userCredential.user.uid });
      })
      .catch((error) => {
        console.log(error.message);
      })
  }
  if (user) {

    return <Navigate to='/host' />
  }
  return (
    <>
      <div className='flex flex-col px-[12rem] my-28 space-y-12'>
        <h1 className='text-2xl font-bold'>SignUp</h1>
        <input onChange={(e) => onChange(e)} value={data.username} name='username' className='bg-slate-800 h-12 rounded-full p-4 w-96 text-white' type='email' placeholder='username' required />
        <input onChange={(e) => onChange(e)} value={data.phone} name='phone' className='bg-slate-800 h-12 rounded-full p-4 w-96 text-white' type='email' placeholder='Phone' required />
        <input onChange={(e) => onChange(e)} value={data.email} name='email' className='bg-slate-800 h-12 rounded-full p-4 w-96 text-white' type='email' placeholder='email' required />
        <input onChange={(e) => onChange(e)} value={data.password} name='password' className='bg-slate-800 h-12 rounded-full p-4 w-96 text-white' type='password' placeholder='password' required />
        <input className='bg-orange-600 w-24 h-10 rounded-full text-xl font-semibold text-slate-100' type='button' onClick={signUpUser} value="Log in" required />
      </div>
    </>
  )
}