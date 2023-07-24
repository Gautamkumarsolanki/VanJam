import React, { useEffect, useState } from 'react'
import Loading from '../Loading';
import { app } from '../../firebaseconfig';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const db = getFirestore(app);
const auth = getAuth();

export default function Income() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ incomeData: null, total: 0 });
  useEffect(() => {
    const getData = async () => {
      const q = query(collection(db, "BS0nrs2L1yX2JlcUeDgRVKg1xhI2"), where("uid", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const docSnap = querySnapshot.docs;
      const incomeData = [];
      let total = 0;
      for (const doc of docSnap) {
        incomeData.push({ label: doc.get('vanName'), value: doc.get('income') });
        total += doc.get('income');
      }
      setData({ incomeData, total });
      setLoading(false);
    }
    getData();
  }, [])
  const chartConfigs = {
    type: "column2d",
    width: "700",
    height: "500",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Income Per Van",
        subCaption: "In Rupees",
        xAxisName: "Van Name",
        yAxisName: "Total Earning By Van",
        theme: "fusion"
      },
      data: data.incomeData
    }
  };
  const chartConfigsDoughNut = {
    type: 'doughnut2d',
    width: '750',
    height: '500',
    dataFormat: 'json',
    dataSource: {
      "chart": {
        "caption": "Split of Revenue by Vans",
        "subCaption": "Till Now",
        "numberPrefix": "INR ",
        "bgColor": "#ffffff",
        "startingAngle": "310",
        "showLegend": "1",
        "defaultCenterLabel": `Total revenue: INR ${data.total}`,
        "centerLabel": "Revenue from $label: $value",
        "centerLabelBold": "1",
        "showTooltip": "0",
        "decimals": "0",
        "theme": "fusion"
      },
      data: data.incomeData
    }
  }
  if (loading) {
    return <Loading />;
  }
  else {
    return (
      <div className='mt-20 mb-24 flex justify-center'>
        <div className='flex flex-col space-y-20'>
          <p className='text-3xl text-orange-500 font-semibold text-center'>Your Earnings</p>
          <ReactFC {...chartConfigsDoughNut} />
          <ReactFC {...chartConfigs} />
        </div>
      </div>
    )
  }
}