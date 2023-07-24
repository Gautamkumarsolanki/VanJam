import React from 'react'
import { useOutletContext, useParams } from 'react-router-dom';
import './togglestyle.css';

export default function Availability() {
    const { id } = useParams();
    const { data, setVanDetail } = useOutletContext();
    return (

        <div className="flex flex-col md:flex-row flex-wrap justify-around">
            <label for="foobar1" className="flex flex-col flex-wrap items-center cursor-pointer mb-4 md:mb-0">
                <span className="font-semibold my-4 block">Toggle to set Availability</span>
                <div className="relative">
                    <input id="foobar1" type="checkbox" className="hidden" />
                    <div className="toggle__line w-12 h-6 bg-gray-200 rounded-full shadow-inner"></div>
                    <div className="toggle__dot absolute w-5 h-5 bg-white rounded-full shadow inset-y-0 left-0"></div>
                </div>
            </label>
        </div>
    )
}
