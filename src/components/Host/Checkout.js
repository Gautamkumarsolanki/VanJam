import React, { useEffect, useState } from 'react'
import { deleteDoc, doc, getDoc, getFirestore, increment, setDoc, updateDoc,arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Loading from '../Loading';
import Lottie from 'lottie-react';
import animationData from '../../animation.json';
import { Link } from 'react-router-dom';

const db = getFirestore();
const auth = getAuth();
export default function Checkout() {
    let total = 999 + 499;
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState({});
    const [data, setData] = useState({ name: "", number1: "", number2: "", email: "", payment: "", idProof: "" });
    const onChangeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (data.payment !== "") {
            const res = await getDoc(doc(db, "previousBookings", auth.currentUser.uid))
            let newData = [];
            Object.keys(bookings).map(async (ele) => {
                newData.push({ time_slot: bookings[ele].time_slot, ...data, vanDetail: ele + "$" + bookings[ele].vanName + "$" + bookings[ele].price + "$" + bookings[ele].type })
                await updateDoc(doc(db, "BS0nrs2L1yX2JlcUeDgRVKg1xhI2", ele), {
                    income: increment(((new Date(bookings[ele].time_slot.end).getTime() - new Date(bookings[ele].time_slot.start)) / (1000 * 3600 * 24) + 1) * bookings[ele].price)                    
                    ,bookings:arrayUnion(bookings[ele].time_slot)
                })
            })
            if (res.exists()) {
                console.log(newData);
                await updateDoc(doc(db, "previousBookings", auth.currentUser.uid), {
                    confirmed: arrayUnion(...newData)
                })

            } else {
                await setDoc(doc(db, "previousBookings", auth.currentUser.uid), {
                    confirmed: newData
                })
            }
            await deleteDoc(doc(db, "bookings", auth.currentUser.uid))
            setShow(true)
        }
    }
    const getBookingData = async () => {
        const bookingData = await getDoc(doc(db, "bookings", auth.currentUser.uid));
        if (bookingData.exists()) {
            setBookings(bookingData.data());
            setLoading(false);
        }
    }
    total += Object.keys(bookings).reduce((total, ele) => {
        return total + ((new Date(bookings[ele].time_slot.end).getTime() - new Date(bookings[ele].time_slot.start)) / (1000 * 3600 * 24) + 1) * bookings[ele].price;
    }, 0)
    useEffect(() => {
        getBookingData()
    }, [])
    if (loading) {
        return <Loading />;
    }
    return (
        <form onSubmit={onSubmitHandler}>

            <div className='my-24 px-40 grid grid-cols-2'>
                <p className='text-center text-3xl font-semibold col-span-2'>Checkout</p>
                <div className="mt-16">
                    <div className='flex flex-col space-y-6' >
                        <div className='flex flex-col '>
                            <label htmlFor='name' className='text-md font-semibold'>Name of Van Renter</label>
                            <input onChange={onChangeHandler} className='h-12 bg-gray-100 border-2 border-black focus:border-none rounded-lg w-[30rem] p-2 text-lg' required name='name' id='name' type='text' value={data.name} />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='number1' className='text-md font-semibold'>Contact Number 1</label>
                            <input onChange={onChangeHandler} className='h-12 bg-gray-100 border-2 border-black focus:border-none rounded-lg w-[30rem] p-2 text-lg' required name='number1' id='number1' type='text' value={data.number1} />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='number2' className='text-md font-semibold'>Contact Number 2</label>
                            <input onChange={onChangeHandler} className='h-12 bg-gray-100 border-2 border-black focus:border-none rounded-lg w-[30rem] p-2 text-lg' required type='text' name='number2' id='number2' value={data.number2} />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='email' className='text-md font-semibold'>Email</label>
                            <input onChange={onChangeHandler} className='h-12 bg-gray-100 border-2 border-black focus:border-none rounded-lg w-[30rem] p-2 text-lg' required type='email' name='email' id='email' value={data.email} />
                        </div>
                        <div className="relative inline-flex">
                            <select onChange={onChangeHandler} name='idProof' required className="border-2 border-gray-800 rounded-full font-semibold text-gray-800 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none">
                                <option defaultChecked>Select ID Proof</option>
                                <option>Aadhar Card</option>
                                <option>Pan Card</option>
                                <option>Voter ID</option>
                                <option>Passport</option>
                            </select>
                        </div>
                        <input type='file' name='idproof' />
                        <p className='text-xl'>Select Payment Method</p>
                        <div>
                            <input onChange={onChangeHandler} type='radio' id='upi' name='payment' value={'UPI'} />
                            <label htmlFor='upi'>UPI</label>
                        </div>
                        <div>
                            <input onChange={onChangeHandler} type='radio' id='netbanking' name='payment' value={'Net Banking'} />
                            <label htmlFor='netbanking'>Net Banking</label>
                        </div>
                        <div>
                            <input onChange={onChangeHandler} type='radio' id='debitcard' name='payment' value={'Debit Card'} />
                            <label htmlFor='debitcard'>Debit Card</label>
                        </div>
                        <div>
                            <input onChange={onChangeHandler} type='radio' id='creditcard' name='payment' value={'Credit Card'} />
                            <label htmlFor='creditcard'>Credit Card</label>
                        </div>
                    </div>

                </div>
                <div className='mt-20'>
                    <p className='text-2xl mt-2 font-semibold'>Payment Details</p>
                    <div className='bg-gray-200 p-3 my-6 rounded-lg text-lg font-medium'>
                        {
                            Object.keys(bookings).map((ele) => {
                                return (
                                    <div className='space-y-4 mb-4'>
                                        <div className='flex'>
                                            <p className='w-1/2'>{bookings[ele].vanName}:</p>
                                            <p className='w-1/2 text-end'>{bookings[ele].price}</p>
                                        </div>
                                        <div className='flex'>
                                            <p className='w-1/2'>Price of {((new Date(bookings[ele].time_slot.end).getTime() - new Date(bookings[ele].time_slot.start)) / (1000 * 3600 * 24) + 1)} Days:</p>
                                            <p className='w-1/2 text-end'>{((new Date(bookings[ele].time_slot.end).getTime() - new Date(bookings[ele].time_slot.start)) / (1000 * 3600 * 24) + 1) * bookings[ele].price}.00</p>
                                        </div>

                                    </div>)

                            })
                        }
                        {
                            Object.keys(bookings).length > 0 && <div className='space-y-4'>
                                <div className='flex'>
                                    <p className='w-1/2'>Service Charge:</p>
                                    <p className='w-1/2 text-end'>499</p>
                                </div>
                                <div className='flex'>
                                    <p className='w-1/2'>Security Deposit:</p>
                                    <p className='w-1/2 text-end'>999</p>
                                </div>
                                <div className='flex font-semibold text-xl'>
                                    <p className='w-1/2 '>Total:</p>
                                    <p className='w-1/2 text-end '>{total}.00</p>
                                </div>
                            </div>
                        }
                    </div>
                    <div className='flex space-x-4 justify-end'>
                        <button type='button' className='bg-gray-300 rounded-lg font-semibold p-2 w-20 text-lg tracking-wide'>Cancel</button>
                        <button type='submit' className='bg-green-600 rounded-lg text-white font-semibold p-2 w-40 text-lg tracking-wide'>Pay:&nbsp;Rs.
                            {total}
                        </button>
                    </div>
                </div>
            </div>
            {show && <>
                <div className="fixed z-10 overflow-y-auto top-10 w-full left-0" id="modal">
                    <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-900 opacity-75" />
                        </div>
                        <div className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <p className='text-center text-lg font-semibold'>Van Booked Successfully!!</p>
                                <Lottie animationData={animationData} loop={false} />
                            </div>
                            <div className="px-4 py-3 text-center">
                                <Link to={'/host/bookings'} className="py-2 px-1.5 bg-green-600 text-white rounded-lg hover:bg-blue-700 font-semibold mr-2">Bookings Details</Link>
                                <Link to={'/vans'} className="py-2 px-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"> Continue Shopping</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            }
        </form>
    )
}
