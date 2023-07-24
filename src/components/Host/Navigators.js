import React from 'react'
import { NavLink, Outlet, useOutletContext } from 'react-router-dom'

export default function Navigators() {
    const user=useOutletContext();
    return (
        <>
            <div className='px-16 mt-16'>
                <div className='font-semibold text-lg flex justify-evenly space-x-16'>
                    <NavLink end={true} style={({ isActive }) => { return { textDecorationLine: isActive ? 'underline' : 'none' } }} to={'.'}>Profile</NavLink>
                    <NavLink style={({ isActive }) => { return { textDecorationLine: isActive ? 'underline' : 'none' } }} to={'vans'}>My Vans</NavLink>
                    <NavLink style={({ isActive }) => { return { textDecorationLine: isActive ? 'underline' : 'none' } }} to={'income'}>Income</NavLink>
                    <NavLink style={({ isActive }) => { return { textDecorationLine: isActive ? 'underline' : 'none' } }} to={'reviews'}>Reviews</NavLink>
                </div>
                <div>
                    <Outlet context={user}/>
                </div>
            </div>
        </>
    )
}