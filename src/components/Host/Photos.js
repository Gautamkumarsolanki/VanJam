import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import React, { useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom';

export default function Photos() {
	const { data } = useOutletContext();
	const reff = useRef(null);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [preview, setPreview] = useState([]);
	const handleClick = () => {
		reff.current?.click();
	}
	const fileChangeHandler = (e) => {
		let files = [];
		let pre = [];

		for (const file of e.target.files) {
			pre.push(URL.createObjectURL(file));
			files.push(file);
		}
		setSelectedFiles(files);
		setPreview(pre)

	}
	return (
		<>
			<div className='px-24 flex flex-col space-x-6'>
				<div className='flex space-x-6'>
					{
						data.images.map((ele, i) => {
							return (
								<img key={i} className='h-36 w-36' alt='' src={ele} />
							)
						})
					}
					<div onClick={handleClick} className='pt-10 px-4 flex flex-col items-center bg-violet-100 text-violet-500 rounded-lg hover:bg-violet-100 cursor-pointer'>
						<CloudArrowUpIcon className='w-6 h-6' />
						<span>Choose images to upload</span>
						<input multiple type="file" onChange={fileChangeHandler} ref={reff} className="hidden" />
					</div>
				</div>
				<div>
					{
						selectedFiles.length > 0 && (
							<div className='p-4 mt-4 bg-violet-50 overflow-hidden text-ellipsis'>
								<p>Selected Files:</p>
								<div className='flex space-x-4'>
									{
										preview.map((file, i) => {
											return (
												<img key={i} alt='' className='h-40 w-40' src={file} />
											)
										})
									}
								</div>
							</div>
						)
					}
				</div>

			</div>
		</>
	)
}