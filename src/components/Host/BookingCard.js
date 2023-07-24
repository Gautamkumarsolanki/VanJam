import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const db = getFirestore();
const auth = getAuth();
export default function BookingCard({ data, id, setBookingData, bookingData, deleteHandler, booking }) {
    const [showOnBtn, setShow] = useState("Add to Cart");
    const [current, setCurrent] = useState({ startDate: new Date(data.time_slot!==undefined?data.time_slot.start:null), endDate: new Date(data.time_slot!==undefined?data.time_slot.end:null), key: "selection", color: 'black' });
    const [dates, setDates] = useState([]);
    const addToCartHandler = async (id) => {
        setShow("Loading...")
        await setDoc(doc(db, "bookings", auth.currentUser.uid), {
            [id]: {
                time_slot: { start: new Date().getFullYear()+"-"+(new Date().getMonth()+1<10?"0"+(new Date().getMonth()+1):new Date().getMonth()+1)+"-01", end:new Date().getFullYear()+"-"+(new Date().getMonth()+1<10?"0"+(new Date().getMonth()+1):new Date().getMonth()+1)+"-01"  },
                vanName: data.vanName,
                price: data.price,
                type: data.type
            }
        }, { merge: true });
        await deleteHandler(id);
        setShow("Go to Cart")
    }
    useEffect(() => {
        const getVanData = async () => {
            const dbRef = doc(db, "BS0nrs2L1yX2JlcUeDgRVKg1xhI2", id);
            const dataSnap = await getDoc(dbRef);
            if (dataSnap.exists()) {
                const currentDates = [];
                const bookings = dataSnap.data().bookings;
                bookings.forEach((ele, index) => {
                    if (new Date(ele.end).getTime() >= new Date(new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()).getTime()) {
                        currentDates.push({ startDate: new Date(ele.start), endDate: new Date(ele.end), key: index + 2, color: 'rgb(54,69,79,0.4)' ,disabled:true})
                    }
                })
                setDates(currentDates);
            } else {
                console.log("not exists");
            }
        }
        if (booking && data.status === undefined) {
            getVanData();
        }
        //eslint-disable-next-line
    }, [])
    return (
        <div className='flex border-2 p-6 shadow-lg rounded-lg border-gray-500 my-4'>
            <img className='h-80 w-96 mr-10 rounded-lg' alt='' src={require('../../images/14.jpg')} />
            <div className='flex flex-col justify-evenly space-y-8 w-[38rem]'>
                <div className='flex'>
                    <p className='w-3/5 text-xl font-semibold text-center'>{data.vanName}</p>
                    <div className='w-1/5 bg-slate-900 rounded text-center text-xl font-semibold p-1.5 text-slate-100'>{data.type}</div>
                    {booking && data.status !== undefined && <div className='bg-green-700 text-xl font-semibold text-center w-1/5 ml-6 rounded text-xl p-1.5 text-slate-100'>{data.payment}</div>}

                </div>
                {booking &&
                    <div className='flex justify-center space-x-16'>
                        <DateRangePicker minDate={new Date()} onChange={async (item) => {
                            if (Object.keys(item)[0] === "selection" && data.status === undefined) {
                                for (const obj of dates) {
                                    if ((new Date(obj.startDate).getTime() >= new Date(item.selection.startDate).getTime() && new Date(obj.startDate).getTime() <= new Date(item.selection.endDate).getTime()) || (new Date(obj.endDate).getTime() >= new Date(item.selection.startDate).getTime() && new Date(obj.endDate).getTime() <= new Date(item.selection.endDate).getTime())) {
                                        return;
                                    }
                                }
                                const newDate={
                                    time_slot: {
                                        start: new Date(item.selection.startDate).getFullYear() + "-" + (new Date(item.selection.startDate).getMonth() + 1 < 10 ? "0" + (new Date(item.selection.startDate).getMonth() + 1) : new Date(item.selection.startDate).getMonth() + 1) + "-" + new Date(item.selection.startDate).getDate(),
                                        end: new Date(item.selection.endDate).getFullYear() + "-" + (new Date(item.selection.endDate).getMonth() + 1 < 10 ? "0" + (new Date(item.selection.endDate).getMonth() + 1) : new Date(item.selection.endDate).getMonth() + 1) + "-" + new Date(item.selection.endDate).getDate()
                                    }
                                }
                                setBookingData({...bookingData,[id]:{...bookingData[id],time_slot:newDate.time_slot}});
                                setCurrent(item.selection);
                                await setDoc(doc(db, "bookings", auth.currentUser.uid), {
                                    [id]: newDate
                                }, { merge: true });
                            }
                        }}
                            ranges={[...dates, current]} />
                    </div>

                }

                <div className='flex flex-col bg-gray-100 p-1.5 rounded-lg space-y-1'>
                    <div className='flex'>
                        <p className='w-1/2 text-lg font-medium'>Price/Day:</p>
                        <p className='w-1/2 text-right text-lg font-medium'>INR {data.price}.00</p>
                    </div>
                    {booking &&
                        <div className='flex'>
                            <p className='w-1/2 text-lg font-medium'>Cost For {(new Date(data.time_slot.end).getTime() - new Date(data.time_slot.start)) / (1000 * 3600 * 24) + 1} days:</p>
                            <p className='w-1/2 text-right text-lg font-medium'>INR {((new Date(data.time_slot.end).getTime() - new Date(data.time_slot.start)) / (1000 * 3600 * 24) + 1) * data.price}.00</p>
                        </div>
                    }

                </div>
                <div className='flex justify-center'>
                    {!booking &&
                        <button type='button' className='mr-6 bg-black text-white p-2 rounded-lg text-xl font-semibold tracking-wide' onClick={() => addToCartHandler(id)}>{showOnBtn}</button>
                    }
                    {booking && data.status === undefined &&
                        <div className='space-x-4'>
                            <button type='button' className='bg-gray-200 p-2 rounded-lg text-xl font-semibold tracking-wide' onClick={() => deleteHandler(id)}>Remove</button>
                            <button type='button' className='bg-gray-200 p-2 rounded-lg text-xl font-semibold tracking-wide' onClick={''}>Move to Wishlist</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
