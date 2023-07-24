import React from 'react'
import { addDoc, and, collection, doc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseconfig';

const auth = getAuth(app)
const db = getFirestore();

export default function Comments({ data, id, review, response, user }) {
    const [replyData, setReplyData] = useState('');
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responseData, setResponseData] = useState({ likes: data.likes, dislikes: data.dislikes, reply: data.reply })
    const [responseType, setResponseType] = useState(response[id]);
    useEffect(() => {
        if (showReplies) {
            const q = query(collection(db, "Reviews"), and(where("reviewId", '==', id), where("review", '==', false)));
            getDocs(q).then((querySnapshot) => {
                const repliesArray = [];
                for (const doc of querySnapshot.docs) {
                    repliesArray.push({ data: doc.data(), id: doc.id })
                }
                setReplies(repliesArray);
                setLoading(false);
            })
        }
        // eslint-disable-next-line
    }, [showReplies])
    const responseHandler = async (type) => {
        if(auth.currentUser===null){
            window.alert("You need to be logged in")
            return;
        }
        if (type === "like") {
            if (responseType === "like") {
                setResponseData({ ...responseData, likes: responseData.likes - 1 });
                await setDoc(doc(db, "Response", auth.currentUser.uid), {
                    [id]: "none"
                }, { merge: true });
                await updateDoc(doc(db, "Reviews", id), {
                    "likes": responseData.likes - 1
                })
                setResponseType("none");
            } else {
                setResponseData({ ...responseData, likes: responseData.likes + 1, dislikes: responseType === "dislike" ? responseData.dislikes - 1 : responseData.dislikes });
                await setDoc(doc(db, "Response", auth.currentUser.uid), {
                    [id]: "like"
                }, { merge: true });
                await updateDoc(doc(db, "Reviews", id), {
                    "likes": responseData.likes + 1,
                    "dislikes": responseType === "dislike" ? responseData.dislikes - 1 : responseData.dislikes
                })
                setResponseType("like");
            }
        } else {
            if (responseType === "dislike") {
                setResponseData({ ...responseData, dislikes: responseData.dislikes - 1 });
                await setDoc(doc(db, "Response", auth.currentUser.uid), {
                    [id]: "none"
                }, { merge: true });
                await updateDoc(doc(db, "Reviews", id), {
                    "dislikes": responseData.dislikes - 1
                })
                setResponseType("none");
            } else {
                setResponseData({ ...responseData, dislikes: responseData.dislikes + 1, likes: responseType === "like" ? responseData.likes - 1 : responseData.likes });
                await setDoc(doc(db, "Response", auth.currentUser.uid), {
                    [id]: "dislike"
                }, { merge: true });
                await updateDoc(doc(db, "Reviews", id), {
                    "dislikes": data.dislikes + 1,
                    "likes": responseType === "like" ? responseData.likes - 1 : responseData.likes
                })
                setResponseType("dislike");
            }
        }
    }
    const replyHandler = async (e) => {
        e.preventDefault();
        if(auth.currentUser===null){
            window.alert("You need to be logged in")
            return;
        }
        const addData = { message: replyData, likes: 0, dislikes: 0, review: false, name: user.username, reviewId: id, userId: user.uid, timestamp: new Date().getTime() };
        console.log(addData);
        const docRef = await addDoc(collection(db, "Reviews"), addData);
        await updateDoc(doc(db, "Reviews", id), {
            reply: responseData.reply + 1
        })
        setResponseData({ ...responseData, reply: responseData.reply + 1 });
        setReplies([{ data: addData, id: docRef.id }, ...replies])
        setReplyData('');
    }
    return (
        <li className='flex space-x-4 p-2'>
            <div className='h-14 w-14'>
                <div className='h-12 w-12 rounded-full text-white bg-orange-500 text-2xl pt-1.5 text-center font-semibold'>{data.name[0]}</div>
            </div>
            <div className='space-y-2'>
                <div className='flex space-x-4'>
                    <p className='text-xs'>@{data.name}</p>
                    {review && <p className='mr-1 text-xs'>{data.vanName}</p>}
                    <p className='text-xs text-gray-500'>{(new Date().getFullYear() - new Date(data.timestamp).getFullYear()) !== 0 ? new Date().getFullYear() - new Date(data.timestamp).getFullYear() + " years ago" : (new Date().getMonth() - new Date(data.timestamp).getMonth()) !== 0 ? new Date().getMonth() - new Date(data.timestamp).getMonth() + " months ago" : (new Date().getDate() - new Date(data.timestamp).getDate()) !== 0 ? new Date().getDate() - new Date(data.timestamp).getDate() + " days ago" : (new Date().getHours() - new Date(data.timestamp).getHours()) === 0 ? (new Date().getMinutes() - new Date(data.timestamp).getMinutes()) === 0 ? (new Date().getSeconds() - new Date(data.timestamp).getSeconds()) === 0 ? "now" : new Date().getSeconds() - new Date(data.timestamp).getSeconds() + " seconds ago" : new Date().getMinutes() - new Date(data.timestamp).getMinutes() + " minutes ago" : new Date().getHours() - new Date(data.timestamp).getHours() + " hours ago"}</p>
                </div>
                <div className='flex'>
                    <p className='w-10/12'>{data.message}</p>
                    {
                        review &&
                        <>
                            <p className='mr-1'>{data.rating}</p>
                            {
                                [...Array(5)].map((ele, index) => {
                                    if (index < Number(data.rating)) {
                                        return (
                                            <p style={{ color: '#FEBE10' }}>&#9733;</p>);
                                    }else{
                                        return (<></>);
                                    }
                                })
                            }
                        </>


                    }
                </div>
                <div className='flex space-x-10'>
                    <div className='flex space-x-2'>
                        <button type='button' onClick={() => responseHandler("like")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill={responseType === "like" ? "orange" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                            </svg>
                        </button>
                        <p>{responseData.likes}</p>
                    </div>
                    <div className='flex space-x-2'>
                        <button type='button' onClick={() => responseHandler("dislike")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill={responseType === "dislike" ? "orange" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                            </svg>
                        </button>
                        <p>{responseData.dislikes}</p>
                    </div>
                    {review && <div className='flex space-x-2'>
                        <button onClick={() => setShowReplies(!showReplies)} type='button'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg" width="28.996" height="27.002" viewBox="0 0 7.672 7.144">
                                <path
                                    d="M252.496.998a2.504 2.504 0 00-2.494 2.504v15a2.502 2.502 0 002.494 2.502h.502V27.5a.5.5 0 00.828.377l7.862-6.873h14.816a2.502 2.502 0 002.494-2.502v-15a2.504 2.504 0 00-2.494-2.504zm0 1.004h24.008c.84 0 1.498.66 1.498 1.5v15c0 .84-.658 1.498-1.498 1.498h-15a.5.5 0 00-.334.125l-7.166 6.268v-5.891a.5.5 0 00-.502-.502h-1.006c-.84 0-1.498-.658-1.498-1.498v-15c0-.84.658-1.5 1.498-1.5zm9.98 4.5a.5.5 0 00-.042.004.5.5 0 00-.29.14L259.18 9.62a.5.5 0 00-.006.004l-.026.027a.5.5 0 00-.148.346.5.5 0 00.145.352.5.5 0 00.004.004.5.5 0 00.023.023l2.973 2.98a.5.5 0 00.709 0 .5.5 0 000-.709l-2.149-2.148h5.795a2.49 2.49 0 012.504 2.504v2a.5.5 0 00.494.494.5.5 0 00.502-.494v-2c0-1.93-1.57-3.5-3.5-3.5h-5.8l2.154-2.148a.5.5 0 000-.708.5.5 0 00-.377-.144z" color="#000"
                                    fontFamily="sans-serif" fontWeight="400" overflow="visible" transform="translate(-66.146 -.264) scale(.26458)"></path>
                            </svg>
                        </button>
                    </div>}
                </div>
                <div className='pl-12 pt-4' style={{ display: showReplies ? 'block' : 'none' }}>
                    {
                        loading && <p>loading...</p>
                    }
                    {

                        replies &&
                        <>
                            <form onSubmit={replyHandler} className='mb-2 flex flex-col space-y-1'>
                                <label htmlFor='reply'>Add reply</label>
                                <input required onChange={(e) => setReplyData(e.target.value)} value={replyData} name='reply' className='bg-gray-100 rounded-xl p-2' placeholder='Type Something ...' type='text' />
                                <div className='flex space-x-2'>
                                    <button onClick={() => setReplyData('')} className='bg-gray-300 p-1 text-sm rounded-full' type='button'>Cancel</button>
                                    <button className='bg-orange-500 p-1 text-sm rounded-full text-white' type='submit'>Reply</button>
                                </div>
                            </form>
                            <p className='col-span-2 h-4 text-md pb-6'>{`${responseData.reply > 1 ? "Replies" : "Reply"} (${responseData.reply})`}</p>

                            {
                                replies.map((ele) => {
                                    return <Comments key={ele.id} review={false} data={ele.data} id={ele.id} response={response} user={user} />
                                })
                            }
                        </>
                    }
                </div>
            </div>
        </li>
    )
}
