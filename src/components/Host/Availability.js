import React, { useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom';
import './togglestyle.css';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';

const db=getFirestore();
export default function Availability() {
    const { data } = useOutletContext();
    const { id } = useParams();
    const [current, setCurrent] = useState({ startDate: new Date(), endDate: new Date(), key: "selection", color: 'black' });
    const [available, setAvailable] = useState(data.available === "true"? true : false)
    const onChangeHandler = async (e) => {
        if (e.target.checked) {
            setAvailable(true);
            await setDoc(doc(db,"BS0nrs2L1yX2JlcUeDgRVKg1xhI2",id),{
                available:"true"
            },{merge:true});
        }
        else {
            setAvailable(false)
            await setDoc(doc(db,"BS0nrs2L1yX2JlcUeDgRVKg1xhI2",id),{
                available:new Date().getFullYear()+"-"+(new Date().getMonth()+1<10?"0"+(new Date().getMonth()+1):new Date().getMonth()+1)+"-"+new Date().getDate()
            },{merge:true});
        }
    }
    useEffect(()=>{
        if(data.available!=="true"){
            setCurrent({startDate: new Date(), endDate: new Date(data.available), key: "selection", color: 'black'})
        }
    },[data.available])
    return (

        <div className="flex flex-col md:flex-row flex-wrap justify-around">
            <label htmlFor="foobar1" className="flex flex-col flex-wrap items-center cursor-pointer mb-4 md:mb-0">
                <span className="font-semibold my-4 block">Toggle to set Availability</span>
                <div className="relative">
                    <input onChange={onChangeHandler} checked={available} id="foobar1" type="checkbox" className="hidden" />
                    <div className="toggle__line w-[2.9rem] h-6 bg-gray-200 rounded-full shadow-inner"></div>
                    <div className="toggle__dot absolute left-[1px] top-[2px] w-5 h-5 bg-white rounded-full shadow inset-y-0"></div>
                </div>
                <p className='font-semibold text-xl my-4'>{available ? "Available" : `Not Available till ${current.endDate}`}</p>
                {!available &&
                    <DateRangePicker minDate={new Date()} onChange={async(item)=>{
                        setCurrent(item.selection)
                        await setDoc(doc(db,"BS0nrs2L1yX2JlcUeDgRVKg1xhI2",id),{
                            available:current.endDate.getFullYear()+"-"+(current.endDate.getMonth()+1<10?"0"+(current.endDate.getMonth()+1):current.endDate.getMonth()+1)+"-"+current.endDate.getDate()
                        },{merge:true})
                    }} ranges={[current]} />
                }
                
                </label>
        </div>
    )
}
