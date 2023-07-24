import React from 'react'
import { useOutletContext } from 'react-router-dom';

export default function Pricing() {
  const {data}=useOutletContext();
  return (
    <>
      <p className='px-24 text-xl'>${data.price}/Day</p>
    </>
  )
}