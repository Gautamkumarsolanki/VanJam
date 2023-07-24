import React, { useState } from 'react'
import BookingCard from './BookingCard'
import Loading from '../Loading';
import { useEffect } from 'react';
import { deleteField, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

export default function Wishlist() {

	const [loading, setLoading] = useState(true);
	const [wishlistData, setWishlistData] = useState({});

	const getData = async () => {
		const res = await getDoc(doc(db, "wishlist", auth.currentUser.uid));
		if (res.exists()) {
			setWishlistData(res.data());
		}
		setLoading(false);
	}
	const deleteHandler = async (id) => {
		let newData = { ...wishlistData };
		delete newData[id];
		setWishlistData(newData);
		await updateDoc(doc(db, "wishlist", auth.currentUser.uid), {
			[id]: deleteField()
		})
	}

	useEffect(() => {
		getData();
	}, [])

	if (loading) {
		return <Loading />;
	}
	return (
		<div className='my-24 px-24 space-y-16'>
			<p className='text-center text-2xl font-semibold'>My Wishlist</p>
			{
				Object.keys(wishlistData).map((ele) => {
					return <BookingCard data={wishlistData[ele]} id={ele} key={ele} setBookingData={null} bookingData={null} deleteHandler={deleteHandler} booking={false} />
				})
			}
		</div>
	)
}
