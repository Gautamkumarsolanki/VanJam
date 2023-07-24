import React from 'react'
import Loading from '../Loading';
import { useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import BookingCard from './BookingCard';

const db = getFirestore();

export default function Booking() {
	const user = useOutletContext();
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);
	const getBookingData = async () => {
		const res = await getDoc(doc(db, "previousBookings", user.uid))
		if (res.exists()) {
			setData(res.data().confirmed.reverse());
			setLoading(false);
		} else {
			setLoading(false);
		}
	}
	useEffect(() => {
		getBookingData()
	}, [])
	if (loading) {
		return <Loading />;
	} else {
		return (
			<div className='my-32 px-24 flex flex-col justify-center'>
				<p className='text-center font-semibold text-2xl mb-12'>My bookings</p>
				{data.length > 0 ?
					<div>
						{
							data.map((ele, index) => {
								let vanData = ele.vanDetail.split('$');
								return <BookingCard setBookingData={null} bookingData={null} deleteHandler={null} booking={true} key={vanData[0] + index} id={vanData[0]} data={{ vanName: vanData[1], price: Number(vanData[2]), type: vanData[3], time_slot: ele.time_slot, status: "booked", payment: ele.payment }} />
							})
						}
					</div> : <p>Your Have No Booking</p>
				}
			</div>
		)
	}

}
