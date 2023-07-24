import React, { useState } from 'react'
import { app } from '../../firebaseconfig';
import { getAuth } from 'firebase/auth';
import { addDoc, collection,  getFirestore} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app);
const db = getFirestore();

export default function AddVanForm() {
  const navigate=useNavigate();
  const [error, setError] = useState(null);
  const [data, setData] = useState({ vanName: '', price: null, vanCompany: '', type: '', mileage: null, yearOfManufacture: null, descripition: '' });
  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "BS0nrs2L1yX2JlcUeDgRVKg1xhI2"), { ...data, uid: auth.currentUser.uid ,income:0,rating:0});
      navigate('/host/vans');
      window.alert("Van Added Successfully");
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <div className='my-20 flex justify-center'>
      <div className='flex flex-col space-y-20'>
        {error && <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{error}</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg onClick={() => setError(null)} class="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
          </span>
        </div>}
        <p className='text-2xl font-bold text-center text-orange-500'>Add New Van</p>
        <form onSubmit={onSubmitHandler} className='grid sm:grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-36'>
          <input required className='bg-slate-100 h-12 tracking-wider rounded-lg p-2 sm:w-80 md:w-72 lg:w-[27rem]' onChange={onChangeHandler} value={data.vanName} type='text' name='vanName' placeholder='Van Name' />
          <input required className='bg-slate-100 h-12 tracking-wider rounded-lg p-2 sm:w-80 md:w-72 lg:w-[27rem]' onChange={onChangeHandler} value={data.price} type='number' name='price' placeholder='Price / Day' />
          <input required className='bg-slate-100 h-12 tracking-wider rounded-lg p-2 sm:w-80 md:w-72 lg:w-[27rem]' onChange={onChangeHandler} value={data.vanCompany} type='text' name='vanCompany' placeholder='Van Company' />
          <input required className='bg-slate-100 h-12 tracking-wider rounded-lg p-2 sm:w-80 md:w-72 lg:w-[27rem]' onChange={onChangeHandler} value={data.type} type='text' name='type' placeholder='Type' />
          <input required className='bg-slate-100 h-12 tracking-wider rounded-lg p-2 sm:w-80 md:w-72 lg:w-[27rem]' onChange={onChangeHandler} value={data.mileage} type='number' name='mileage' placeholder='Mileage' />
          <input required className='bg-slate-100 h-12 tracking-wider rounded-lg p-2 sm:w-80 md:w-72 lg:w-[27rem]' onChange={onChangeHandler} value={data.yearOfManufacture} type='number' name='yearOfManufacture' placeholder='Year Of Manufacture' />
          <textarea rows='7' className='bg-slate-100 rounded-lg md:col-span-2 p-2' name='descritpion' onChange={onChangeHandler} value={data.descripiton} placeholder='Description'></textarea>
          <button className='bg-orange-500 rounded-lg p-1.5 text-white font-semibold hover:bg-orange-600 w-32 text-xl' type='submit'>Add</button>
        </form>
      </div>

    </div>
  )
}
