import { getAuth, signOut } from 'firebase/auth'
import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { app } from '../firebaseconfig'

const auth = getAuth(app);
export default function Navbar({ user, setUser }) {
    const [show, setShow] = useState(false);
    const logOut = () => {
        signOut(auth)
            .then(() => {
                setUser(null);
            })
            .catch((error) => {
                console.log(error);
            })
    }
    return (
        <>
            <nav>
                <div className='flex h-12 bg-orange-200 p-2 pl-4 pr-4'>
                    <div className='w-1/3'>
                        <Link to={'/'} className='hover:underline hover:underline-offset-2 text-2xl font-bold'>#VanJam</Link>
                    </div>
                    <div className='w-2/3 flex justify-end pr-4 space-x-10'>
                        <NavLink style={({ isActive }) => { return { textDecoration: isActive ? 'underline' : 'none' } }} className='hover:underline font-normal text-lg' to={'/'}>Home</NavLink>
                        <NavLink style={({ isActive }) => { return { textDecoration: isActive ? 'underline' : 'none' } }} className='hover:underline font-normal text-lg' to={'/vans'}>Vans</NavLink>
                        {user ? <>
                            <NavLink style={({ isActive }) => { return { textDecoration: isActive ? 'underline' : 'none' } }} className='hover:underline font-normal text-lg' to={'/host'}>Host</NavLink>
                            
                            <div className="relative inline-block text-left">
                                <div>
                                    <button
                                        onClick={() => setShow(!show)}
                                        style={{ width: '3rem' }}
                                        type="button"
                                        className="inline-flex w-full justify-center gap-x-1.5 text-lg font-semibold text-gray-900"
                                        id="menu-button"
                                        aria-expanded="true"
                                        aria-haspopup="true"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="account">
                                            <path
                                                d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2ZM10,26.39a6,6,0,0,1,11.94,0,11.87,11.87,0,0,1-11.94,0Zm13.74-1.26a8,8,0,0,0-15.54,0,12,12,0,1,1,15.54,0ZM16,8a5,5,0,1,0,5,5A5,5,0,0,0,16,8Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,16,16Z"
                                                data-name="13  User, Account, Circle, Person"
                                            />
                                        </svg>
                                        <svg
                                            className="-mr-1 h-8 w-8 text-gray-400"
                                            viewBox="0 0 20 20"
                                            fill="black"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                {show && <div
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="menu-button"
                                    tabIndex={-1}
                                >
                                    <div className="py-1" role="none">
                                        <Link
                                            to="host"
                                            onClick={()=>setShow(false)}
                                            className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-300 hover:text-gray-900"
                                            role="menuitem"
                                            tabIndex={-1}
                                            id="menu-item-0"
                                        >
                                            Account settings
                                        </Link>
                                        <Link
                                            to="host/cart"
                                            onClick={()=>setShow(false)}
                                            className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-300 hover:text-gray-900"
                                            role="menuitem"
                                            tabIndex={-1}
                                            id="menu-item-1"
                                        >
                                            Cart
                                        </Link>
                                        <Link
                                            to="host/bookings"
                                            onClick={()=>setShow(false)}
                                            className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-300 hover:text-gray-900"
                                            role="menuitem"
                                            tabIndex={-1}
                                            id="menu-item-1"
                                        >
                                            My Bookings
                                        </Link>
                                        <Link
                                            to="host/wishlist"
                                            onClick={()=>setShow(false)}
                                            className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-300 hover:text-gray-900"
                                            role="menuitem"
                                            tabIndex={-1}
                                            id="menu-item-1"
                                        >
                                            Wishlist
                                        </Link>

                                        <button
                                            type="submit"
                                            className="text-gray-700 block w-full px-4 py-2 text-left text-sm font-semibold hover:bg-gray-300 hover:text-gray-900"
                                            role="menuitem"
                                            tabIndex={-1}
                                            id="menu-item-3"
                                            onClick={logOut}
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                                }
                            </div>


                        </> :
                            <>
                                <NavLink style={({ isActive }) => { return { textDecoration: isActive ? 'underline' : 'none' } }} className='hover:underline font-normal text-lg' to={'login'}>Login</NavLink>
                                <NavLink style={({ isActive }) => { return { textDecoration: isActive ? 'underline' : 'none' } }} className='hover:underline font-normal text-lg' to={'signUp'}>SignUp</NavLink>
                            </>

                        }
                        <NavLink style={({ isActive }) => { return { textDecoration: isActive ? 'underline' : 'none' } }} className='hover:underline font-normal text-lg' to={'/about'}>About</NavLink>
                    </div>

                </div>
            </nav>

        </>
    )
}