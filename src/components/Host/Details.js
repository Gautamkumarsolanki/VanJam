// import { getAuth } from 'firebase/auth';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
// import { app } from '../../firebaseconfig';

// const auth=getAuth(app); 
const db=getFirestore();

export default function Details() {

	const { data ,setVanDetail} = useOutletContext();
	const [disabled, setDisabled] = useState(true);
	const [newData, setData] = useState({ ...data });

	const onChangeHandler = (e) => {
		setData({ ...newData, [e.target.name]: e.target.value });
	}
	const onUpdateHandler = async () => {
		if (!disabled) {
			setDisabled(true);
			if (JSON.stringify(newData) !== JSON.stringify(data)) {
				await updateDoc(doc(db,"BS0nrs2L1yX2JlcUeDgRVKg1xhI2",data.vanId),newData);
				setVanDetail(newData);
			}
		} else {
			setDisabled(false);
		}

	}

	return (
		<>
			<div className='xs:px-8 md:px-24 space-y-6 text-md font-medium'>
				<div className='grid xs:grid-cols-1 md:grid-cols-2 md:gap-x-4 lg:gap-x-24 gap-y-12'>
					<div className='flex flex-col space-y-1'>
						<label htmlFor='vanName'>Van Name</label>
						<input onChange={onChangeHandler} name='vanName' className='bg-slate-50 border-2 border-black focus:border-none disabled:border-gray-500 rounded-lg h-10 p-2 disabled:text-gray-500' disabled={disabled} type='text' value={newData.vanName} />
					</div>
					<div className='flex flex-col space-y-1'>
						<label htmlFor='vanCompany'>Van Company</label>
						<input onChange={onChangeHandler} name='vanCompany' className='bg-slate-50 border-2 border-black focus:border-none disabled:border-gray-500 rounded-lg h-10 p-2 disabled:text-gray-500' disabled={disabled} type='text' value={newData.vanCompany} />
					</div>
					<div className='flex flex-col space-y-1'>
						<label htmlFor='type'>Type</label>
						<input onChange={onChangeHandler} name='type' className='bg-slate-50 border-2 border-black focus:border-none disabled:border-gray-500 rounded-lg h-10 p-2 disabled:text-gray-500' disabled={disabled} type='text' value={newData.type} />
					</div>
					<div className='flex flex-col space-y-1'>
						<label htmlFor='mileage'>Mileage</label>
						<input onChange={onChangeHandler} name='mileage' className='bg-slate-50 border-2 border-black focus:border-none disabled:border-gray-500 rounded-lg h-10 p-2 disabled:text-gray-500' disabled={disabled} type='number' value={newData.mileage} />
					</div>
					<div className='flex flex-col space-y-1'>
						<label htmlFor='yearOfManufacture'>Year Of Manufacture</label>
						<input onChange={onChangeHandler} name='yearOfManufacture' className='bg-slate-50 border-2 focus:border-none border-black disabled:border-gray-500 rounded-lg h-10 p-2 disabled:text-gray-500' disabled={disabled} type='text' value={newData.yearOfManufacture} />
					</div>
					<div className='flex flex-col space-y-1'>
						<label htmlFor='safetyRating'>Safety Rating</label>
						<input onChange={onChangeHandler} name='safetyRating' className='bg-slate-50 border-2 focus:border-none border-black disabled:border-gray-500 rounded-lg h-10 p-2 disabled:text-gray-500' disabled={disabled} type='number' value={newData.safetyRating} />
					</div>
					<div className='flex flex-col space-y-1 md:col-span-2'>
						<label htmlFor='description'>Description</label>
						<textarea onChange={onChangeHandler} rows='6' name='description' className='bg-slate-50 border-2 focus:border-none border-black disabled:border-gray-500 rounded-lg p-2 disabled:text-gray-500' disabled={disabled} type='text' value={newData.description} />
					</div>
					<button type='button' onClick={onUpdateHandler} className='p-2 bg-orange-500 text-white rounded lg:w-1/4 md:w-1/2'>{disabled ? 'Edit' : 'Save'}</button>
				</div>
			</div>
		</>
	)
}
