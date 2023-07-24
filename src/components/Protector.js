import React from 'react'
import { Navigate, Outlet, useOutletContext } from 'react-router-dom'
export default function Protector() {
    const { user } = useOutletContext();
    if (!user) {
        return <Navigate to='/login' />
    }
    return (
        <>
            <Outlet context={user}/>
        </>
    )
}
