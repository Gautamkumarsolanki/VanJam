import React from 'react'
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { useState } from 'react';
import Loading from '../Loading';
import { useEffect } from 'react';
import { app } from '../../firebaseconfig';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import Comments from '../Comments';
import { useOutletContext } from 'react-router-dom';

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const auth = getAuth(app);
const db = getFirestore();

export default function Reviews() {
  const user = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ rating: null, reviews: null, response: null });
  const [commentData, setCommentData] = useState({ message: '', rating: NaN });

  useEffect(() => {
    const getData = async () => {
      const q = query(collection(db, "BS0nrs2L1yX2JlcUeDgRVKg1xhI2"), where("uid", "==", auth.currentUser.uid));
      const responseData = await getDoc(doc(db, "Response", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const docSnap = querySnapshot.docs;
      const rating = [];
      let reviews = [];

      for (const doc of docSnap) {
        rating.push({ label: doc.get('vanName'), value: Math.round((doc.data().rating[0]+doc.data().rating[1]*2+doc.data().rating[2]*3+doc.data().rating[3]*4+doc.data().rating[4]*5)/(doc.data().rating[0]+doc.data().rating[1]+doc.data().rating[2]+doc.data().rating[3]+doc.data().rating[4])) });
        const reviewQuery = query(collection(db, "Reviews"), where("vanId", "==", doc.id));
        const reviewsDocSnap = await getDocs(reviewQuery);
        const reviewData = reviewsDocSnap.docs;
        for (const reviewDoc of reviewData) {
          reviews.push({ data: reviewDoc.data(), id: reviewDoc.id })
        }
      }
      setData({ reviews, rating, response: responseData.data() });
      setLoading(false);
    }
    getData();
  }, [])
  const chartConfig = {
    type: 'bar2d',
    width: '450',
    height: '220',
    dataFormat: 'json',
    dataSource: {
      "chart": {
        "theme": "fusion",
        "caption": "Rating Of Vans",
        "subCaption": "Last month",
        "yAxisName": "Rating points",
        "alignCaptionWithCanvas": "0"
      },
      "data": data.rating
    }
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    const addData = {
      ...commentData, likes: 0, dislikes: 0, reply: 0, review: true, name: user.username, vanId: "sBd6ZRmShjtMP7vBLrja", vanName: "Ford Transit"
    }
    const docRef = await addDoc(collection(db, "Reviews"), addData);
    setData({ ...data, reviews: [{ data: addData, id: docRef.id }, ...data.reviews] })
    setCommentData({ message: '', rating: NaN });
  }
  if (loading) {
    return <Loading />;
  } else {
    return (
      <div className='mt-20 mb-24 flex justify-center' >
        <div className='grid grid-cols-2 space-y-10'>
          <p className='text-center text-3xl text-orange-500 font-semibold col-span-2'> Reviews</p>
          <ReactFC {...chartConfig} />
          <p className='col-span-2 text-xl'>{`Comments (${data.reviews.length})`}</p>
          <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50 col-span-2" />
          <form onSubmit={submitHandler} className='flex flex-col space-y-4 col-span-2'>
            <label htmlFor='comment'>Add Comment</label>
            <textarea onChange={(e) => setCommentData({ ...commentData, message: e.target.value })} value={commentData.message} required rows='3' className='bg-gray-100 rounded-2xl p-2 text-lg' name='comment' type='text' />
            <label htmlFor='rating'>Rating</label>
            <input onChange={(e) => setCommentData({ ...commentData, rating: e.target.value })} value={commentData.rating} required min={1} max={5} className='bg-gray-100 h-12 w-32 rounded-2xl p-2 text-lg' type='number' name='rating' />
            <div className='space-x-4'>
              <button type='button' onClick={()=>setCommentData({message:'',rating:NaN})} className='rounded-full bg-gray-300 font-semibold p-3'>Cancel</button>
              <button type='submit' className='rounded-full bg-orange-400 text-white font-semibold p-3'>Comment</button>
            </div>
          </form>
          <ul className='col-span-2 divide-y-2'>
            {
              data.reviews.map((ele) => {
                return <Comments key={ele.id} data={ele.data} id={ele.id} review={true} response={data.response} user={user}/>
              })
            }
          </ul>
        </div>

      </div >
    )
  }
}