import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import Loading from './Loading';
import { addDoc, and, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { app } from '../firebaseconfig';
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import Comments from './Comments';
import { getAuth } from 'firebase/auth';
import './style.css';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const auth = getAuth(app);
const db = getFirestore();
const a = [1, 2, 3, 4, 5];
export default function VanDetail() {
    const [current, setCurrent] = useState({ startDate: new Date(), endDate: new Date(), key: "selection", color: 'black' });
    const [dates, setDates] = useState([]);
    const navigate = useNavigate();
    const { user } = useOutletContext();
    const { id } = useParams();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [commentData, setCommentData] = useState({ message: '' });
    const [vanData, setVanData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ratings, setRatings] = useState(null);
    const [showOnBtn, setShow] = useState("Add to Cart");
    const [show, setShowOnBtn] = useState("Wishlist");
    const [data, setData] = useState({ reviews: null, response: null });
    const getData = async () => {
        const reviewQuery = query(collection(db, "Reviews"), and(where("review", '==', true), where("vanId", '==', id)));
        const reviewDocs = await getDocs(reviewQuery);
        const dbRef = doc(db, "BS0nrs2L1yX2JlcUeDgRVKg1xhI2", id);
        const dataSnap = await getDoc(dbRef);
        const reviewDocdata = [];
        for (let i = 0; i < reviewDocs.docs.length; i++) {
            reviewDocdata.push({ data: reviewDocs.docs[i].data(), id: reviewDocs.docs[i].id });
        }
        if (auth.currentUser) {
            const responseData = await getDoc(doc(db, "Response", auth.currentUser.uid));
            if (responseData.exists()) {
                setData({ reviews: reviewDocdata, response: responseData.data() });
            } else {
                setData({ reviews: reviewDocdata, response: {} });
            }
        } else {
            setData({ reviews: reviewDocdata, response: {} });
        }
        if (dataSnap.exists()) {
            const currentDates = [];
            const bookings = dataSnap.data().bookings;
            bookings.forEach((ele, index) => {
                if (new Date(ele.end).getTime() >= new Date(new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()).getTime()) {
                    currentDates.push({ startDate: new Date(ele.start), endDate: new Date(ele.end), key: index + 2, color: 'rgb(54,69,79,0.4)' ,disabled:true})
                }
            })
            setDates(currentDates);
            setVanData(dataSnap.data())

        } else {
            console.log("not exists");
        }
    }
    useEffect(() => {
        const func = async () => {
            await getData();
        }
        if (!vanData) {
            func();
        }
        if (vanData) {
            const toAdd = [
                { value: vanData.rating[0], label: '1' },
                { value: vanData.rating[1], label: '2' },
                { value: vanData.rating[2], label: '3' },
                { value: vanData.rating[3], label: '4' },
                { value: vanData.rating[4], label: '5' }
            ];
            setRatings(toAdd);
            setLoading(false);
        }
        //eslint-disable-next-line
    }, [vanData])
    let chartConfig = {
        type: 'bar2d',
        width: '440',
        height: '250',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "theme": "fusion",
                "caption": `${vanData ? vanData.vanName : ''}`,
                "subCaption": "Rating",
                "yAxisName": "Number of people",
                "alignCaptionWithCanvas": "0"
            },
            "data": ratings
        }
    }
    const removeData = () => {
        setCommentData({ message: '' });
        while (document.getElementsByClassName("on").length > 0) {
            document.getElementsByClassName("on")[0].classList.replace("on", "off")
        }
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            window.alert("Please rate this van");
            return;
        }
        if(auth.currentUser===null){
            window.alert("You need to be logged in")
            return;
        }
        const addData = {
            ...commentData, rating, likes: 0, dislikes: 0, reply: 0, review: true, name: user.username, vanId: id, vanName: vanData.vanName, timestamp: new Date().getTime()
        }
        let newRating = [...vanData.rating]
        newRating[rating - 1]++;
        const docRef = await addDoc(collection(db, "Reviews"), addData);
        await updateDoc(doc(db, "BS0nrs2L1yX2JlcUeDgRVKg1xhI2", id), {
            rating: newRating
        })

        setData({ ...data, reviews: [{ data: addData, id: docRef.id }, ...data.reviews] })
        removeData();
    }
    const cartAddHandler = async (e) => {
        e.preventDefault();
        if(auth.currentUser===null){
            window.alert("You need to be logged in")
            return;
        }
        if (showOnBtn === "Go to Cart") {
            navigate('/host/cart');
        } else {
            setShow("Adding...");
            await setDoc(doc(db, "bookings", auth.currentUser.uid), {
                [id]: {
                    time_slot: {
                        start: new Date(current.startDate).getFullYear() + "-" + (new Date(current.startDate).getMonth() + 1 < 10 ? "0" + (new Date(current.startDate).getMonth() + 1) : new Date(current.startDate).getMonth() + 1) + "-" + new Date(current.startDate).getDate(),
                        end: new Date(current.endDate).getFullYear() + "-" + (new Date(current.endDate).getMonth() + 1 < 10 ? "0" + (new Date(current.endDate).getMonth() + 1) : new Date(current.endDate).getMonth() + 1) + "-" + new Date(current.endDate).getDate()
                    },
                    vanName: vanData.vanName,
                    price: vanData.price,
                    type: vanData.type
                }
            }, { merge: true });
            setShow("Go to Cart");
        }
    }
    const wishlistHandler = async () => {
        if(auth.currentUser===null){
            window.alert("You need to be logged in")
            return;
        }
        if (show === "Go to Wishlist") {
            navigate("/host/wishlist");
        } else {
            setShowOnBtn("Adding...");
            await setDoc(doc(db, "wishlist", auth.currentUser.uid), {
                [id]: {
                    vanName: vanData.vanName,
                    price: vanData.price,
                    type: vanData.type
                }
            },
                { merge: true });
            setShowOnBtn("Go to Wishlist");
        }
    }
    const location = useLocation();
    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            <div className='mx-auto px-14 mt-12 mb-24 space-y-8'>
                <Link to={(location.state.search === "" ? '/vans' : `/vans?${location.state.search}`)} className='text-medium underline'><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="512"
                    height="512"
                    enableBackground="new 0 0 512 512"
                    version="1.1"
                    viewBox="0 0 512 512"
                    xmlSpace="preserve"
                    className='inline w-[1rem] h-[1rem]'
                >
                    <path d="M352 128.4L319.7 96 160 256 160 256 160 256 319.7 416 352 383.6 224.7 256z"></path>
                </svg>Back to all Vans</Link>
                <div className='md:px-20 flex justify-center'>
                    <div className='space-y-8 flex flex-col'>
                        <div className='flex space-x-4'>
                            <p className='text-2xl font-semibold'>{vanData.vanName}</p>
                            <div className='bg-slate-900 rounded text-xl p-1 text-slate-100'>{vanData.type}</div>
                        </div>
                        <img className='self-center' alt='' src={require('../images/10.jpg')} />
                        <p className='bg-slate-100 p-1.5 rounded-lg'>{vanData.description}</p>
                        <form onSubmit={cartAddHandler}>
                            <p className='underline'>Select only with black color</p>
                            <DateRangePicker minDate={new Date()} onChange={(item) => {
                                if (Object.keys(item)[0] === "selection") {
                                    for (const obj of dates) {
                                        if ((new Date(obj.startDate).getTime() >= new Date(item.selection.startDate).getTime() && new Date(obj.startDate).getTime() <= new Date(item.selection.endDate).getTime()) || (new Date(obj.endDate).getTime() >= new Date(item.selection.startDate).getTime() && new Date(obj.endDate).getTime() <= new Date(item.selection.endDate).getTime())) {
                                            return;
                                        }
                                    }
                                    setCurrent(item.selection);
                                }
                            }}
                                ranges={[...dates, current]} />
                            <div className='flex space-x-4 p-1.5'>
                                <p className='w-1/3 text-lg bg-orange-600 p-1.5 text-white font-semibold text-center rounded-lg'>{`Price : INR  ${vanData.price}/day`}</p>
                                <button onClick={wishlistHandler} className='w-1/3 text-xl bg-black shadow-lg text-white font-semibold p-1.5 rounded-lg' type='button'>{show}</button>
                                <button disabled={showOnBtn === 'Adding...' ? true : false} className='w-1/3 text-xl text-center bg-black text-white shadow-lg p-1.5 font-semibold rounded-lg'>{showOnBtn}</button>
                            </div>
                        </form>

                        <p className='text-xl font-semibold'>Van Details</p>
                        <div className='flex justify-between'>
                            <div className='flex flex-col space-y-2'>
                                <p className='text-lg bg-slate-200 p-1.5 rounded-lg'>Mileage</p>
                                <p className='text-center'>{vanData.mileage} Km/Litre</p>
                            </div>
                            <div className='flex flex-col space-y-2'>
                                <p className='text-lg bg-slate-200 p-1.5 rounded-lg'>Van Company</p>
                                <p className='text-center'>{vanData.vanCompany}</p>
                            </div>
                            <div className='flex flex-col space-y-2'>
                                <p className='text-lg bg-slate-200 p-1.5 rounded-lg'>Year Of Manufacture</p>
                                <p className='text-center'>{vanData.yearOfManufacture}</p>
                            </div>
                            <div className='flex flex-col space-y-2'>
                                <p className='text-lg bg-slate-200 p-1.5 rounded-lg'>Safety Rating</p>
                                <p className='text-center'>{vanData.safetyRating}</p>
                            </div>
                        </div>
                        <p className='text-xl font-semibold'>Rating & Reviews</p>
                        <div className='mx-16 flex justify-evenly'>
                            <div className='flex flex-col space-y-4 justify-center'>
                                <p className='text-center text-xl font-medium'>{vanData.rating[0] + vanData.rating[1] + vanData.rating[2] + vanData.rating[3] + vanData.rating[4]}<br /> Ratings</p>
                                <div className='flex space-x-2'>
                                    <p className='text-xl font-medium'>{Math.round((vanData.rating[0] + vanData.rating[1] * 2 + vanData.rating[2] * 3 + vanData.rating[3] * 4 + vanData.rating[4] * 5) / (vanData.rating[0] + vanData.rating[1] + vanData.rating[2] + vanData.rating[3] + vanData.rating[4]))}</p>

                                    {
                                        a.map((ele) => {
                                            return (
                                                ele <= Math.round((vanData.rating[0] + vanData.rating[1] * 2 + vanData.rating[2] * 3 + vanData.rating[3] * 4 + vanData.rating[4] * 5) / (vanData.rating[0] + vanData.rating[1] + vanData.rating[2] + vanData.rating[3] + vanData.rating[4])) ?
                                                    <>
                                                        <svg className='pt-1' xmlns="http://www.w3.org/2000/svg" fill='#ffdf00' height="1.4em" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" /></svg>
                                                    </> : <></>)
                                        })
                                    }
                                    <p className='flex-none'>Rating</p>
                                    <div />
                                </div>
                            </div>
                            <ReactFC {...chartConfig} />
                        </div>
                        <div className='grid grid-cols-1'>
                            <p className='text-xl'>{`Comments (${data.reviews.length})`}</p>
                            <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
                            <form onSubmit={submitHandler} className='flex flex-col space-y-4'>
                                <label htmlFor='comment'>Add Comment</label>
                                <textarea onChange={(e) => setCommentData({ ...commentData, message: e.target.value })} value={commentData.message} required rows='3' className='bg-gray-100 rounded-2xl p-2 text-lg' name='comment' type='text' />
                                <div className="star-rating">
                                    {[...Array(5)].map((star, index) => {
                                        index += 1;
                                        return (
                                            <button
                                                type="button"
                                                key={index}
                                                className={index <= (hover || rating) ? "on" : "off"}
                                                onClick={() => setRating(index)}
                                                onMouseEnter={() => setHover(index)}
                                                onMouseLeave={() => setHover(rating)}
                                            >
                                                <span className="star">&#9733;</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className='space-x-4'>
                                    <button type='button' onClick={removeData} className='rounded-full bg-gray-300 font-semibold p-3'>Cancel</button>
                                    <button type='submit' className='rounded-full hover:bg-orange-600 bg-orange-500 text-white font-semibold p-3'>Comment</button>
                                </div>
                            </form>
                        </div>
                        <div className='px-32'>
                            {
                                data.reviews.map((ele) => {
                                    return <Comments key={ele.id} id={ele.id} review={true} data={ele.data} response={data.response} user={user} />
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}