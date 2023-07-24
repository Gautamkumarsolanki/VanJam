import React from 'react'
import { useOutletContext } from 'react-router-dom';

export default function Photos() {
  const { data } = useOutletContext();

  return (
    <>
      <div className='px-24'>
        {/* <img className='h-24 w-24' alt='' src={require('../../images/' + data.image)} /> */}
        <p>image</p>
      </div>
    </>
  )
}