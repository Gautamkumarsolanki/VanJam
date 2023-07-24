import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom'
import { deleteField, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import BookingCard from './BookingCard'
import Loading from '../Loading';


const db = getFirestore();

export default function Cart() {
    const state = { serviceCharge: 499, securityDeposit: 232 }
    const user = useOutletContext();
    const [bookingData, setBookingData] = useState({});
    const [loading, setLoading] = useState(true);
    let total=state.securityDeposit+state.serviceCharge;
    const getBookingData = async () => {
        const docData = await getDoc(doc(db, 'bookings', user.uid));
        if (docData.exists()) {
            setBookingData(docData.data());
        }
        setLoading(false);
    }
    useEffect(() => {
        getBookingData();
    }, [])
    const deleteHandler = async (id) => {
        let newData = { ...bookingData };
        delete newData[id];
        setBookingData(newData);
        await updateDoc(doc(db, "bookings", user.uid), {
            [id]: deleteField()
        })
    }
    if (loading) {
        return <Loading />;
    }
    return (
        <div className='my-32 px-24 bg-white flex flex-col justify-center'>
            {
                Object.keys(bookingData).length !== 0 ?
                    <>
                        {
                            Object.keys(bookingData).map((ele) => {
                                return <BookingCard deleteHandler={deleteHandler} key={ele} data={bookingData[ele]} id={ele} setBookingData={setBookingData} bookingData={bookingData} booking={true}/>
                            })
                        }
                        <p className='mt-24 text-2xl font-semibold mb-6'>Booking Details</p>
                        <div className='flex flex-col space-y-2 bg-gray-200 text-lg font-medium rounded-lg p-2'>
                            {
                                Object.keys(bookingData).map((ele) => {
                                    total+=Number((new Date(bookingData[ele].time_slot.end).getTime() - new Date(bookingData[ele].time_slot.start)) / (1000 * 3600 * 24) + 1) * bookingData[ele].price;
                                    return <div key={ele} className='flex justify-between'>
                                        <p className='w-1/3'>{bookingData[ele].vanName}</p>
                                        <p className='w-1/3 text-center'> {(new Date(bookingData[ele].time_slot.end).getTime() - new Date(bookingData[ele].time_slot.start)) / (1000 * 3600 * 24) + 1}{' '}days</p>
                                        <p className='w-1/3 text-right'>INR {((new Date(bookingData[ele].time_slot.end).getTime() - new Date(bookingData[ele].time_slot.start)) / (1000 * 3600 * 24) + 1) * bookingData[ele].price}.00</p>
                                    </div>
                                })
                            }
                            <div className='flex justify-between'>
                                <p>Service Charge:</p>
                                <p>INR {state.serviceCharge}.00</p>
                            </div>
                            <div className='flex justify-between'>
                                <p>Security Deposit</p>
                                <p>INR {state.securityDeposit}.00:</p>
                            </div>
                            <div className='flex justify-between'>
                                <p className='font-bold'>Total:</p>
                                <p className='font-bold'>INR {total}.00</p>
                            </div>
                        </div>
                        <div className='text-right mt-6'>
                            <Link to={'/host/checkout'} className='bg-black rounded-lg p-2 text-lg font-semibold text-white tracking-wider'>Proceed To Payment</Link>
                        </div>
                    </>

                    : <p className='text-center text-2xl font-semibold my-36'>Cart is Empty</p>
            }
        </div>
    )
}
