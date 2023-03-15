import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import FlagIcon from '@mui/icons-material/Flag';
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import React, { useCallback,useState,  useEffect } from 'react';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CategoryIcon from '@mui/icons-material/Category';
import PieChart from "../../components/PieChart";
import LineChartComponent from "../../components/LineChart";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalIncome,setTotaIncome] = useState('');
  const [totalExpense,setTotalExpense] = useState('');
  const [numCategories, setNumCategories] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);



  const fetchIncome = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/income');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const totalAmount = data.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
      setTotaIncome(totalAmount); // assuming you have a state variable called "totalIncome"
      setIncomes(data);
      console.log(data)
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/expense');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const totalAmount = data.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
      setTotalExpense(totalAmount); // assuming you have a state variable called "totalExpense"
      setExpenses(data); // save all expenses data to state
      console.log(data)
    } catch (error) {
      console.error(error);
    }
  }, []);
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/category');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setNumCategories(data.length); // Set the number of categories in state
      console.log(data)
    } catch (error) {
      console.error(error);
    }
  }, []);
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  

  const fetchGoal = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/goal');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data)
    } catch (error) {
      console.error(error);
    }
  }, []);


  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`$${totalIncome}`}
            subtitle="Total Income"
            progress="0.75"
            increase="+14%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`$${totalExpense}`}
            subtitle="Total Expense"
            progress="0.50"
            increase="+21%"
            icon={
              <ReceiptIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
        <StatBox
          title={`${numCategories}`}
          subtitle="Categories"
          icon={
            <CategoryIcon
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
          }
        />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`$${totalIncome-totalExpense}`}
            subtitle="Profit"
            progress="0.80"
            increase="+43%"
            icon={
              <FlagIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        {/* Revenue */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          position="relative"

        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            position="absolute"
            top="40%"
            right="0px"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {`$${totalIncome-totalExpense}`}
              </Typography>
            </Box>
         
          </Box>
          <Box height="250px" >
            <LineChartComponent isDashboard={true} />
          </Box>
          
        </Box>

        {/* Transactions */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
               Incomes
            </Typography>
          </Box>
          {incomes.map((income, i) => (
  <Box
    key={`${income.id}-${i}`}
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    borderBottom={`4px solid ${colors.primary[500]}`}
    p="15px"
  >
    <Box>
      <Typography
        color={colors.greenAccent[500]}
        variant="h5"
        fontWeight="600"
      >
        {income.id}
      </Typography>
      <Typography
        color={colors.greenAccent[500]}
        variant="h5"
        fontWeight="600"
      >
        {income.title}
      </Typography>
      <Typography color={colors.grey[100]}>
        {income.created_by}
      </Typography>
    </Box>
    <Box color={colors.grey[100]}>{income.date}</Box>
    <Box
      backgroundColor={colors.greenAccent[500]}
      p="5px 10px"
      borderRadius="4px"
      color="black"
    >
      ${income.amount}
    </Box>
  </Box>
))}

        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          
        >
         
          <Box m="-20px">
            <Box height="27vh">
                <PieChart />
            </Box>
        </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
Goal          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
      
        {/* Transactions */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
               Expenses
            </Typography>
          </Box>
          {expenses.map((expense, i) => (
            <Box
              key={`${expense.id}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {expense.id}
                </Typography>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {expense.title}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {expense.created_by}
                </Typography>
               
              </Box>
              <Box color={colors.grey[100]}>{expense.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
                color="black"
              >
                ${expense.amount}
              </Box>
            </Box>
          ))}

        </Box>

      </Box>
    </Box>
  );
};

export default Dashboard;