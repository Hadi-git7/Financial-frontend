import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
// import { mockLineData as data } from "../data/mockData";
import React, { useCallback, useState, useEffect } from 'react';
import { format } from 'date-fns';


const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [totalIncome, setTotaIncome] = useState('');
  const [totalExpense, setTotalExpense] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchIncome = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/income?year=${selectedYear}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const totalAmount = data.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
      setTotaIncome(totalAmount); // assuming you have a state variable called "totalIncome"
      setIncomes(data);
    //   console.log(data)
    } catch (error) {
      console.error(error);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/expense?year=${selectedYear}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const totalAmount = data.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
      setTotalExpense(totalAmount); // assuming you have a state variable called "totalExpense"
      setExpenses(data); // save all expenses data to state
    //   console.log(data)
    } catch (error) {
      console.error(error);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchExpenses();
    
console.log("Expenses: ", expenses);

  }, [fetchExpenses]);

  const months = Array.from({ length: 12 }, (_, i) => format(new Date(selectedYear, i), 'MMMM'));

  const chartData = [
    {
      id: 'income',
      data: months.map((month) => {
        const income = incomes.find((income) => format(new Date(income.start_date), 'MMMM') === month);
        return {
          x: month,
          y: income ? income.amount : 0,
        };
      }),
    },
    {
      id: 'expenses',
      data: months.map((month) => {
        const expense = expenses.find((expense) => format(new Date(expense.end_date), 'MMMM') === month);
        return {
          x: month,
          y: expense ? expense.amount : 0,
        };
      }),
    },
  ];
    return (
        <ResponsiveLine
            data={chartData}
            theme={{
                axis: {
                    domain: {
                        line: {
                            stroke: colors.grey[100],
                        },
                    },
                    legend: {
                        text: {
                            fill: colors.grey[100],
                        },
                    },
                    ticks: {
                        line: {
                            stroke: colors.grey[100],
                            strokeWidth: 1,
                        },
                        text: {
                            fill: colors.grey[100],
                        },
                    },
                },
                legends: {
                    text: {
                        fill: colors.grey[100],
                    },
                },
                tooltip: {
                    container: {
                        color: colors.primary[500],
                    },
                },
            }}
            colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
                type: "linear",
                min: "0",
                max: "10000000",
                stacked: true,
                reverse: false,
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: "bottom",
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                legend: isDashboard ? undefined : "transportation",
                legendOffset: 36,
                legendPosition: "middle",
            }}
            axisLeft={{
                orient: "left",
                tickValues: 5,
                tickSize: 3,
                tickPadding: 5,
                tickRotation: 0,
                legend: isDashboard ? undefined : "count",
                legendOffset: -40,
                legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={8}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                    effects: [
                        {
                        on: "hover",
                        style: {
                            itemBackground: "rgba(0, 0, 0, .03)",
                            itemOpacity: 1,
                        },
                        },
                    ],
                },
            ]}
        />
    );
};

export default LineChart;