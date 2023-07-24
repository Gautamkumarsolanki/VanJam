import React from 'react'
import { useOutletContext } from 'react-router-dom';

export default function Photos() {
	const { data } = useOutletContext();

	return (
		<>
			<div className='px-24 flex space-x-6'>
				{
					data.images.map((ele, i) => {
						return (
							<img key={i} className='h-36 w-36' alt='' src={ele} />
						)
					})
				}
			</div>
		</>
	)
}