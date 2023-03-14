import React, { useCallback, useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import Axios from "axios";
import "../goal/goal.css";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";



const Goal = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [profitDate, setProfitDate] = useState([]);
  const [profitID, setProfitID] = useState([]);
  const [filterIncome, setFilterIncome] = useState([]);
  const [filterExpense, setFilterExpense] = useState([]);
  const [yearExpense, setYearExpense] = useState([]);
  const [yearIncome, setYearIncome] = useState([]);
  const [profitValue, setProfitValue] = useState([]);
  

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 15,
    borderRadius: 2,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 2,
      backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
    },
  }));

  useEffect(() => {
    let isMounted = true; // set a flag to check if the component is mounted

    fetchData();
    incomedata();
    expdata();
    

    return () => {
      isMounted = false; // set the flag to false when the component unmounts
    };
  }, []);

  const handleCreateNewRow = useCallback(async (values) => {
    try {
      const response = await fetch('http://localhost:8000/api/goal');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/goal");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      var profitdate = jsonData.map((item) => item.year);
      var profitid = jsonData.map((item) => item.id);
      var profitvaluestring = jsonData.map((item) => item.profit);
      const profitvalue = parseFloat(profitvaluestring);

      console.log(profitvalue);
      console.log(profitid);
      setProfitDate(profitdate);
      setTableData(jsonData);
      setProfitValue(profitvalue);
      setProfitID(profitid);
    } catch (error) {
      console.error(error);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second and retry the function
      await fetchData();
    }
  };

  console.log("LALA ", profitDate);

  const incomedata = async () => {
    try {
      const income = await fetch("http://localhost:8000/api/income");
      if (!income.ok) {
        throw new Error("Network response was not ok");
      }
      const yearinc = [];
      const jsonincome = await income.json();
      const incdate = jsonincome.map((item) => item.end_date);
      const n = incdate.length;
      for (let i = 0; i < n; i++) {
        yearinc[i] = incdate[i].split("-")[0];
      }
      const filteredincome = jsonincome.map((item) => item.amount);
      setFilterIncome(filteredincome);
      setYearIncome(yearinc);
      console.log(filteredincome);
      console.log(yearinc);
    } catch (error) {
      console.error(error);
    }
  };
  const m = yearIncome.length;
  const mm = filterIncome.length;
  const indexinc = [];
  const arrayIncomestring = [];
  for (let i = 0; i < m; i++) {
    if (yearIncome[i] == profitDate) {
      indexinc[i] = i;
    }
  }
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < mm; j++) {
      if (indexinc[i] == j) {
        arrayIncomestring[j] = filterIncome[j];
      }
    }
  }
  const arrayIncome = [];
  for (let i = 0; i < arrayIncomestring.length; i++) {
    arrayIncome[i] = parseFloat(arrayIncomestring[i]);
  }
  let totalIncome = 0;

  arrayIncome.forEach((item) => {
    totalIncome += item;
  });
  console.log(arrayIncome);
  console.log(totalIncome);

  console.log(indexinc);
  const expdata = async () => {
    try {
      const expense = await fetch("http://localhost:8000/api/expense");
      if (!expense.ok) {
        throw new Error("Network response was not ok");
      }
      const yearexp = [];
      const jsonexpense = await expense.json();
      const expdate = jsonexpense.map((item) => item.end_date);
      const n = expdate.length;
      for (let i = 0; i < n; i++) {
        yearexp[i] = expdate[i].split("-")[0];
      }
      const filteredexpanse = jsonexpense.map((item) => item.amount);
      setFilterExpense(filteredexpanse);
      setYearExpense(yearexp);
      console.log(yearexp);
    } catch (error) {
      console.error(error);
    }
  };

  const p = yearExpense.length;
  const pp = filterExpense.length;
  const indexexp = [];
  const arrayExpense = [];
  for (let i = 0; i < p; i++) {
    if (yearExpense[i] == profitDate) {
      indexexp[i] = i;
    }
  }
  console.log(indexexp);
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < pp; j++) {
      if (indexexp[i] == j) {
        arrayExpense[j] = filterExpense[j];
      }
    }
  }
  let totalExpense = 0;

  arrayExpense.forEach((item) => {
    totalExpense += item;
  });
  console.log(arrayExpense);
  console.log(totalExpense);
  const calculatedProfit = totalIncome - totalExpense;

  console.log(calculatedProfit);
  const percentage = (calculatedProfit * 100) / profitValue;
  console.log(percentage);
 
  const handleSaveRowEdits = useCallback(
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        try {
          // create a new object with only the desired fields
          const editedValues = {
            profit: values.profit,
            year: values.year,
          };

          const response = await fetch(
            `http://localhost:8000/api/goal/${row.original.id}`,
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
              body: JSON.stringify(editedValues),
            }
          );
          if (!response.ok) {
            throw new Error("Failed to update row");
          }
          const data = await response.json();
          // update local table data
          const newData = [...tableData];
          newData[row.index] = data;
          setTableData(newData);
          exitEditingMode(); //required to exit editing mode and close modal
        } catch (error) {
          console.error(error);
        }
      }
    },
    [tableData, validationErrors]
  );

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    async (row) => {
      if (
        !window.confirm(`Are you sure you want to delete ${row.original.id}`)
      ) {
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:8000/api/goal/${row.original.id}`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete row");
        }
        // update local table data
        const newData = [...tableData];
        newData.splice(row.index, 1);
        setTableData(newData);
      } catch (error) {
        console.error(error);
      }
    },
    [tableData]
  );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "age"
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      // {
      //   accessorKey: "totalIncome",
      //   header: "Total Income",
      //   size: 140,
      //   muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
      //     ...getCommonEditTextFieldProps(cell),
      //     type: "number",
      //   }),
      // },
      // {
      //   accessorKey: "totalExpense",
      //   header: "Total Expense",
      //   size: 140,
      //   muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
      //     ...getCommonEditTextFieldProps(cell),
      //     type: "number",
      //   }),
      // },
      {
        accessorKey: "profit",
        header: "Profit",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "year",
        header: "Year",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      // {
      //   accessorKey: "profit_calculated",
      //   header: "Profit Calculated",
      //   size: 80,
      //   muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
      //     ...getCommonEditTextFieldProps(cell),
      //     type: "number",
      //   }),
      // },
      {
        accessorKey: "admin_id",
        header: "Admin ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "created_by",
        header: "Created By",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "string",
        }),
      },
      {
        accessorKey: "updated_by",
        header: "Updated By",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "string",
        }),
      },
      // {
      //   accessorKey: "deleted_by",
      //   header: "Deleted By",
      //   muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
      //     ...getCommonEditTextFieldProps(cell),
      //     type: "string",
      //   }),
      // },
    ],
    [getCommonEditTextFieldProps]
  );

  const pop = useMemo(
    () => [
      {
        accessorKey: "profit",
        header: "Profit",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "year",
        header: "Year",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <>
     <div className="divv">
        <p>0%</p>
        <p>25%</p>
        <p>50%</p>
        <p>75%</p>
        <p>100%</p>
      </div>
      <Box className="bar">
        <BorderLinearProgress variant="determinate" value={percentage} />
        <p className="percentage"> <span style={{color: "#308fe8"}}>Current Value:</span> {percentage}%</p>
      </Box>
     
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Create New Profit
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={pop}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = async () => {
    //put your validation logic here
    try {
      console.log("token ", localStorage.getItem("token"));
      const data = {
        profit: values.profit,
        year: values.year,
      };

      console.log(JSON.stringify(data));

      const res = await Axios.post(
        "http://localhost:8000/api/goal",
        JSON.stringify(data),
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),

            "Content-Type": "application/json",
          },
        }
      );
      onSubmit(values);
      onClose();
    } catch (err) {
      console.log("error ", err);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Profit</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New Profit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default Goal;
