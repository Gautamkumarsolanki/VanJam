import { doc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom';

const db = getFirestore();
export default function Pricing() {
	const { id } = useParams();
	const { data, setVanDetail } = useOutletContext();
	const [price, setPrice] = useState(data.price);
	const [show, setShow] = useState("Edit");
	const handleClick = async () => {
		if (show === "Save") {
			setShow("Saving...")
			if (data.price !== price) {
				await setDoc(doc(db, "BS0nrs2L1yX2JlcUeDgRVKg1xhI2", id), {
					price:Number(price)
				}, { merge: true });
				setVanDetail({ ...data, price })
			}
			setShow("Edit")
		} else {
			setShow("Save")
		}

	}
	return (
		<div className='px-24 flex flex-col space-y-6'>
			<input disabled={show==="Edit" || show==="Saving..."} className='bg-slate-200 h-12 tracking-wider rounded-lg p-2 sm:w-80 md:w-72 lg:w-[27rem]' type='number' value={price} onChange={(e) => setPrice(e.target.value)} name='price' />
			<button className='bg-orange-500 rounded-lg p-1.5 text-white font-semibold hover:bg-orange-600 w-32 text-xl' onClick={handleClick} type='button'>{show}</button>
		</div>
	)
}