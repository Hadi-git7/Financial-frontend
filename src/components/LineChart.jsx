import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useCallback, useState, useEffect } from "react";

function LineChartComponent() {
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/api/goal");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedData = data.sort((a, b) => a.year - b.year);

  return (
    <>
      <ResponsiveContainer width="90%" aspect={3}>
        <LineChart
          width={500}
          height={300}
          data={sortedData}
          margin={{
            top: 15,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid  horizontal="true" vertical="" stroke="#243240"/>
          <XAxis dataKey="year" tick={{fill:"#fff"}}/>
          <YAxis tick={{fill:"#fff"}} />
          <Tooltip contentStyle={{ backgroundColor: "#8884d8", color: "#fff" }} itemStyle={{ color: "#fff" }} cursor={false}/>
          <Line type="monotone" dataKey="profit" stroke="#8884d8" strokeWidth="5" dot={{fill:"#2e4355",stroke:"#8884d8",strokeWidth: 2,r:5}} activeDot={{fill:"#2e4355",stroke:"#8884d8",strokeWidth: 5,r:10}} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default LineChartComponent;
